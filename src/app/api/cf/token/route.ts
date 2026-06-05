import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { handleApiError, ApiError, rateLimit } from '@/lib/api-utils';

function getCfConfig() {
  const CF_API_TOKEN = process.env.CF_API_TOKEN;
  const CF_WORKER_SECRET = process.env.CF_WORKER_SECRET;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!CF_API_TOKEN || CF_API_TOKEN === 'your-cloudflare-api-token') {
    throw new ApiError(500, 'CF_API_TOKEN is not configured');
  }

  if (!CF_WORKER_SECRET || CF_WORKER_SECRET === 'your-cloudflare-worker-secret') {
    throw new ApiError(500, 'CF_WORKER_SECRET is not configured');
  }

  if (!JWT_SECRET || JWT_SECRET === 'your-jwt-secret') {
    throw new ApiError(500, 'JWT_SECRET is not configured');
  }

  return { CF_API_TOKEN, CF_WORKER_SECRET, JWT_SECRET };
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function verifyCombinedKey(key: string, cfApiToken: string, cfWorkerSecret: string): boolean {
  const combined = `${cfApiToken}:${cfWorkerSecret}`;
  return constantTimeEqual(key, combined);
}

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json() as Record<string, unknown>;

    if (!key || typeof key !== 'string') {
      throw new ApiError(400, 'Key is required');
    }

    const config = getCfConfig();

    if (!verifyCombinedKey(key, config.CF_API_TOKEN, config.CF_WORKER_SECRET)) {
      throw new ApiError(401, 'Invalid key');
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateKey = `cf-token:${ip}`;
    const check = rateLimit(rateKey, 10, 60000);
    if (!check.allowed) {
      throw new ApiError(429, 'Too many token requests. Please try again later.');
    }

    const token = jwt.sign(
      { type: 'cf-worker', iat: Math.floor(Date.now() / 1000) },
      config.JWT_SECRET,
      { expiresIn: '30m' }
    );

    return NextResponse.json({ token, expiresIn: 1800 });
  } catch (error) {
    return handleApiError(error);
  }
}
