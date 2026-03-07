import mongoose, { Schema, Document, Model } from 'mongoose'

export type Plan = 'free' | 'pro'

export interface IInstallation extends Document {
  installationId:           number
  accountLogin:             string
  accountType:              'User' | 'Organization'
  userId:                   mongoose.Types.ObjectId | null
  plan:                     Plan
  reviewsUsed:              number
  reviewsLimit:             number
  razorpaySubscriptionId:   string
  razorpayCustomerId:       string
  createdAt:                Date
  updatedAt:                Date
}

const InstallationSchema = new Schema<IInstallation>(
  {
    installationId:         { type: Number, required: true, unique: true, index: true },
    accountLogin:           { type: String, required: true },
    accountType:            { type: String, enum: ['User', 'Organization'], default: 'User' },
    userId:                 { type: Schema.Types.ObjectId, ref: 'User', default: null },
    plan:                   { type: String, enum: ['free', 'pro'], default: 'free' },
    reviewsUsed:            { type: Number, default: 0 },
    reviewsLimit:           { type: Number, default: 30 },
    razorpaySubscriptionId: { type: String, default: '' },
    razorpayCustomerId:     { type: String, default: '' },
  },
  { timestamps: true }
)

InstallationSchema.index({ userId: 1 })

export const Installation: Model<IInstallation> =
  mongoose.models.Installation ??
  mongoose.model<IInstallation>('Installation', InstallationSchema)
