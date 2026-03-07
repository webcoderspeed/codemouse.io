# 🐭 CodeMouse — AI Code Review Bot for GitHub

> Automatically reviews every pull request with AI. Install once, get reviews forever.

---

## Stack

| Layer    | Tool                         |
|----------|------------------------------|
| Frontend | Next.js 14 + Tailwind CSS    |
| Auth     | NextAuth (GitHub OAuth)      |
| Database | **MongoDB Atlas** (Mongoose) |
| AI       | OpenAI GPT-4o-mini           |
| Payments | Razorpay (₹599/month)        |
| Email    | **Nodemailer** (SMTP)        |
| Hosting  | Vercel                       |

---

## Email System — 10 Templates

All emails are sent via Nodemailer with a beautiful dark-themed HTML template.

| # | Trigger | Template |
|---|---------|----------|
| 1 | First sign-in | Welcome email |
| 2 | GitHub App installed | "Reviews are live" email |
| 3 | Payment verified | Payment success + Invoice receipt |
| 4 | Monthly renewal | Monthly invoice email |
| 5 | 80% free limit used | Usage warning email |
| 6 | 100% free limit hit | Limit reached + upgrade CTA |
| 7 | Pro plan activated | Plan upgraded confirmation |
| 8 | Pro plan cancelled | Cancellation confirmation |
| 9 | PR review completed | Optional per-review digest |
| 10 | Future email auth | Magic link email |

---

## MongoDB Collections

| Collection    | What's stored |
|---------------|---------------|
| `users`       | GitHub profile, email, avatar |
| `installations` | GitHub App installs, plan, usage counter |
| `reviewlogs`  | Every PR review — repo, PR#, issues found, verdict |
| `invoices`    | Full invoice record: amount, Razorpay IDs, billing period, line items |

---

## 🚀 Deploy in 1 Day

### 1. MongoDB Atlas (5 min — free)
1. [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Database Access → Add user with password
3. Network Access → Allow `0.0.0.0/0` (Vercel IPs)
4. Connect → Drivers → copy the connection string
5. Paste into `MONGODB_URI` in `.env.local`

### 2. GitHub App (15 min)
1. [github.com/settings/apps/new](https://github.com/settings/apps/new)
2. Name: `CodeMouse`, Homepage: `https://codemouse.io`
3. Webhook URL: `https://codemouse.io/api/webhook`
4. Webhook secret: generate a random secret
5. Permissions: Pull requests → **Read & Write**, Contents → **Read**
6. Subscribe to: ✅ Pull request, ✅ Installation
7. Generate private key → download `.pem`

### 3. OpenAI (2 min)
1. [platform.openai.com](https://platform.openai.com) → API Keys → Create key
2. Add $5 credit (lasts ~5,000 reviews with GPT-4o-mini)

### 4. Razorpay (10 min)
1. [razorpay.com](https://razorpay.com) → Create account
2. Settings → API Keys → Generate live keys

### 5. SMTP Email (5 min — Gmail is easiest)
1. Gmail → Settings → Security → 2FA → App Passwords
2. Generate a password for "Mail"
3. Use `smtp.gmail.com:587` with your Gmail + App Password

### 6. Deploy to Vercel (5 min)
1. Push repo to GitHub
2. [vercel.com](https://vercel.com) → Import repo
3. Add all env vars from `.env.example`
4. Add domain `codemouse.io` in Vercel → Domains
5. Deploy!

---

## Project Structure

```
codemouse-app/
├── app/
│   ├── page.tsx                       ← Landing page
│   ├── dashboard/page.tsx             ← Dashboard (repos + reviews + invoices tabs)
│   ├── pricing/page.tsx               ← Pricing page
│   └── api/
│       ├── webhook/route.ts           ← GitHub PR webhook (core engine)
│       ├── auth/[...nextauth]/        ← GitHub OAuth
│       ├── razorpay/
│       │   ├── create-order/          ← Creates Razorpay order
│       │   └── verify/                ← Verifies payment, stores invoice, sends email
│       └── dashboard/
│           ├── installations/         ← User's GitHub installations
│           ├── reviews/               ← PR review history
│           └── invoices/              ← Billing history
├── lib/
│   ├── reviewer.ts                    ← OpenAI code review engine
│   ├── github.ts                      ← GitHub App auth + API helpers
│   ├── mailer.ts                      ← Nodemailer + all 10 email templates
│   ├── db.ts                          ← All MongoDB operations
│   ├── mongoose.ts                    ← MongoDB connection (cached)
│   ├── auth.ts                        ← NextAuth config (sends welcome email)
│   └── models/
│       ├── User.ts                    ← User schema
│       ├── Installation.ts            ← Installation schema
│       ├── ReviewLog.ts               ← Review log schema
│       └── Invoice.ts                 ← Invoice schema (full billing record)
├── components/
│   └── Providers.tsx
├── .env.example                       ← All env vars documented
└── README.md
```

---

## Cost Breakdown

| Service   | Cost             |
|-----------|-----------------|
| Vercel    | $0 (free tier)  |
| MongoDB   | $0 (free tier)  |
| OpenAI    | ~$0.50/100 PRs  |
| Razorpay  | 2% per txn      |
| Gmail     | $0              |
| **Total** | **< $2/month**  |

**Revenue target:** 10 Pro repos at ₹599 = **₹5,990/month (~$70 USD)** with near-zero costs.

---

## Launch Checklist

- [ ] Test end-to-end: install app → open PR → bot comment appears
- [ ] Test payment: Razorpay checkout → Pro activates → invoice email received
- [ ] Post on r/webdev, r/SideProject, r/programming
- [ ] Post on IndieHackers + Product Hunt
- [ ] Tweet a screen recording of the bot reviewing a real PR

Built in 1 day. 🐭
