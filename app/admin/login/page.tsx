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
    <main className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">Admin</p>
          <h1 className="font-serif text-white text-2xl font-bold">관리자 로그인</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full bg-white/10 text-white placeholder-white/30 px-4 py-4 rounded-2xl text-base outline-none focus:ring-2 focus:ring-gold transition-all"
            autoFocus
          />
          {error && <p className="text-rose-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gold text-navy font-bold py-4 rounded-2xl text-base disabled:opacity-50 transition-all active:scale-95 tap-target"
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </main>
  );
}
