import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY === 'default-key-change-in-production') {
  throw new Error('ENCRYPTION_KEY environment variable is not set or is using the default value. Generate a secure random key (min 32 chars).');
}

const KEY_BUFFER = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

export function encryptData(data: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptData(encryptedData: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encrypted = parts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
