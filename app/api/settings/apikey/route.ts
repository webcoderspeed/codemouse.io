import { NextRequest, NextResponse } from 'next/server'
import { getServerSession }          from 'next-auth'
import { authOptions }               from '@/lib/auth'
import { connectDB }                 from '@/lib/mongoose'
import { User }                      from '@/lib/models/User'
import mongoose                      from 'mongoose'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { apiKey } = await req.json()
    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 400 })
    }

    // Basic format check — OpenAI keys start with sk-
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json({ error: 'Invalid OpenAI API key format. Keys must start with sk-' }, { status: 400 })
    }

    await connectDB()
    const uid = new mongoose.Types.ObjectId((session.user as any).id)
    await User.findByIdAndUpdate(uid, { openaiApiKey: apiKey.trim() })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[settings/apikey] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const uid = new mongoose.Types.ObjectId((session.user as any).id)
    await User.findByIdAndUpdate(uid, { openaiApiKey: '' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[settings/apikey] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
