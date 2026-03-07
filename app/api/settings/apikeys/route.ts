import { NextRequest, NextResponse } from 'next/server'
import { getServerSession }          from 'next-auth'
import { authOptions }               from '@/lib/auth'
import { connectDB }                 from '@/lib/mongoose'
import { User }                      from '@/lib/models/User'
import { encrypt, maskKey }           from '@/lib/crypto'
import { validateKeyFormat, getProvider } from '@/lib/providers'
import mongoose                      from 'mongoose'

/* POST /api/settings/apikeys — add or update a provider key */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    // Accept both `key` (new component) and `apiKey` (legacy) field names
    const { provider } = body
    const apiKey: string = body.key ?? body.apiKey

    if (!provider || !apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ error: 'provider and key are required' }, { status: 400 })
    }

    if (!getProvider(provider)) {
      return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
    }

    // Validate key format (prefix check)
    if (!validateKeyFormat(provider, apiKey.trim())) {
      const p = getProvider(provider)!
      return NextResponse.json({
        error: `Invalid ${p.name} API key format. Keys should start with: ${p.keyPrefixes.join(' or ')}`,
      }, { status: 400 })
    }

    await connectDB()
    const uid          = new mongoose.Types.ObjectId((session.user as any).id)
    const encryptedKey = encrypt(apiKey.trim())

    // Upsert the key for this provider (replace if already exists)
    await User.findByIdAndUpdate(uid, {
      $pull: { apiKeys: { provider } },   // remove old entry for this provider
    })
    await User.findByIdAndUpdate(uid, {
      $push: { apiKeys: { provider, encryptedKey, addedAt: new Date() } },
    })

    return NextResponse.json({ ok: true, mask: maskKey(apiKey.trim()) })
  } catch (err: any) {
    console.error('[apikeys POST]', err)
    if (err.message?.includes('ENCRYPTION_KEY')) {
      return NextResponse.json({ error: 'Server configuration error: ENCRYPTION_KEY not set' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

/* DELETE /api/settings/apikeys — remove a provider key */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { provider } = await req.json()
    if (!provider) return NextResponse.json({ error: 'provider is required' }, { status: 400 })

    await connectDB()
    const uid = new mongoose.Types.ObjectId((session.user as any).id)

    await User.findByIdAndUpdate(uid, {
      $pull: { apiKeys: { provider } },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[apikeys DELETE]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
