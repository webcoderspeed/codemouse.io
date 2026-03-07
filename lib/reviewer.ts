/**
 * Multi-provider AI reviewer
 * Supports: OpenAI, Anthropic, Google Gemini (OpenAI-compat), Groq (OpenAI-compat)
 */

import OpenAI     from 'openai'
import Anthropic  from '@anthropic-ai/sdk'

export interface ReviewResult {
  summary:        string
  issues:         Issue[]
  positives:      string[]
  verdict:        'approve' | 'request_changes' | 'comment'
  reviewMarkdown: string
}

export interface Issue {
  severity:    'critical' | 'high' | 'medium' | 'low'
  type:        'bug' | 'security' | 'performance' | 'style' | 'logic'
  title:       string
  description: string
  file?:       string
  line?:       number
}

/* ── Prompt ──────────────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are CodeMouse, an expert AI code reviewer. You review GitHub pull request diffs and provide structured, actionable feedback.

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

function buildUserPrompt(prTitle: string, prDesc: string, diff: string, repoName: string): string {
  const trimmedDiff = diff.length > 60000
    ? diff.slice(0, 60000) + '\n\n[...diff truncated for length]'
    : diff

  return `Repository: ${repoName}
PR Title: ${prTitle}
PR Description: ${prDesc || 'No description provided'}

--- DIFF ---
${trimmedDiff}
--- END DIFF ---

Review this PR thoroughly.`
}

/* ── Provider implementations ───────────────────────────────────────────── */

async function reviewWithOpenAI(
  userPrompt: string, apiKey: string, model: string
): Promise<string> {
  const openai   = new OpenAI({ apiKey })
  const response = await openai.chat.completions.create({
    model,
    messages:        [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: userPrompt    },
    ],
    temperature:     0.2,
    response_format: { type: 'json_object' },
  })
  return response.choices[0].message.content ?? '{}'
}

async function reviewWithAnthropic(
  userPrompt: string, apiKey: string, model: string
): Promise<string> {
  const client   = new Anthropic({ apiKey })
  const response = await client.messages.create({
    model,
    max_tokens: 2048,
    system:     SYSTEM_PROMPT,
    messages:   [{ role: 'user', content: userPrompt }],
  })
  const block = response.content[0]
  return block.type === 'text' ? block.text : '{}'
}

async function reviewWithGemini(
  userPrompt: string, apiKey: string, model: string
): Promise<string> {
  // Gemini supports OpenAI-compatible API
  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  })
  const response = await openai.chat.completions.create({
    model,
    messages:        [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: userPrompt    },
    ],
    temperature:     0.2,
    response_format: { type: 'json_object' },
  })
  return response.choices[0].message.content ?? '{}'
}

async function reviewWithGroq(
  userPrompt: string, apiKey: string, model: string
): Promise<string> {
  // Groq is OpenAI-compatible
  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  })
  const response = await openai.chat.completions.create({
    model,
    messages:    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: userPrompt    },
    ],
    temperature: 0.2,
    // Note: Groq doesn't support response_format for all models
  })
  return response.choices[0].message.content ?? '{}'
}

/* ── Main entry point ────────────────────────────────────────────────────── */

export async function reviewPullRequest(
  prTitle:    string,
  prDesc:     string,
  diff:       string,
  repoName:   string,
  apiKey:     string,
  provider:   string,
  model:      string,
): Promise<ReviewResult> {

  if (!apiKey) throw new Error('No API key provided.')

  const userPrompt = buildUserPrompt(prTitle, prDesc, diff, repoName)

  let raw: string

  switch (provider) {
    case 'anthropic':
      raw = await reviewWithAnthropic(userPrompt, apiKey, model)
      break
    case 'gemini':
      raw = await reviewWithGemini(userPrompt, apiKey, model)
      break
    case 'groq':
      raw = await reviewWithGroq(userPrompt, apiKey, model)
      break
    case 'openai':
    default:
      raw = await reviewWithOpenAI(userPrompt, apiKey, model)
      break
  }

  // Extract JSON even if model wrapped it in markdown code fences
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  const parsed    = JSON.parse(jsonMatch ? jsonMatch[0] : raw) as ReviewResult

  parsed.reviewMarkdown = buildMarkdownComment(parsed, provider, model)

  return parsed
}

/* ── Markdown comment builder ────────────────────────────────────────────── */

const SEV_EMOJI: Record<string, string> = {
  critical: '🔴', high: '🟠', medium: '🟡', low: '🔵',
}

const TYPE_EMOJI: Record<string, string> = {
  bug: '🐛', security: '🔒', performance: '⚡', style: '✨', logic: '🧠',
}

const MODEL_LABELS: Record<string, string> = {
  openai:    'OpenAI',
  anthropic: 'Anthropic',
  gemini:    'Gemini',
  groq:      'Groq',
}

function buildMarkdownComment(result: ReviewResult, provider: string, model: string): string {
  const { summary, issues, positives, verdict } = result

  const verdictBadge =
    verdict === 'approve'         ? '✅ **Looks good to merge**' :
    verdict === 'request_changes' ? '❌ **Changes requested**'   :
                                     '💬 **Review comments**'

  const critical = issues.filter(i => i.severity === 'critical').length
  const high     = issues.filter(i => i.severity === 'high').length
  const other    = issues.filter(i => !['critical', 'high'].includes(i.severity)).length

  let md = `## CodeMouse AI Review\n\n`
  md += `${verdictBadge}\n\n`
  md += `> ${summary}\n\n`

  if (issues.length > 0) {
    md += `| 🔴 Critical | 🟠 High | 🟡 Medium/Low |\n`
    md += `|------------|---------|---------------|\n`
    md += `| ${critical} | ${high} | ${other} |\n\n`

    for (const sev of ['critical', 'high', 'medium', 'low'] as const) {
      const sevIssues = issues.filter(i => i.severity === sev)
      if (!sevIssues.length) continue
      md += `### ${SEV_EMOJI[sev]} ${sev.charAt(0).toUpperCase() + sev.slice(1)} Issues\n\n`
      for (const issue of sevIssues) {
        md += `**${TYPE_EMOJI[issue.type] ?? '•'} ${issue.title}**`
        if (issue.file) md += ` — \`${issue.file}\`${issue.line ? `:${issue.line}` : ''}`
        md += `\n\n${issue.description}\n\n`
      }
    }
  } else {
    md += `### ✅ No issues found\n\nGreat work — this PR looks clean!\n\n`
  }

  if (positives?.length) {
    md += `### What you did well\n\n`
    for (const p of positives) md += `- ${p}\n`
    md += `\n`
  }

  const label = MODEL_LABELS[provider] ?? provider
  md += `---\n`
  md += `*Reviewed by [CodeMouse](https://codemouse.io) · ${label} ${model} · [Configure](https://codemouse.io/settings)*`

  return md
}
