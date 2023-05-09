import { Document } from 'mongoose';

export interface Tag {
  name: string;
  description?: string;
}

export interface TagDocument extends Document, Tag {}
