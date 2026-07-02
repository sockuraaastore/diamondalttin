'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/language';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { getProducts, deleteProduct } from '@/lib/api';
import ProductForm from '@/components/admin/ProductForm';
import Button from '@/components/ui/Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const { user, isAdmin } = useAuth();
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
      return;
    }
    loadProducts();
  }, [user, isAdmin, router]);

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadProducts();
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingProduct(null);
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gold-light" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.admin.products}
          </h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-1" />
            {t.admin.addProduct}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-500">{t.common.loading}</div>
        ) : (
          <div className="bg-bg-secondary rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-900/50">
                    <td className="px-4 py-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-white">
                      {locale === 'fa' ? product.name_fa : product.name}
                    </td>
                    <td className="px-4 py-3 text-gold-primary">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {product.category ? (locale === 'fa' ? product.category.name_fa : product.category.name) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1 text-zinc-400 hover:text-gold-primary mr-2"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ProductForm
          isOpen={showForm}
          onClose={handleFormClose}
          product={editingProduct}
          onSuccess={loadProducts}
        />
      </div>
    </div>
  );
}
