import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IInvoiceItem {
  description: string
  quantity:    number
  unitPrice:   number
  total:       number
}

export interface IInvoice extends Document {
  invoiceNumber:       string
  installationId:      number
  userId:              mongoose.Types.ObjectId | null
  userEmail:           string
  userName:            string
  accountLogin:        string
  // Razorpay
  razorpayOrderId:     string
  razorpayPaymentId:   string
  // Amount
  amount:              number   // in paise
  amountInRupees:      number
  currency:            string
  // Status
  status:              'pending' | 'paid' | 'failed' | 'refunded'
  // Line items
  items:               IInvoiceItem[]
  // Period
  billingPeriodStart:  Date
  billingPeriodEnd:    Date
  paidAt:              Date | null
  createdAt:           Date
  updatedAt:           Date
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    description: { type: String, required: true },
    quantity:    { type: Number, default: 1 },
    unitPrice:   { type: Number, required: true },
    total:       { type: Number, required: true },
  },
  { _id: false }
)

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber:      { type: String, required: true, unique: true },
    installationId:     { type: Number, required: true, index: true },
    userId:             { type: Schema.Types.ObjectId, ref: 'User', default: null },
    userEmail:          { type: String, required: true },
    userName:           { type: String, default: '' },
    accountLogin:       { type: String, default: '' },
    razorpayOrderId:    { type: String, default: '' },
    razorpayPaymentId:  { type: String, default: '' },
    amount:             { type: Number, required: true },
    amountInRupees:     { type: Number, required: true },
    currency:           { type: String, default: 'INR' },
    status:             { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    items:              [InvoiceItemSchema],
    billingPeriodStart: { type: Date, required: true },
    billingPeriodEnd:   { type: Date, required: true },
    paidAt:             { type: Date, default: null },
  },
  { timestamps: true }
)

InvoiceSchema.index({ userId: 1, createdAt: -1 })
InvoiceSchema.index({ razorpayPaymentId: 1 })

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice ??
  mongoose.model<IInvoice>('Invoice', InvoiceSchema)
