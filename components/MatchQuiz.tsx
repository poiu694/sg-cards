'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '@/lib/types';

interface MatchQuizProps {
  profiles: Profile[];
  onScoresChange: (scores: Record<string, number>) => void;
}

interface QuizAnswers {
  ageRange: string;
  heightRange: string;
  mbtiPref: string;
}

const AGE_OPTIONS = ['20대 초반', '20대 중반', '20대 후반', '30대 초반', '상관없음'];
const HEIGHT_OPTIONS = ['160cm 미만', '160~165cm', '165~170cm', '170~175cm', '175cm 이상', '상관없음'];
const MBTI_OPTIONS = ['E형 (외향형)', 'I형 (내향형)', '상관없음'];

function calcScore(profile: Profile, answers: QuizAnswers): number {
  let score = 50;
  const age = new Date().getFullYear() - profile.birthYear + 1;

  const ageMatch: Record<string, [number, number]> = {
    '20대 초반': [20, 24], '20대 중반': [24, 27], '20대 후반': [27, 30], '30대 초반': [30, 35],
  };
  if (answers.ageRange !== '상관없음') {
    const [min, max] = ageMatch[answers.ageRange] || [0, 99];
    score += (age >= min && age <= max) ? 25 : -10;
  } else {
    score += 10;
  }

  if (answers.heightRange !== '상관없음') {
    const h = profile.height;
    const heightMatch: Record<string, (h: number) => boolean> = {
      '160cm 미만': h => h < 160,
      '160~165cm': h => h >= 160 && h < 165,
      '165~170cm': h => h >= 165 && h < 170,
      '170~175cm': h => h >= 170 && h < 175,
      '175cm 이상': h => h >= 175,
    };
    const fn = heightMatch[answers.heightRange];
    score += fn?.(h) ? 15 : -5;
  } else {
    score += 5;
  }

  if (answers.mbtiPref !== '상관없음' && profile.mbti !== '잘 모름') {
    const wantE = answers.mbtiPref === 'E형 (외향형)';
    const isE = profile.mbti.startsWith('E');
    score += wantE === isE ? 10 : -5;
  } else {
    score += 5;
  }

  return Math.max(10, Math.min(99, score));
}

export default function MatchQuiz({ profiles, onScoresChange }: MatchQuizProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [done, setDone] = useState(false);

  const questions = [
    { key: 'ageRange', label: '선호하는 나이대는?', options: AGE_OPTIONS },
    { key: 'heightRange', label: '선호하는 키는?', options: HEIGHT_OPTIONS },
    { key: 'mbtiPref', label: 'MBTI 선호는?', options: MBTI_OPTIONS },
  ] as const;

  const handleAnswer = (val: string) => {
    const key = questions[step].key;
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      const final = newAnswers as QuizAnswers;
      const scores: Record<string, number> = {};
      profiles.forEach(p => { scores[p.id] = calcScore(p, final); });
      onScoresChange(scores);
      setDone(true);
      setTimeout(() => setOpen(false), 1000);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
    onScoresChange({});
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); reset(); }}
        className="fixed bottom-6 right-4 z-30 bg-navy shadow-xl rounded-2xl px-4 py-3 flex items-center gap-2 tap-target"
        style={{ boxShadow: '0 4px 24px rgba(201,168,76,0.3)' }}
      >
        <span className="text-lg">💕</span>
        <span className="text-white text-sm font-semibold">궁합 보기</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <motion.div
              className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 safe-bottom"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {done ? (
                <div className="text-center py-6">
                  <span className="text-4xl">💝</span>
                  <p className="text-navy font-bold text-lg mt-3">궁합 분석 완료!</p>
                  <p className="text-navy/60 text-sm mt-1">카드에 % 표시가 나타납니다</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-navy font-bold text-base">{questions[step].label}</p>
                    <span className="text-navy/40 text-sm">{step + 1} / {questions.length}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {questions[step].options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="w-full py-3.5 px-4 rounded-2xl border-2 border-navy/10 text-navy font-medium text-sm text-left hover:border-gold hover:bg-gold/5 transition-all active:scale-95 tap-target"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mt-5">
                    {questions.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-navy w-6' : i < step ? 'bg-gold' : 'bg-navy/20'}`} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
