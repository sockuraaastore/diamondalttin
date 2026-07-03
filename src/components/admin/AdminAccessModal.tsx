'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminAccessModal({ isOpen, onClose }: AdminAccessModalProps) {
  const router = useRouter();
  const { makeAdmin, isAdmin } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isAdmin) {
      router.push('/admin');
      onClose();
      setLoading(false);
      return;
    }

    const success = await makeAdmin(code);
    if (success) {
      router.push('/admin');
      onClose();
    } else {
      setError('کد مدیر اشتباه است');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-bg-secondary/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-gold-primary" />
          </div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            ورود به پنل مدیریت
          </h2>
          <p className="text-sm text-zinc-400 mt-1">کد مدیریت خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {isAdmin ? (
            <p className="text-center text-gold-primary text-sm">شما قبلاً مدیر شده‌اید. در حال انتقال...</p>
          ) : (
            <Input
              label="کد مدیر"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          )}

          <Button type="submit" loading={loading} className="w-full">
            {isAdmin ? 'ورود به داشبورد' : 'ورود'}
          </Button>
        </form>
      </div>
    </div>
  );
}
