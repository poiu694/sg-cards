import { NextRequest, NextResponse } from 'next/server';
import { validateCookieHeader } from '@/lib/auth';
import { updateProfile, deleteProfile } from '@/lib/sheets';
import { Profile } from '@/lib/types';

const IS_MOCK = !process.env.GOOGLE_SPREADSHEET_ID;

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateCookieHeader(request.headers.get('cookie'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates: Partial<Profile> = await request.json();
    if (IS_MOCK) return NextResponse.json({ id: params.id, ...updates });
    const updated = await updateProfile(params.id, updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/cards/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateCookieHeader(request.headers.get('cookie'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!IS_MOCK) await deleteProfile(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/cards/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}
