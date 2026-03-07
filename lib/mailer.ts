import nodemailer from 'nodemailer'
import type { IInvoice } from './models/Invoice'

// ── Transporter (works with Gmail, Zoho, AWS SES, Brevo, etc.) ────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST!,
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
})

const FROM = `CodeMouse 🐭 <${process.env.SMTP_FROM ?? 'noreply@codemouse.io'}>`

// ── Shared layout wrapper ─────────────────────────────────────────────────────
function layout(content: string, previewText = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CodeMouse</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e6edf3; }
    a { color: #22c55e; text-decoration: none; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo-text { font-size: 22px; font-weight: 800; color: #fff; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 40px; }
    h1 { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 12px; line-height: 1.3; }
    h2 { font-size: 18px; font-weight: 700; color: #e6edf3; margin-bottom: 8px; }
    p { color: #8b949e; font-size: 15px; line-height: 1.7; margin-bottom: 16px; }
    .btn { display: inline-block; background: #22c55e; color: #fff !important; font-weight: 700;
           padding: 14px 32px; border-radius: 10px; font-size: 15px; margin: 8px 0; }
    .btn-outline { display: inline-block; border: 2px solid #30363d; color: #e6edf3 !important;
                   font-weight: 600; padding: 12px 28px; border-radius: 10px; font-size: 14px; }
    .divider { border: none; border-top: 1px solid #21262d; margin: 28px 0; }
    .badge { display: inline-block; background: #1a3828; border: 1px solid #22c55e40; color: #22c55e;
             font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
    .badge-red { background: #3d1a1a; border-color: #f8514940; color: #f85149; }
    .badge-yellow { background: #2d2500; border-color: #d2972040; color: #d29720; }
    table.invoice-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
    table.invoice-table th { text-align: left; color: #8b949e; padding: 8px 0; border-bottom: 1px solid #21262d; font-weight: 600; }
    table.invoice-table td { padding: 10px 0; border-bottom: 1px solid #161b22; color: #e6edf3; }
    .amount-row td { font-weight: 700; color: #22c55e; font-size: 16px; border-bottom: none; }
    .meta { background: #0d1117; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .meta-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
    .meta-label { color: #8b949e; }
    .meta-value { color: #e6edf3; font-weight: 600; }
    .issue-item { background: #0d1117; border-radius: 8px; padding: 12px 16px; margin: 8px 0; border-left: 3px solid #22c55e; }
    .issue-item.critical { border-color: #f85149; }
    .issue-item.high { border-color: #d29720; }
    .footer { text-align: center; margin-top: 32px; }
    .footer p { font-size: 12px; color: #484f58; }
    .footer a { color: #484f58; text-decoration: underline; }
    @media (max-width: 480px) { .card { padding: 24px; } h1 { font-size: 22px; } }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="wrapper">
    <div class="logo">
      <span class="logo-text">🐭 CodeMouse</span>
    </div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      <p>CodeMouse · AI Code Reviews for GitHub</p>
      <p><a href="https://codemouse.io">codemouse.io</a> · <a href="https://codemouse.io/dashboard">Dashboard</a> · <a href="mailto:support@codemouse.io">Support</a></p>
      <p style="margin-top:8px;">You&apos;re receiving this because you signed up for CodeMouse.</p>
    </div>
  </div>
</body>
</html>`
}

// ═══════════════════════════════════════════════════════════════════════════════
//  1. WELCOME — sent when user signs up for the first time
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const firstName = name.split(' ')[0] || 'there'
  const html = layout(`
    <h1>Welcome to CodeMouse 🐭</h1>
    <p>Hey ${firstName},</p>
    <p>You just joined <strong style="color:#fff;">CodeMouse</strong> — the AI bot that reviews every pull request on your GitHub repos automatically, so you never ship a bug that could've been caught in review.</p>
    <p>Here's how to get started in 3 steps:</p>
    <div class="meta">
      <div style="padding:8px 0; border-bottom:1px solid #21262d; font-size:14px; color:#e6edf3;">
        <strong style="color:#22c55e;">Step 1 →</strong> Install CodeMouse on your GitHub repos from your dashboard
      </div>
      <div style="padding:8px 0; border-bottom:1px solid #21262d; font-size:14px; color:#e6edf3;">
        <strong style="color:#22c55e;">Step 2 →</strong> Open any pull request — CodeMouse will auto-review it within 60 seconds
      </div>
      <div style="padding:8px 0; font-size:14px; color:#e6edf3;">
        <strong style="color:#22c55e;">Step 3 →</strong> Start catching bugs before they hit production 🎉
      </div>
    </div>
    <p style="text-align:center; margin-top:24px;">
      <a href="https://codemouse.io/dashboard" class="btn">Go to Dashboard →</a>
    </p>
    <hr class="divider" />
    <p style="font-size:13px; color:#484f58;">
      Free plan: 30 PR reviews/month on private repos (unlimited on public).
      Upgrade to Pro anytime at ₹599/month.
    </p>
  `, `Welcome to CodeMouse — AI code reviews on every PR`)
  await transporter.sendMail({ from: FROM, to, subject: '🐭 Welcome to CodeMouse — your AI code reviewer is ready', html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  2. GITHUB APP INSTALLED — sent when user installs the bot on a repo
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendAppInstalledEmail(to: string, name: string, accountLogin: string): Promise<void> {
  const firstName = name.split(' ')[0] || 'there'
  const html = layout(`
    <h1>CodeMouse is live on <span style="color:#22c55e;">@${accountLogin}</span> 🚀</h1>
    <p>Hey ${firstName},</p>
    <p>CodeMouse is now installed on <strong style="color:#fff;">${accountLogin}</strong>. Every time a PR is opened, you'll get an automatic AI review posted as a bot comment within 60 seconds.</p>
    <p>Your free plan includes:</p>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">✅ Public repos</span><span class="meta-value">Unlimited reviews</span></div>
      <div class="meta-row"><span class="meta-label">🔐 Private repos</span><span class="meta-value">30 reviews / month</span></div>
      <div class="meta-row"><span class="meta-label">⚡ Review speed</span><span class="meta-value">&lt; 60 seconds</span></div>
    </div>
    <p>Go ahead — open a test PR and watch the magic happen.</p>
    <p style="text-align:center; margin-top:24px;">
      <a href="https://github.com/${accountLogin}" class="btn">View @${accountLogin} on GitHub →</a>
    </p>
    <hr class="divider" />
    <p style="font-size:13px; color:#484f58;">
      Need unlimited private reviews? <a href="https://codemouse.io/pricing">Upgrade to Pro</a> for ₹599/month.
    </p>
  `, `CodeMouse is now reviewing PRs on @${accountLogin}`)
  await transporter.sendMail({ from: FROM, to, subject: `✅ CodeMouse installed on @${accountLogin} — reviews are live`, html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  3. PAYMENT SUCCESS + INVOICE — sent immediately after payment
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendPaymentSuccessEmail(to: string, name: string, invoice: IInvoice): Promise<void> {
  const firstName = name.split(' ')[0] || 'there'
  const periodStart = invoice.billingPeriodStart instanceof Date
    ? invoice.billingPeriodStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : String(invoice.billingPeriodStart)
  const periodEnd = invoice.billingPeriodEnd instanceof Date
    ? invoice.billingPeriodEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : String(invoice.billingPeriodEnd)
  const paidAt = invoice.paidAt instanceof Date
    ? invoice.paidAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : String(invoice.paidAt)

  const html = layout(`
    <div style="text-align:center; margin-bottom:28px;">
      <div style="font-size:48px; margin-bottom:8px;">🎉</div>
      <span class="badge">Payment Successful</span>
    </div>
    <h1 style="text-align:center;">You're on Pro!</h1>
    <p style="text-align:center;">Hey ${firstName}, your payment was successful. CodeMouse Pro is now active on <strong style="color:#fff;">@${invoice.accountLogin}</strong>.</p>
    <hr class="divider" />
    <h2>Invoice</h2>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">Invoice No.</span><span class="meta-value">${invoice.invoiceNumber}</span></div>
      <div class="meta-row"><span class="meta-label">Payment ID</span><span class="meta-value" style="font-family:monospace;font-size:12px;">${invoice.razorpayPaymentId}</span></div>
      <div class="meta-row"><span class="meta-label">Paid on</span><span class="meta-value">${paidAt}</span></div>
      <div class="meta-row"><span class="meta-label">Billing period</span><span class="meta-value">${periodStart} – ${periodEnd}</span></div>
    </div>
    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align:right;">₹${item.total.toFixed(2)}</td>
        </tr>`).join('')}
      </tbody>
      <tfoot>
        <tr class="amount-row">
          <td><strong>Total Paid</strong></td>
          <td style="text-align:right;"><strong>₹${invoice.amountInRupees.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
    </table>
    <hr class="divider" />
    <h2>What's unlocked</h2>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">✅ Unlimited PR reviews</span><span class="meta-value">Active</span></div>
      <div class="meta-row"><span class="meta-label">⚡ Priority queue</span><span class="meta-value">Active</span></div>
      <div class="meta-row"><span class="meta-label">📊 Review history</span><span class="meta-value">Active</span></div>
    </div>
    <p style="text-align:center; margin-top:24px;">
      <a href="https://codemouse.io/dashboard" class="btn">Go to Dashboard →</a>
    </p>
    <hr class="divider" />
    <p style="font-size:13px; color:#484f58;">
      Keep this email as your payment receipt. Need help? <a href="mailto:support@codemouse.io">support@codemouse.io</a>
    </p>
  `, `Payment confirmed — CodeMouse Pro is active`)
  await transporter.sendMail({ from: FROM, to, subject: `🎉 Payment confirmed — CodeMouse Pro active on @${invoice.accountLogin} · ${invoice.invoiceNumber}`, html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  4. MONTHLY INVOICE REMINDER
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendMonthlyInvoiceEmail(to: string, name: string, invoice: IInvoice): Promise<void> {
  const firstName = name.split(' ')[0] || 'there'
  const periodStart = invoice.billingPeriodStart instanceof Date
    ? invoice.billingPeriodStart.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : String(invoice.billingPeriodStart)

  const html = layout(`
    <h1>Your ${periodStart} Invoice</h1>
    <p>Hey ${firstName}, here's your CodeMouse Pro invoice for <strong style="color:#fff;">${periodStart}</strong>.</p>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">Invoice No.</span><span class="meta-value">${invoice.invoiceNumber}</span></div>
      <div class="meta-row"><span class="meta-label">Account</span><span class="meta-value">@${invoice.accountLogin}</span></div>
      <div class="meta-row"><span class="meta-label">Plan</span><span class="meta-value">CodeMouse Pro</span></div>
    </div>
    <table class="invoice-table">
      <thead><tr><th>Description</th><th style="text-align:right;">Amount</th></tr></thead>
      <tbody>
        ${invoice.items.map(item => `<tr><td>${item.description}</td><td style="text-align:right;">₹${item.total.toFixed(2)}</td></tr>`).join('')}
      </tbody>
      <tfoot>
        <tr class="amount-row">
          <td><strong>Total</strong></td>
          <td style="text-align:right;"><strong>₹${invoice.amountInRupees.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
    </table>
    <p style="text-align:center; margin-top:24px;">
      <a href="https://codemouse.io/dashboard" class="btn">View Invoices →</a>
    </p>
  `, `Your CodeMouse invoice for ${periodStart}`)
  await transporter.sendMail({ from: FROM, to, subject: `🧾 CodeMouse Invoice — ${periodStart} · ${invoice.invoiceNumber}`, html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  5. USAGE WARNING — sent at 80% of free limit
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendUsageWarningEmail(
  to: string, name: string,
  used: number, limit: number, accountLogin: string
): Promise<void> {
  const firstName = name.split(' ')[0] || 'there'
  const remaining = limit - used
  const html = layout(`
    <div style="text-align:center; margin-bottom:24px;">
      <span class="badge badge-yellow">⚠️ Usage Warning</span>
    </div>
    <h1>Running low on reviews</h1>
    <p>Hey ${firstName}, you've used <strong style="color:#d29720;">${used} of ${limit} reviews</strong> this month on <strong style="color:#fff;">@${accountLogin}</strong>.</p>
    <p>You have <strong style="color:#fff;">${remaining} reviews left</strong> before CodeMouse stops reviewing PRs until next month.</p>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">Reviews used</span><span class="meta-value" style="color:#d29720;">${used} / ${limit}</span></div>
      <div class="meta-row"><span class="meta-label">Remaining</span><span class="meta-value">${remaining}</span></div>
      <div class="meta-row"><span class="meta-label">Resets on</span><span class="meta-value">1st of next month</span></div>
    </div>
    <p>Upgrade to Pro to get <strong style="color:#22c55e;">unlimited reviews</strong> — never miss a review again.</p>
    <p style="text-align:center; margin-top:24px;">
      <a href="https://codemouse.io/pricing" class="btn">Upgrade to Pro — ₹599/mo →</a>
    </p>
    <p style="text-align:center;">
      <a href="https://codemouse.io/dashboard" class="btn-outline">View Dashboard</a>
    </p>
  `, `You've used 80% of your CodeMouse reviews this month`)
  await transporter.sendMail({ from: FROM, to, subject: `⚠️ Running low on reviews — ${remaining} left this month`, html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  6. LIMIT REACHED — sent when free limit is hit
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendLimitReachedEmail(to: string, name: string, accountLogin: string): Promise<void> {
  const firstName = name.split(' ')[0] || 'there'
  const html = layout(`
    <div style="text-align:center; margin-bottom:24px;">
      <span class="badge badge-red">🔴 Limit Reached</span>
    </div>
    <h1>You've hit your review limit</h1>
    <p>Hey ${firstName}, CodeMouse has used all <strong style="color:#f85149;">30 free reviews</strong> this month on <strong style="color:#fff;">@${accountLogin}</strong>.</p>
    <p>New PRs won't be automatically reviewed until your limit resets on the <strong>1st of next month</strong>. Upgrade to Pro to keep the reviews flowing — right now.</p>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">Status</span><span class="meta-value" style="color:#f85149;">❌ Paused — limit reached</span></div>
      <div class="meta-row"><span class="meta-label">Resets on</span><span class="meta-value">1st of next month</span></div>
      <div class="meta-row"><span class="meta-label">Pro plan</span><span class="meta-value">₹599/month · Unlimited</span></div>
    </div>
    <p style="text-align:center; margin-top:24px;">
      <a href="https://codemouse.io/pricing" class="btn">Upgrade Now — ₹599/mo →</a>
    </p>
    <p style="font-size:13px; text-align:center; color:#484f58; margin-top:12px;">
      Or wait until next month when your free limit resets automatically.
    </p>
  `, `Review limit reached — upgrade to keep getting reviews`)
  await transporter.sendMail({ from: FROM, to, subject: `🔴 CodeMouse paused on @${accountLogin} — review limit reached`, html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  7. PLAN UPGRADED — confirmation after upgrade
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendPlanUpgradedEmail(to: string, name: string, accountLogin: string): Promise<void> {
  const firstName = name.split(' ')[0] || 'there'
  const html = layout(`
    <div style="text-align:center; margin-bottom:24px;">
      <div style="font-size:52px;">⭐</div>
    </div>
    <h1 style="text-align:center;">You're on Pro!</h1>
    <p style="text-align:center;">Hey ${firstName}, <strong style="color:#fff;">@${accountLogin}</strong> is now on CodeMouse Pro. Unlimited reviews, priority queue, full history — all unlocked.</p>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">✅ Unlimited PR reviews</span><span class="meta-value">Active</span></div>
      <div class="meta-row"><span class="meta-label">⚡ Priority review queue</span><span class="meta-value">Active</span></div>
      <div class="meta-row"><span class="meta-label">📊 Full review history</span><span class="meta-value">Active</span></div>
      <div class="meta-row"><span class="meta-label">👥 Up to 10 team members</span><span class="meta-value">Active</span></div>
    </div>
    <p style="text-align:center; margin-top:24px;">
      <a href="https://codemouse.io/dashboard" class="btn">View Dashboard →</a>
    </p>
  `, `CodeMouse Pro is now active on @${accountLogin}`)
  await transporter.sendMail({ from: FROM, to, subject: `⭐ CodeMouse Pro is live on @${accountLogin} — unlimited reviews unlocked`, html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  8. PLAN CANCELLED
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendPlanCancelledEmail(to: string, name: string, accountLogin: string, expiryDate: string): Promise<void> {
  const firstName = name.split(' ')[0] || 'there'
  const html = layout(`
    <h1>Your Pro plan has been cancelled</h1>
    <p>Hey ${firstName}, we've cancelled your CodeMouse Pro plan for <strong style="color:#fff;">@${accountLogin}</strong>.</p>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">Account</span><span class="meta-value">@${accountLogin}</span></div>
      <div class="meta-row"><span class="meta-label">Pro access until</span><span class="meta-value">${expiryDate}</span></div>
      <div class="meta-row"><span class="meta-label">After that</span><span class="meta-value">Free plan (30 reviews/mo)</span></div>
    </div>
    <p>You'll continue to get Pro features until the end of your billing period. After that, you'll be moved to the free plan (30 reviews/month on private repos).</p>
    <p>Changed your mind? Reactivate anytime.</p>
    <p style="text-align:center; margin-top:24px;">
      <a href="https://codemouse.io/pricing" class="btn">Reactivate Pro →</a>
    </p>
    <hr class="divider" />
    <p style="font-size:13px; color:#484f58;">If you cancelled by mistake or have questions, email us at <a href="mailto:support@codemouse.io">support@codemouse.io</a></p>
  `, `Your CodeMouse Pro plan has been cancelled`)
  await transporter.sendMail({ from: FROM, to, subject: `CodeMouse Pro cancelled — access until ${expiryDate}`, html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  9. PR REVIEW COMPLETE NOTIFICATION (digest — optional)
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendReviewCompleteEmail(
  to: string,
  name: string,
  repoFullName: string,
  prTitle: string,
  prNumber: number,
  prUrl: string,
  issuesFound: number,
  verdict: string
): Promise<void> {
  const firstName  = name.split(' ')[0] || 'there'
  const verdictLabel =
    verdict === 'approve'         ? '✅ Looks good to merge' :
    verdict === 'request_changes' ? '❌ Changes requested' :
                                    '💬 Review comments added'
  const html = layout(`
    <h1>PR Review Complete</h1>
    <p>Hey ${firstName}, CodeMouse just reviewed a PR in <strong style="color:#fff;">${repoFullName}</strong>.</p>
    <div class="meta">
      <div class="meta-row"><span class="meta-label">PR</span><span class="meta-value">#${prNumber} · ${prTitle}</span></div>
      <div class="meta-row"><span class="meta-label">Verdict</span><span class="meta-value">${verdictLabel}</span></div>
      <div class="meta-row"><span class="meta-label">Issues found</span><span class="meta-value" style="color:${issuesFound > 0 ? '#d29720' : '#22c55e'}">${issuesFound === 0 ? '✅ None' : `⚠️ ${issuesFound}`}</span></div>
    </div>
    <p style="text-align:center; margin-top:24px;">
      <a href="${prUrl}" class="btn">View Review on GitHub →</a>
    </p>
  `, `CodeMouse reviewed PR #${prNumber} in ${repoFullName}`)
  await transporter.sendMail({ from: FROM, to, subject: `🐭 PR #${prNumber} reviewed — ${issuesFound === 0 ? 'No issues found' : `${issuesFound} issue${issuesFound > 1 ? 's' : ''} found`} · ${repoFullName}`, html })
}

// ═══════════════════════════════════════════════════════════════════════════════
//  10. PASSWORD / MAGIC LINK (for future email-based auth)
// ═══════════════════════════════════════════════════════════════════════════════
export async function sendMagicLinkEmail(to: string, magicLink: string): Promise<void> {
  const html = layout(`
    <h1>Sign in to CodeMouse</h1>
    <p>Click the button below to sign in. This link expires in 10 minutes and can only be used once.</p>
    <p style="text-align:center; margin:28px 0;">
      <a href="${magicLink}" class="btn">Sign In →</a>
    </p>
    <hr class="divider" />
    <p style="font-size:13px; color:#484f58;">If you didn't request this, you can safely ignore this email.</p>
  `, `Your CodeMouse sign-in link`)
  await transporter.sendMail({ from: FROM, to, subject: '🔐 Your CodeMouse sign-in link (expires in 10 min)', html })
}
