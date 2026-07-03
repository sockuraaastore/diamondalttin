'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { getFeaturedProducts } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import { ShoppingBag, Eye } from 'lucide-react';

const categories = ['همه', 'انگشتر', 'دستبند', 'گردنبند', 'گوشواره', 'ساعت'];
const sizes = ['همه سایزها', '۱۶', '۱۷', '۱۸', '۱۹', '۲۰'];
const genders = ['همه', 'زنانه', 'مردانه'];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [selectedSize, setSelectedSize] = useState('همه سایزها');
  const [selectedGender, setSelectedGender] = useState('همه');
  const { t } = useLanguage();

  useEffect(() => {
    async function loadProducts() {
      const data = await getFeaturedProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const FilterPills = ({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (v: string) => void }) => (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
            selected === item
              ? 'bg-gold-primary text-black border-gold-primary'
              : 'bg-[#141414] text-zinc-400 border-zinc-800 hover:border-gold-primary/50 hover:text-gold-primary'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 w-full"
        >
          <span className="inline-block px-4 py-2 text-xs tracking-[0.2em] text-gold-primary border border-gold-primary/20 rounded-full mb-6">
            مجموعه ما
          </span>
          <h2 className="text-3xl md:text-4xl font-bold gold-gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.products.title}
          </h2>
          <div className="section-divider max-w-xs mx-auto mt-6" />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-16 w-full">
          <FilterPills items={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
          <FilterPills items={sizes} selected={selectedSize} onSelect={setSelectedSize} />
          <FilterPills items={genders} selected={selectedGender} onSelect={setSelectedGender} />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-20">
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gold-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gold-primary" />
            </div>
            <p className="text-zinc-400 text-lg">هنوز محصولی اضافه نشده</p>
            <p className="text-zinc-600 text-sm mt-1">از پنل مدیریت محصولات جدید اضافه کنید</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="card-luxury rounded-2xl overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                  <img
                    src={product.image_url}
                    alt={product.name_fa}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-gold-primary text-black text-xs font-semibold rounded-full">
                      {product.stock} عدد باقیمانده
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <Link
                      href="/diamondalttin/products"
                      className="flex items-center justify-center gap-2 w-full py-2.5 btn-gold text-sm font-semibold rounded-xl"
                    >
                      <Eye size={16} />
                      مشاهده و افزودن به سبد خرید
                    </Link>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-gold-primary font-medium mb-1">
                    {product.category?.name_fa || 'دسته‌بندی'}
                  </p>
                  <h3 className="text-base font-semibold text-white mb-2 line-clamp-1" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
                    {product.name_fa}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-zinc-500 mb-3 line-clamp-1">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold gold-gradient-text">
                      {product.price.toLocaleString()} <span className="text-xs font-normal text-zinc-500">تومان</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {product.stock > 0 ? 'موجود' : 'ناموجود'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View all */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/diamondalttin/products"
              className="inline-flex items-center gap-2 btn-gold px-8 py-3 rounded-full text-sm font-semibold"
            >
              مشاهده همه محصولات
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
