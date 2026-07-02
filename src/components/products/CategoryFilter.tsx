'use client';

import { Category } from '@/types';
import { useLanguage } from '@/lib/language';

interface CategoryFilterProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryFilter({ categories, selectedId, onSelect }: CategoryFilterProps) {
  const { t, locale } = useLanguage();

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedId === null
            ? 'bg-gold-primary text-black'
            : 'bg-bg-secondary text-zinc-300 hover:bg-zinc-700'
        }`}
      >
        {t.products.all}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedId === category.id
              ? 'bg-gold-primary text-black'
              : 'bg-bg-secondary text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {locale === 'fa' ? category.name_fa : category.name}
        </button>
      ))}
    </div>
  );
}
