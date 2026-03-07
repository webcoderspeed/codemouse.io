import mongoose, { Schema, Document, Model } from 'mongoose'
import { DEFAULT_PROVIDER, DEFAULT_MODEL }   from '../providers'

export interface ApiKeyEntry {
  provider:     string   // 'openai' | 'anthropic' | 'gemini' | 'groq'
  encryptedKey: string   // AES-256-GCM encrypted — never exposed raw
  addedAt:      Date
}

export interface IUser extends Document {
  githubId:         number
  githubLogin:      string
  email:            string
  name:             string
  avatarUrl:        string
  apiKeys:          ApiKeyEntry[]
  selectedProvider: string   // which provider to use for reviews
  selectedModel:    string   // which model to use for reviews
  createdAt:        Date
}

const ApiKeyEntrySchema = new Schema<ApiKeyEntry>(
  {
    provider:     { type: String, required: true },
    encryptedKey: { type: String, required: true },
    addedAt:      { type: Date,   default: Date.now },
  },
  { _id: false }
)

const UserSchema = new Schema<IUser>(
  {
    githubId:         { type: Number, required: true, unique: true, index: true },
    githubLogin:      { type: String, required: true },
    email:            { type: String, required: true },
    name:             { type: String, default: '' },
    avatarUrl:        { type: String, default: '' },
    apiKeys:          { type: [ApiKeyEntrySchema], default: [] },
    selectedProvider: { type: String, default: DEFAULT_PROVIDER },
    selectedModel:    { type: String, default: DEFAULT_MODEL    },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)
