import { NextRequest, NextResponse } from 'next/server'
import { getServerSession }          from 'next-auth'
import { authOptions }               from '@/lib/auth'
import { connectDB }                 from '@/lib/mongoose'
import { User }                      from '@/lib/models/User'
import { getProvider, getModel }     from '@/lib/providers'
import mongoose                      from 'mongoose'

/* POST /api/settings/activemodel — save selected provider + model */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { provider, model } = await req.json()

    if (!provider || !model) {
      return NextResponse.json({ error: 'provider and model are required' }, { status: 400 })
    }

    if (!getProvider(provider)) {
      return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
    }

    if (!getModel(provider, model)) {
      return NextResponse.json({ error: 'Unknown model for this provider' }, { status: 400 })
    }

    await connectDB()
    const uid = new mongoose.Types.ObjectId((session.user as any).id)
    await User.findByIdAndUpdate(uid, {
      $set: { selectedProvider: provider, selectedModel: model },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[activemodel POST]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
