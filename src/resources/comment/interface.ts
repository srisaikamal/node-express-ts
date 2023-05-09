import { Document, Schema } from 'mongoose';

export interface Comment {
  comment: string;
  url: string;
  ref: string;
  createdBy: string;
  prescription: string;
}

export interface CommentDocument extends Document, Comment {}
