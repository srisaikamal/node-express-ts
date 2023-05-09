import { Document } from 'mongoose';

export interface Settings {
  name: string;
  description?: string;
  value: any;
  store: string;
}

export interface SettingsDocument extends Document, Settings {}
