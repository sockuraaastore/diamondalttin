'use client';

import { useState, useEffect } from 'react';
import { Blog } from '@/types';
import { getBlogs } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Card, { CardImage, CardContent } from '@/components/ui/Card';

export default function BlogsPage() {
  const { t, locale } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      const data = await getBlogs();
      setBlogs(data);
      setLoading(false);
    }
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t.nav.blogs}
          </h1>
          <div className="w-20 h-1 bg-gold-primary mx-auto" />
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-pulse text-zinc-500">{t.common.loading}</div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">No blogs yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} hover>
                <CardImage
                  src={blog.image_url}
                  alt={locale === 'fa' ? blog.title_fa : blog.title}
                />
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {locale === 'fa' ? blog.title_fa : blog.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-3">
                    {locale === 'fa' ? blog.content_fa : blog.content}
                  </p>
                  <p className="text-xs text-zinc-500 mt-3">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
