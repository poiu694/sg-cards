import { NextRequest, NextResponse } from 'next/server';
import { validateCookieHeader } from '@/lib/auth';
import { updateProfile } from '@/lib/sheets';
import { ProfileStatus } from '@/lib/types';

const IS_MOCK = !process.env.GOOGLE_SPREADSHEET_ID;

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateCookieHeader(request.headers.get('cookie'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status, isPinned }: { status?: ProfileStatus; isPinned?: boolean } = await request.json();
    if (IS_MOCK) return NextResponse.json({ id: params.id, status, isPinned });
    const updated = await updateProfile(params.id, { ...(status !== undefined && { status }), ...(isPinned !== undefined && { isPinned }) });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/cards/[id]/status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
