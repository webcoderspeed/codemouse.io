/**
 * AES-256-GCM encryption for sensitive data (API keys)
 * Format stored in DB: iv:authTag:ciphertext  (all hex)
 *
 * Requires env:  ENCRYPTION_KEY=<64 hex chars>
 * Generate with: openssl rand -hex 32
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGO = 'aes-256-gcm'

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY
  if (!hex || hex.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY env var must be exactly 64 hex chars (32 bytes).\n' +
      'Generate one with:  openssl rand -hex 32'
    )
  }
  return Buffer.from(hex, 'hex')
}

/** Encrypt a plaintext string → storable hex string */
export function encrypt(plaintext: string): string {
  const key    = getKey()
  const iv     = randomBytes(16)
  const cipher = createCipheriv(ALGO, key, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':')
}

/** Decrypt a stored hex string → original plaintext */
export function decrypt(ciphertext: string): string {
  const key    = getKey()
  const parts  = ciphertext.split(':')
  if (parts.length !== 3) throw new Error('Invalid ciphertext — expected iv:authTag:data')

  const [ivHex, authTagHex, encHex] = parts
  const iv       = Buffer.from(ivHex,      'hex')
  const authTag  = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encHex,    'hex')

  const decipher = createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString('utf8')
}

/** Show first 6 + last 4 chars, rest masked */
export function maskKey(key: string): string {
  if (key.length <= 12) return '••••••••••••'
  return key.slice(0, 6) + '••••••••••••' + key.slice(-4)
}
