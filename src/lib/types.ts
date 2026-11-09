import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    email: string;
    passwordHash: string;
    role: 'admin' | 'user';
    name: string;
    banned: boolean;
    /** External user ID from auth.arkynox.com (set after centralized auth integration). */
    externalId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const ALLOWED_CHECK_INTERVALS = [5, 30, 60, 180, 360, 720, 1440] as const;
export type CheckInterval = typeof ALLOWED_CHECK_INTERVALS[number];

export interface Kaffeiner {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  type: 'website' | 'database';
  db_type?: 'sql' | 'mongodb';
  uri: string;
  collection_or_table?: string;
  check_interval: CheckInterval; // minutes between checks: 5, 30, 60, 180, 360, 720, 1440
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
