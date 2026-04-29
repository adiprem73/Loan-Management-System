import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  loan: mongoose.Types.ObjectId;
  action: string;
  performedBy: mongoose.Types.ObjectId;
  fromStatus?: string;
  toStatus?: string;
  note?: string;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    loan:        { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
    action:      { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fromStatus:  { type: String },
    toStatus:    { type: String },
    note:        { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);