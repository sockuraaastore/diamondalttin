'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            Diamond Alttin
          </h1>
          <p className="text-zinc-400 mt-2">{t.auth.loginTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-secondary/80 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800/50 space-y-5 shadow-2xl shadow-black/50">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <Input
            label={t.auth.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={t.auth.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            {t.auth.login}
          </Button>

          <p className="text-center text-sm text-zinc-400">
            {t.auth.noAccount}{' '}
            <Link href="/register" className="text-gold-primary hover:underline">
              {t.auth.register}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
