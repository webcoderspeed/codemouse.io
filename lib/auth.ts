import { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { upsertUser } from './db'
import { sendWelcomeEmail } from './mailer'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: 'read:user user:email' } },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false
      const gh = profile as any

      try {
        const isNew = !(await import('./models/User').then(m =>
          m.User.exists({ githubId: gh.id })
        ))

        await upsertUser({
          githubId:    gh.id,
          githubLogin: gh.login,
          email:       user.email,
          name:        user.name ?? '',
          avatarUrl:   user.image ?? '',
        })

        // Send welcome email only on first sign-in
        if (isNew && user.email) {
          sendWelcomeEmail(user.email, user.name ?? 'there')
            .catch(e => console.error('[mailer] welcome email failed:', e))
        }
      } catch (e) {
        console.error('[auth] upsertUser error:', e)
      }
      return true
    },

    async jwt({ token, profile, account }) {
      if (profile) {
        const gh  = profile as any
        token.login    = gh.login
        token.githubId = gh.id

        // Fetch MongoDB _id and store in JWT
        try {
          const { User } = await import('./models/User')
          const dbUser   = await User.findOne({ githubId: gh.id }).select('_id').lean()
          if (dbUser) token.dbId = (dbUser as any)._id.toString()
        } catch (e) {
          console.error('[auth] jwt callback error:', e)
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id          = token.dbId as string
        ;(session.user as any).githubLogin = token.login as string
        ;(session.user as any).githubId    = token.githubId as number
      }
      return session
    },
  },

  pages: { signIn: '/dashboard' },
  secret: process.env.NEXTAUTH_SECRET,
}
