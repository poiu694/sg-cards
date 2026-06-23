'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json();
      setError(data.error || '로그인 실패');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#080B1A' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.8)' }}>✦ ADMIN ✦</p>
          <h1 className="font-serif text-white text-2xl font-bold">관리자 로그인</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full text-white placeholder-white/30 px-4 py-4 rounded-2xl text-base outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            autoFocus
          />
          {error && <p className="text-rose-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full font-bold py-4 rounded-2xl text-base disabled:opacity-50 transition-all active:scale-95 tap-target"
            style={{ background: 'rgba(201,168,76,0.9)', color: '#080B1A' }}
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </main>
  );
}
