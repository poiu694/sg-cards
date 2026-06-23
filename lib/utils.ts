import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Gender, ProfileFormData } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getKoreanAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear + 1;
}

export function getAvatarUrl(id: string, gender: Gender): string {
  const style = gender === '남성' ? 'micah' : 'lorelei';
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(id)}&radius=50`;
}

export function getMbtiColors(mbti: string): string {
  if (!mbti || mbti === '잘 모름') return 'bg-gray-100 text-gray-500';
  const e = mbti[0] === 'E';
  if (e) return 'bg-amber-100 text-amber-700 border border-amber-200';
  return 'bg-sky-100 text-sky-700 border border-sky-200';
}

export function formatNumber(n: number): string {
  return String(n).padStart(2, '0');
}

const JOB_ICONS: Record<string, string> = {
  공기업: '🏢', 대기업: '🏙️', 중소기업: '🏠', 의료: '🏥',
  교육: '📚', 금융: '💰', IT: '💻', 공무원: '🏛️',
  자영업: '🛍️', 전문직: '⚖️',
};

export function getJobIcon(category: string): string {
  return JOB_ICONS[category] || '💼';
}

export function parsePastedText(text: string): Partial<ProfileFormData> {
  const result: Partial<ProfileFormData> = {};

  const genderMatch = text.match(/(남성|여성)/);
  if (genderMatch) result.gender = genderMatch[1] as Gender;

  const numberMatch = text.match(/(\d+)번/);
  if (numberMatch) result.number = parseInt(numberMatch[1]);

  const yearMatch = text.match(/(\d{2,4})년생/);
  if (yearMatch) {
    const y = parseInt(yearMatch[1]);
    result.birthYear = y < 100 ? 1900 + y : y;
  }

  const heightMatch = text.match(/키\s*(\d{3})/);
  if (heightMatch) result.height = parseInt(heightMatch[1]);

  const mbtiMatch = text.match(/[EI][NS][TF][JP]/i);
  if (mbtiMatch) result.mbti = mbtiMatch[0].toUpperCase();
  else if (text.includes('잘 모름') || text.includes('모름')) result.mbti = '잘 모름';

  const locations = ['서울', '인천', '경기', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
  const loc = locations.find(l => text.includes(l));
  if (loc) result.location = loc;

  const preferredMatch = text.match(/원하는\s*(?:여성|남성|상대)[:\s]+(.+?)(?:\n|$)/);
  if (preferredMatch) result.preferredPersonality = preferredMatch[1].trim();

  const matchmakerMatch = text.match(/주선자[:\s]+(.+?)(?:\n|$)/);
  if (matchmakerMatch) result.matchmakerNote = matchmakerMatch[1].trim();

  return result;
}
