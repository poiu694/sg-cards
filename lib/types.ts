export type ProfileStatus = '모집중' | '매칭완료' | '숨김' | '대기중';
export type Gender = '남성' | '여성';

export interface Profile {
  id: string;
  gender: Gender;
  number: number;
  birthYear: number;
  mbti: string;
  height: number;
  location: string;
  personality: string;
  job: string;
  jobCategory: string;
  preferredJob: string;
  preferredPersonality: string;
  matchmakerNote: string;
  status: ProfileStatus;
  isPinned: boolean;
  sortOrder: number;
  photoUrl?: string;
  heartCount: number;
  createdAt: string;
  registrant?: string;
}

export type ProfileFormData = Omit<Profile, 'id' | 'heartCount' | 'createdAt'>;
