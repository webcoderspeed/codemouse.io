import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface ReviewResult {
  summary: string
  issues: Issue[]
  positives: string[]
  verdict: 'approve' | 'request_changes' | 'comment'
  reviewMarkdown: string
}

export interface Issue {
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: 'bug' | 'security' | 'performance' | 'style' | 'logic'
  title: string
  description: string
  file?: string
  line?: number
}

const SEVERITY_EMOJI: Record<string, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🔵',
}

const TYPE_EMOJI: Record<string, string> = {
  bug: '🐛',
  security: '🔒',
  performance: '⚡',
  style: '✨',
  logic: '🧠',
}

export async function reviewPullRequest(
  prTitle: string,
  prDescription: string,
  diff: string,
  repoName: string
): Promise<ReviewResult> {

  // Truncate diff to stay within token limits — GPT-4o-mini has 128k ctx
  const trimmedDiff = diff.length > 60000 ? diff.slice(0, 60000) + '\n\n[...diff truncated for length]' : diff

  const systemPrompt = `You are CodeMouse 🐭, an expert AI code reviewer. You review GitHub pull request diffs and provide structured, actionable feedback.

Your job:
1. Identify real bugs, security vulnerabilities, performance problems, and logic errors
2. Be specific — reference file names and line numbers when possible
3. Be constructive — explain WHY something is a problem and HOW to fix it
4. Also mention what the developer did WELL — good code deserves praise
5. Be concise — developers are busy

Respond ONLY with a valid JSON object matching this exact schema:
{
  "summary": "One sentence describing what this PR does",
  "verdict": "approve" | "request_changes" | "comment",
  "issues": [
    {
      "severity": "critical" | "high" | "medium" | "low",
      "type": "bug" | "security" | "performance" | "style" | "logic",
      "title": "Short title",
      "description": "Detailed explanation and suggested fix",
      "file": "filename.ts",
      "line": 42
    }
  ],
  "positives": ["What the developer did well, as short bullet strings"]
}`

  const userPrompt = `Repository: ${repoName}
PR Title: ${prTitle}
PR Description: ${prDescription || 'No description provided'}

--- DIFF ---
${trimmedDiff}
--- END DIFF ---

Review this PR thoroughly.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0].message.content ?? '{}'
  const parsed = JSON.parse(raw) as ReviewResult

  // Build the markdown comment that gets posted to GitHub
  parsed.reviewMarkdown = buildMarkdownComment(parsed, prTitle)

  return parsed
}

function buildMarkdownComment(result: ReviewResult, prTitle: string): string {
  const { summary, issues, positives, verdict } = result

  const verdictBadge =
    verdict === 'approve'          ? '✅ **Looks good to merge**' :
    verdict === 'request_changes'  ? '❌ **Changes requested**' :
                                      '💬 **Review comments**'

  const criticalCount = issues.filter(i => i.severity === 'critical').length
  const highCount     = issues.filter(i => i.severity === 'high').length
  const otherCount    = issues.filter(i => !['critical', 'high'].includes(i.severity)).length

  let md = `## 🐭 CodeMouse AI Review\n\n`
  md += `${verdictBadge}\n\n`
  md += `> ${summary}\n\n`

  if (issues.length > 0) {
    // Stats bar
    md += `| 🔴 Critical | 🟠 High | 🟡 Medium/Low |\n`
    md += `|------------|---------|---------------|\n`
    md += `| ${criticalCount} | ${highCount} | ${otherCount} |\n\n`

    // Group by severity
    const bySeverity = ['critical', 'high', 'medium', 'low'] as const
    for (const sev of bySeverity) {
      const sevIssues = issues.filter(i => i.severity === sev)
      if (sevIssues.length === 0) continue
      md += `### ${SEVERITY_EMOJI[sev]} ${sev.charAt(0).toUpperCase() + sev.slice(1)} Issues\n\n`
      for (const issue of sevIssues) {
        md += `**${TYPE_EMOJI[issue.type] ?? '•'} ${issue.title}**`
        if (issue.file) md += ` — \`${issue.file}\`${issue.line ? `:${issue.line}` : ''}`
        md += `\n\n${issue.description}\n\n`
      }
    }
  } else {
    md += `### ✅ No issues found\n\nGreat work — this PR looks clean!\n\n`
  }

  if (positives && positives.length > 0) {
    md += `### 👏 What you did well\n\n`
    for (const p of positives) {
      md += `- ${p}\n`
    }
    md += `\n`
  }

  md += `---\n`
  md += `*Reviewed by [CodeMouse](https://codemouse.io) 🐭 · AI-powered code review · [Configure](https://codemouse.io/dashboard)*`

  return md
}
