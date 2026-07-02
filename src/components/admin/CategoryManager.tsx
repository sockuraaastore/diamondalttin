'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

export default function CategoryManager() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', name_fa: '', slug: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingId) {
      await updateCategory(editingId, formData.name, formData.name_fa);
    } else {
      await createCategory(formData.name, formData.name_fa, slug);
    }

    setFormData({ name: '', name_fa: '', slug: '' });
    setEditingId(null);
    setShowForm(false);
    loadCategories();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
      loadCategories();
    }
  }

  function handleEdit(category: Category) {
    setFormData({ name: category.name, name_fa: category.name_fa, slug: category.slug });
    setEditingId(category.id);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gold-light">{t.admin.categories}</h3>
        <Button
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', name_fa: '', slug: '' }); }}
          size="sm"
        >
          <Plus size={16} className="mr-1" />
          {t.admin.addCategory}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Category Name (EN)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Category Name (FA)"
              value={formData.name_fa}
              onChange={(e) => setFormData({ ...formData, name_fa: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X size={16} />
            </Button>
            <Button type="submit" size="sm">
              <Check size={16} />
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-zinc-500">{t.common.loading}</div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg"
            >
              <div>
                <span className="text-white font-medium">{category.name}</span>
                <span className="text-zinc-500 mx-2">|</span>
                <span className="text-zinc-400">{category.name_fa}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 text-zinc-400 hover:text-gold-primary transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
