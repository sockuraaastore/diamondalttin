'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(email, password, fullName, adminCode || undefined);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/welcome');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
            Diamond Alttin
          </h1>
          <p className="text-zinc-400 mt-2">{t.auth.registerTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-secondary p-8 rounded-xl border border-zinc-800 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <Input
            label={t.auth.fullName}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label={t.auth.email + ' (optional)'}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label={t.auth.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <Input
            label={t.auth.adminCode}
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
          />

          <Button type="submit" loading={loading} className="w-full">
            {t.auth.register}
          </Button>

          <p className="text-center text-sm text-zinc-400">
            {t.auth.hasAccount}{' '}
            <Link href="/login" className="text-gold-primary hover:underline">
              {t.auth.login}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
