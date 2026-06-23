'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parsePastedText } from '@/lib/utils';
import { ProfileFormData } from '@/lib/types';

interface PasteParseModalProps {
  open: boolean;
  onClose: () => void;
  onParsed: (data: Partial<ProfileFormData>) => void;
}

const SAMPLE = `남성 1번
97년생
키 170
인천
공기업 전산직
성격: 천사
Mbti 잘 모름

원하는 여성: 귀엽고 예의바른 사람
주선자: 훈훈하게 생기심`;

export default function PasteParseModal({ open, onClose, onParsed }: PasteParseModalProps) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<Partial<ProfileFormData> | null>(null);

  const handleParse = () => {
    const result = parsePastedText(text);
    setPreview(result);
  };

  const handleConfirm = () => {
    if (preview) {
      onParsed(preview);
      onClose();
      setText('');
      setPreview(null);
    }
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
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5"
            style={{ background: 'linear-gradient(145deg, #1C2040 0%, #131828 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-white">텍스트 붙여넣기 파싱</h2>
              <button onClick={onClose} className="text-2xl tap-target" style={{ color: 'rgba(255,255,255,0.35)' }}>×</button>
            </div>

            {!preview ? (
              <>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>아래 형식으로 붙여넣으면 자동으로 파싱돼요</p>
                <div className="rounded-xl p-3 mb-3 text-xs font-mono whitespace-pre" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}>{SAMPLE}</div>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="w-full h-40 rounded-2xl p-3 text-sm resize-none outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  placeholder="카카오톡이나 메모에서 복사한 텍스트를 붙여넣으세요"
                />
                <button
                  onClick={handleParse}
                  disabled={!text.trim()}
                  className="w-full mt-3 font-bold py-4 rounded-2xl disabled:opacity-40 transition-all active:scale-95 tap-target"
                  style={{ background: 'rgba(201,168,76,0.9)', color: '#080B1A' }}
                >
                  파싱하기
                </button>
              </>
            ) : (
              <>
                <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>파싱 결과를 확인하세요. 나머지는 등록 폼에서 채울 수 있어요.</p>
                <div className="rounded-2xl p-4 flex flex-col gap-2 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {Object.entries(preview).map(([k, v]) => v !== undefined && (
                    <div key={k} className="flex gap-2 text-sm">
                      <span className="w-24 shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{k}</span>
                      <span className="font-medium text-white">{String(v)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPreview(null)}
                    className="flex-1 font-bold py-3.5 rounded-2xl tap-target"
                    style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
                  >
                    다시 하기
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 font-bold py-3.5 rounded-2xl tap-target"
                    style={{ background: 'rgba(201,168,76,0.9)', color: '#080B1A' }}
                  >
                    등록 폼으로 →
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
