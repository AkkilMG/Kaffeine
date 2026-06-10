import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  name: string;
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Kaffeiner {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  type: 'website' | 'database';
  db_type?: 'sql' | 'mongodb';
  uri: string;
  collection_or_table?: string;
  recentUpdated: Date;
  recentKaffeiner: Date;
  createdKaffeiner: Date;
  active: boolean;
  banned: boolean;
}

export interface Status {
  _id?: ObjectId;
  kaffeiner_id: ObjectId;
  status: boolean;
  time: Date;
}

export interface DashboardMetrics {
  totalKaffeiner: number;
  activeKaffeiner: number;
  uptime: number;
  recentKaffeiner: Date | null;
}

export interface TokenData {
  sub: string;
  iat: number;
  exp: number;
}
