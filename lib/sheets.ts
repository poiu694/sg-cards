import { google } from 'googleapis';
import { Profile, ProfileStatus, Gender, ProfileFormData } from './types';

const SHEET_NAME = 'profiles';
const HEADER = [
  'id', 'gender', 'number', 'birthYear', 'mbti', 'height',
  'location', 'personality', 'job', 'jobCategory',
  'preferredJob', 'preferredPersonality', 'matchmakerNote',
  'status', 'isPinned', 'sortOrder', 'photoUrl', 'heartCount', 'createdAt', 'registrant',
];

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');
  return new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: key },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

const SPREADSHEET_ID = () => process.env.GOOGLE_SPREADSHEET_ID!;

function rowToProfile(row: string[]): Profile {
  return {
    id: row[0],
    gender: row[1] as Gender,
    number: Number(row[2]),
    birthYear: Number(row[3]),
    mbti: row[4] || '잘 모름',
    height: Number(row[5]),
    location: row[6],
    personality: row[7],
    job: row[8],
    jobCategory: row[9],
    preferredJob: row[10],
    preferredPersonality: row[11],
    matchmakerNote: row[12],
    status: (row[13] as ProfileStatus) || '모집중',
    isPinned: row[14] === 'TRUE',
    sortOrder: Number(row[15]) || 0,
    photoUrl: row[16] || undefined,
    heartCount: Number(row[17]) || 0,
    createdAt: row[18] || new Date().toISOString(),
    registrant: row[19] || undefined,
  };
}

function profileToRow(p: Profile): string[] {
  return [
    p.id, p.gender, String(p.number), String(p.birthYear), p.mbti,
    String(p.height), p.location, p.personality, p.job, p.jobCategory,
    p.preferredJob, p.preferredPersonality, p.matchmakerNote,
    p.status, p.isPinned ? 'TRUE' : 'FALSE', String(p.sortOrder),
    p.photoUrl || '', String(p.heartCount), p.createdAt, p.registrant || '',
  ];
}

export async function ensureSheetAndHeaders(): Promise<void> {
  const sheets = getSheets();
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID() });
  const sheetExists = spreadsheet.data.sheets?.some(s => s.properties?.title === SHEET_NAME);

  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID(),
      requestBody: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] },
    });
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${SHEET_NAME}!A1:S1`,
  });
  if (!res.data.values?.[0]?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID(),
      range: `${SHEET_NAME}!A1:S1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADER] },
    });
  }
}

export async function ensureHeaders(): Promise<void> {
  return ensureSheetAndHeaders();
}

export async function getAllProfiles(): Promise<Profile[]> {
  await ensureSheetAndHeaders();
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${SHEET_NAME}!A2:S`,
  });
  const rows = res.data.values || [];
  return rows
    .filter(row => row[0])
    .map(row => rowToProfile(row.map(String)))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.number - b.number);
}

export async function addProfile(data: ProfileFormData): Promise<Profile> {
  const profiles = await getAllProfiles();
  const maxNum = profiles.filter(p => p.gender === data.gender).reduce((m, p) => Math.max(m, p.number), 0);
  const id = `${data.gender === '남성' ? 'M' : 'F'}-${String(maxNum + 1).padStart(2, '0')}`;
  const profile: Profile = {
    ...data,
    id,
    number: data.number || maxNum + 1,
    heartCount: 0,
    createdAt: new Date().toISOString(),
  };
  await ensureHeaders();
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${SHEET_NAME}!A:S`,
    valueInputOption: 'RAW',
    requestBody: { values: [profileToRow(profile)] },
  });
  return profile;
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  const profiles = await getAllProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Profile not found');
  const updated: Profile = { ...profiles[idx], ...updates };
  const rowNum = idx + 2;
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID(),
    range: `${SHEET_NAME}!A${rowNum}:S${rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [profileToRow(updated)] },
  });
  return updated;
}

export async function deleteProfile(id: string): Promise<void> {
  const profiles = await getAllProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Profile not found');
  const rowNum = idx + 2;
  const sheets = getSheets();
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID() });
  const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === SHEET_NAME);
  if (sheet?.properties?.sheetId == null) return;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID(),
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheet.properties!.sheetId!,
            dimension: 'ROWS',
            startIndex: rowNum - 1,
            endIndex: rowNum,
          },
        },
      }],
    },
  });
}

export async function reorderProfiles(orderedIds: string[]): Promise<void> {
  const profiles = await getAllProfiles();
  const updates = orderedIds.map((id, idx) => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return null;
    return { ...profile, sortOrder: idx + 1 };
  }).filter(Boolean) as Profile[];

  await Promise.all(updates.map(p => updateProfile(p.id, { sortOrder: p.sortOrder })));
}

// Mock data for development without Google Sheets
export const MOCK_PROFILES: Profile[] = [
  {
    id: 'M-01', gender: '남성', number: 1, birthYear: 1997, mbti: '잘 모름',
    height: 170, location: '인천', personality: '천사', job: '공기업 전산직',
    jobCategory: '공기업', preferredJob: '상관없음', preferredPersonality: '귀엽고 예의바른 사람',
    matchmakerNote: '훈훈하게 생기심', status: '모집중', isPinned: true,
    sortOrder: 1, heartCount: 5, createdAt: '2026-06-23T00:00:00.000Z',
  },
  {
    id: 'M-02', gender: '남성', number: 2, birthYear: 1995, mbti: 'ENFJ',
    height: 178, location: '서울', personality: '유머러스', job: '대기업 개발자',
    jobCategory: '대기업', preferredJob: '상관없음', preferredPersonality: '밝고 활발한 사람',
    matchmakerNote: '말을 정말 재미있게 해요', status: '모집중', isPinned: false,
    sortOrder: 2, heartCount: 12, createdAt: '2026-06-23T00:00:00.000Z',
  },
  {
    id: 'F-01', gender: '여성', number: 1, birthYear: 1999, mbti: 'INFP',
    height: 162, location: '서울', personality: '다정함', job: '간호사',
    jobCategory: '의료', preferredJob: '상관없음', preferredPersonality: '듬직하고 책임감 있는 사람',
    matchmakerNote: '웃음이 너무 예뻐요', status: '모집중', isPinned: false,
    sortOrder: 3, heartCount: 8, createdAt: '2026-06-23T00:00:00.000Z',
  },
  {
    id: 'F-02', gender: '여성', number: 2, birthYear: 1998, mbti: 'ESTJ',
    height: 165, location: '경기', personality: '활발함', job: '공무원',
    jobCategory: '공무원', preferredJob: '상관없음', preferredPersonality: '성실하고 유머있는 사람',
    matchmakerNote: '일도 잘하고 성격도 좋아요', status: '매칭완료', isPinned: false,
    sortOrder: 4, heartCount: 3, createdAt: '2026-06-23T00:00:00.000Z',
  },
];
