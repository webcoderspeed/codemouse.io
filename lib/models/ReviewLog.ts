import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReviewLog extends Document {
  installationId: number
  repoFullName:   string
  prNumber:       number
  prTitle:        string
  issuesFound:    number
  verdict:        'approve' | 'request_changes' | 'comment'
  createdAt:      Date
}

const ReviewLogSchema = new Schema<IReviewLog>(
  {
    installationId: { type: Number, required: true, index: true },
    repoFullName:   { type: String, required: true },
    prNumber:       { type: Number, required: true },
    prTitle:        { type: String, default: '' },
    issuesFound:    { type: Number, default: 0 },
    verdict:        { type: String, enum: ['approve', 'request_changes', 'comment'], default: 'comment' },
  },
  { timestamps: true }
)

ReviewLogSchema.index({ installationId: 1, createdAt: -1 })

export const ReviewLog: Model<IReviewLog> =
  mongoose.models.ReviewLog ??
  mongoose.model<IReviewLog>('ReviewLog', ReviewLogSchema)
