import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  githubId:    number
  githubLogin: string
  email:       string
  name:        string
  avatarUrl:   string
  createdAt:   Date
}

const UserSchema = new Schema<IUser>(
  {
    githubId:    { type: Number, required: true, unique: true, index: true },
    githubLogin: { type: String, required: true },
    email:       { type: String, required: true },
    name:        { type: String, default: '' },
    avatarUrl:   { type: String, default: '' },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)
