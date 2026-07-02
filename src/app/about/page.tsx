'use client';

import { useLanguage } from '@/lib/language';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.about.title}
          </h1>
          <div className="w-20 h-1 bg-gold-primary mx-auto" />
        </div>

        <div className="space-y-8">
          <div className="bg-bg-secondary rounded-xl border border-zinc-800 p-8">
            <p className="text-zinc-300 text-lg leading-relaxed">
              {t.about.content}
            </p>
          </div>

          <div className="bg-bg-secondary rounded-xl border border-zinc-800 p-8">
            <h2 className="text-2xl font-bold text-gold-primary mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t.about.whyUs}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gold-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-zinc-300">{t.about.quality}</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gold-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-zinc-300">{t.about.designs}</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gold-primary rounded-full mt-2 flex-shrink-0" />
                <p className="text-zinc-300">{t.about.support}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-xl border border-zinc-800 p-8">
            <p className="text-zinc-300 text-lg leading-relaxed italic">
              {t.about.mission}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
