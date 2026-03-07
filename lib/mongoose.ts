import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error('Please set MONGODB_URI in your environment variables')

// Cache connection across hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null
}

let cached = global._mongooseConn

export async function connectDB(): Promise<typeof mongoose> {
  if (cached && mongoose.connection.readyState === 1) return cached

  cached = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  })

  global._mongooseConn = cached
  return cached
}
