import { NextRequest, NextResponse } from 'next/server';
import {
  verifyJWT,
  getAuthHeader,
  handleApiError,
} from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const token = getAuthHeader(request);
    const decoded = verifyJWT(token);

    return NextResponse.json({
      valid: true,
      userId: decoded.sub as string | undefined,
      type: decoded.type as string | undefined,
      expiresAt: new Date((decoded.exp as number) * 1000),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
