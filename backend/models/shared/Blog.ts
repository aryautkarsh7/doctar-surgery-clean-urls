import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content?: string;
  contentType?: 'standard' | 'html';
  excerpt?: string;
  author?: string;
  category: string;
  thumbnail?: string;
  tags?: string[];
  published?: boolean;
  showOn?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, default: '' },
  contentType: { type: String, enum: ['standard', 'html'], default: 'standard' },
  excerpt: String,
  author: { type: String, default: 'Doctar Editorial' },
  category: { type: String, required: true },
  thumbnail: String,
  tags: [String],
  published: { type: Boolean, default: false },
  showOn: { type: [String], default: ['all'] },
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', blogSchema);
