import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IInstallation extends Document {
  installationId: number
  accountLogin:   string
  accountType:    'User' | 'Organization'
  userId:         mongoose.Types.ObjectId | null
  reviewsUsed:    number
  createdAt:      Date
  updatedAt:      Date
}

const InstallationSchema = new Schema<IInstallation>(
  {
    installationId: { type: Number, required: true, unique: true, index: true },
    accountLogin:   { type: String, required: true },
    accountType:    { type: String, enum: ['User', 'Organization'], default: 'User' },
    userId:         { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewsUsed:    { type: Number, default: 0 },
  },
  { timestamps: true }
)

InstallationSchema.index({ userId: 1 })

export const Installation: Model<IInstallation> =
  mongoose.models.Installation ??
  mongoose.model<IInstallation>('Installation', InstallationSchema)
