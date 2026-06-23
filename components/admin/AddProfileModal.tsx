'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileFormData, Gender, ProfileStatus } from '@/lib/types';

interface AddProfileModalProps {
  open: boolean;
  initial?: Partial<ProfileFormData>;
  onClose: () => void;
  onSave: (data: ProfileFormData) => Promise<void>;
}

const EMPTY: ProfileFormData = {
  gender: '남성',
  number: 0,
  birthYear: 2000,
  mbti: '잘 모름',
  height: 170,
  location: '',
  personality: '',
  job: '',
  jobCategory: '기타',
  preferredJob: '상관없음',
  preferredPersonality: '',
  matchmakerNote: '',
  status: '대기중',
  isPinned: false,
  sortOrder: 99,
};

const JOB_CATEGORIES = ['공기업', '대기업', '중소기업', '의료', '교육', '금융', 'IT', '공무원', '자영업', '전문직', '기타'];
const LOCATIONS = ['서울', '인천', '경기', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '기타'];

const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  borderRadius: '0.75rem',
  padding: '0.75rem 1rem',
  width: '100%',
  fontSize: '0.875rem',
  outline: 'none',
};

export default function AddProfileModal({ open, initial, onClose, onSave }: AddProfileModalProps) {
  const [form, setForm] = useState<ProfileFormData>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof ProfileFormData, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
            style={{ background: 'linear-gradient(145deg, #1C2040 0%, #131828 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div
              className="sticky top-0 px-5 pt-5 pb-3 flex items-center justify-between z-10"
              style={{ background: 'rgba(19,24,40,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}
            >
              <h2 className="font-bold text-lg text-white">프로필 등록</h2>
              <button onClick={onClose} className="text-2xl tap-target" style={{ color: 'rgba(255,255,255,0.35)' }}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4 safe-bottom">
              <div className="grid grid-cols-2 gap-3">
                <Field label="성별">
                  <select value={form.gender} onChange={e => set('gender', e.target.value as Gender)} style={inputStyle}>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </Field>
                <Field label="번호 (0=자동)">
                  <input type="number" value={form.number} onChange={e => set('number', +e.target.value)} style={inputStyle} min={0} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="출생년도">
                  <input type="number" value={form.birthYear} onChange={e => set('birthYear', +e.target.value)} style={inputStyle} min={1980} max={2005} />
                </Field>
                <Field label="키 (cm)">
                  <input type="number" value={form.height} onChange={e => set('height', +e.target.value)} style={inputStyle} min={140} max={210} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="MBTI">
                  <input type="text" value={form.mbti} onChange={e => set('mbti', e.target.value)} style={inputStyle} placeholder="잘 모름" maxLength={4} />
                </Field>
                <Field label="거주지">
                  <select value={form.location} onChange={e => set('location', e.target.value)} style={inputStyle}>
                    <option value="">선택</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="성격 (쉼표로 구분)">
                <input type="text" value={form.personality} onChange={e => set('personality', e.target.value)} style={inputStyle} placeholder="예: 활발함, 다정함" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="직업">
                  <input type="text" value={form.job} onChange={e => set('job', e.target.value)} style={inputStyle} placeholder="예: 공기업 전산직" />
                </Field>
                <Field label="직군">
                  <select value={form.jobCategory} onChange={e => set('jobCategory', e.target.value)} style={inputStyle}>
                    {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="원하는 상대 직업">
                <input type="text" value={form.preferredJob} onChange={e => set('preferredJob', e.target.value)} style={inputStyle} placeholder="상관없음" />
              </Field>
              <Field label="원하는 상대 성격">
                <textarea value={form.preferredPersonality} onChange={e => set('preferredPersonality', e.target.value)} style={{ ...inputStyle, resize: 'none' }} rows={2} placeholder="귀엽고 예의바른 사람" />
              </Field>

              <Field label="주선자 한마디">
                <textarea value={form.matchmakerNote} onChange={e => set('matchmakerNote', e.target.value)} style={{ ...inputStyle, resize: 'none' }} rows={2} />
              </Field>

              <Field label="등록자">
                <input type="text" value={form.registrant || ''} onChange={e => set('registrant', e.target.value)} style={inputStyle} placeholder="예: 홍길동" />
              </Field>

              <Field label="상태">
                <select value={form.status} onChange={e => set('status', e.target.value as ProfileStatus)} style={inputStyle}>
                  <option value="대기중">대기중 (숨김)</option>
                  <option value="모집중">모집중</option>
                  <option value="매칭완료">매칭완료</option>
                  <option value="숨김">숨김</option>
                </select>
              </Field>

              <button
                type="submit"
                disabled={saving || !form.location || !form.job}
                className="w-full font-bold py-4 rounded-2xl disabled:opacity-40 transition-all active:scale-95 tap-target mt-2"
                style={{ background: 'rgba(201,168,76,0.9)', color: '#080B1A' }}
              >
                {saving ? '저장 중...' : '저장하기'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</label>
      {children}
    </div>
  );
}
