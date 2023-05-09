import { Schema } from 'mongoose';
import { Comment } from './interface';

const CommentSchema = new Schema<Comment>(
  {
    comment: String,
    url: {
      type: String,
      trim: true,
    },
    ref: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    prescription: { type: Schema.Types.ObjectId, ref: 'Prescription' },
  },
  { timestamps: true }
);

export default CommentSchema;
