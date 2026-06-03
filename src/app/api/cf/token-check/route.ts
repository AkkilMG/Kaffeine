import { NextRequest, NextResponse } from 'next/server';
import {
  verifyJWT,
  getAuthHeader,
  handleApiError,
  ApiError,
} from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const token = getAuthHeader(request);
    const decoded = verifyJWT(token);

    return NextResponse.json({
      valid: true,
      userId: decoded.sub,
      type: decoded.type,
      expiresAt: new Date(decoded.exp * 1000),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
