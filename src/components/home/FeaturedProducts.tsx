'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { getFeaturedProducts } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import { Eye, ShoppingBag } from 'lucide-react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  if (loading) {
    return (
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 text-xs tracking-[0.2em] text-gold-primary border border-gold-primary/20 rounded-full mb-6">
              مجموعه ما
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gold-gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t.products.title}
            </h2>
            <div className="section-divider max-w-xs mx-auto mb-12" />

            <div className="card-luxury max-w-md mx-auto p-12 rounded-3xl">
              <div className="w-16 h-16 bg-gold-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-gold-primary" />
              </div>
              <p className="text-zinc-400 text-lg mb-2">هنوز محصولی اضافه نشده</p>
              <p className="text-zinc-600 text-sm">از پنل مدیریت محصولات جدید اضافه کنید</p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-xs tracking-[0.2em] text-gold-primary border border-gold-primary/20 rounded-full mb-6">
            مجموعه ما
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gold-gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.products.title}
          </h2>
          <div className="section-divider max-w-xs mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="card-luxury rounded-2xl overflow-hidden group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name_fa}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <button className="w-12 h-12 rounded-full bg-gold-primary flex items-center justify-center text-black transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-110">
                      <Eye size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 hover:bg-gold-primary hover:text-black hover:border-gold-primary">
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>

                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gold-primary text-black text-xs font-semibold rounded-full">
                    {product.stock} عدد باقیمانده
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs text-gold-primary tracking-wider mb-2 uppercase">
                  {product.category?.name_fa || 'دسته‌بندی'}
                </p>
                <h3 className="text-lg font-semibold text-white mb-3 line-clamp-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {product.name_fa}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold gold-gradient-text">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {product.stock > 0 ? 'موجود' : 'ناموجود'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/diamondalttin/products"
            className="inline-flex items-center gap-2 btn-gold px-10 py-4 rounded-full text-sm font-semibold tracking-wider"
          >
            مشاهده همه محصولات
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
