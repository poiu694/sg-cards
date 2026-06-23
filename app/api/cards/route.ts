import { NextRequest, NextResponse } from 'next/server';
import { validateCookieHeader } from '@/lib/auth';
import { getAllProfiles, addProfile, MOCK_PROFILES } from '@/lib/sheets';
import { ProfileFormData } from '@/lib/types';

const IS_MOCK = !process.env.GOOGLE_SPREADSHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL === 'your-service-account@your-project.iam.gserviceaccount.com';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = validateCookieHeader(request.headers.get('cookie'));
    const { searchParams } = new URL(request.url);
    const adminParam = searchParams.get('admin') === 'true';

    if (adminParam && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let profiles = IS_MOCK ? MOCK_PROFILES : await getAllProfiles();

    if (!adminParam) {
      profiles = profiles.filter(p => p.status === '모집중');
    }

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('GET /api/cards error:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateCookieHeader(request.headers.get('cookie'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data: ProfileFormData = await request.json();
    if (IS_MOCK) {
      return NextResponse.json({ ...data, id: 'MOCK', heartCount: 0, createdAt: new Date().toISOString() });
    }
    const profile = await addProfile(data);
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('POST /api/cards error:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
