'use client';

import { useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import { createProduct, updateProduct, uploadImage, getCategories } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

export default function ProductForm({ isOpen, onClose, product, onSuccess }: ProductFormProps) {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_fa: '',
    description: '',
    description_fa: '',
    price: '',
    stock: '',
    category_id: '',
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (product) {
        setFormData({
          name: product.name,
          name_fa: product.name_fa,
          description: product.description,
          description_fa: product.description_fa,
          price: product.price.toString(),
          stock: product.stock.toString(),
          category_id: product.category_id,
          is_featured: product.is_featured,
        });
      } else {
        setFormData({
          name: '',
          name_fa: '',
          description: '',
          description_fa: '',
          price: '',
          stock: '',
          category_id: '',
          is_featured: false,
        });
      }
    }
  }, [isOpen, product]);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.image_url || '';

      if (imageFile) {
        const uploaded = await uploadImage(imageFile, 'products');
        if (uploaded) imageUrl = uploaded;
      }

      const productData = {
        name: formData.name,
        name_fa: formData.name_fa,
        description: formData.description,
        description_fa: formData.description_fa,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        category_id: formData.category_id,
        image_url: imageUrl,
        is_featured: formData.is_featured,
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? t.admin.editProduct : t.admin.addProduct}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t.admin.productName + ' (EN)'}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label={t.admin.productName + ' (FA)'}
            value={formData.name_fa}
            onChange={(e) => setFormData({ ...formData, name_fa: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gold-light mb-1">
              {t.admin.productDescription} (EN)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-colors h-24"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gold-light mb-1">
              {t.admin.productDescription} (FA)
            </label>
            <textarea
              value={formData.description_fa}
              onChange={(e) => setFormData({ ...formData, description_fa: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-colors h-24"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label={t.admin.productPrice}
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <Input
            label={t.admin.productStock}
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gold-light mb-1">
              {t.admin.productCategory}
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-colors"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gold-light mb-1">
            {t.admin.productImage}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 bg-bg-secondary border border-zinc-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold-primary file:text-black file:font-medium hover:file:bg-gold-dark"
          />
          {product?.image_url && !imageFile && (
            <img src={product.image_url} alt="Current" className="mt-2 w-20 h-20 object-cover rounded" />
          )}
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="w-4 h-4 rounded border-zinc-700 bg-bg-secondary text-gold-primary focus:ring-gold-primary"
          />
          <span className="text-sm text-zinc-300">{t.products.featured}</span>
        </label>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t.admin.cancel}
          </Button>
          <Button type="submit" loading={loading}>
            {t.admin.save}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
