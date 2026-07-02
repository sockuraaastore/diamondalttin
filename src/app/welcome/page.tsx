'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import { Gem } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const { user, completeWelcome } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  function handleContinue() {
    completeWelcome();
    router.push('/');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black via-bg-primary to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Gem className="w-12 h-12 text-gold-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-gold-light mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {t.welcome.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-zinc-400 mb-8"
        >
          {t.welcome.message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button onClick={handleContinue} size="lg">
            Start Exploring →
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
