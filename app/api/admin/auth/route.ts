import { NextRequest, NextResponse } from 'next/server';
import { validatePassword, createAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (!validatePassword(password)) {
    return NextResponse.json({ error: '비밀번호가 틀렸습니다' }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', createAuthCookie());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', 'admin_token=; Path=/; HttpOnly; Max-Age=0');
  return response;
}
