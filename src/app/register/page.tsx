'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Lock, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(password, fullName);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/diamondalttin/welcome');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-primary/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/diamondalttin/" className="inline-block mb-6">
            <span
              className="text-3xl font-bold tracking-wider"
              style={{
                fontFamily: 'Playfair Display, serif',
                background: 'linear-gradient(135deg, #F4E4BC 0%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Diamond Alttin
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.auth.registerTitle}
          </h1>
          <p className="text-zinc-500 text-sm">حساب کاربری خود را ایجاد کنید</p>
        </div>

        <div className="card-luxury rounded-3xl p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="نام کامل"
                className="w-full pr-12 pl-4 py-4 bg-[#0A0A0A] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:border-gold-primary/50 focus:ring-1 focus:ring-gold-primary/20 transition-all duration-300"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="رمز عبور"
                className="w-full pr-12 pl-4 py-4 bg-[#0A0A0A] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:border-gold-primary/50 focus:ring-1 focus:ring-gold-primary/20 transition-all duration-300"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full py-4 rounded-xl text-sm font-semibold tracking-wider">
              {t.auth.register}
            </Button>
          </form>

          <div className="section-divider my-6" />

          <p className="text-center text-sm text-zinc-500">
            {t.auth.hasAccount}{' '}
            <Link href="/diamondalttin/login" className="text-gold-primary hover:text-gold-light transition-colors">
              {t.auth.login}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
