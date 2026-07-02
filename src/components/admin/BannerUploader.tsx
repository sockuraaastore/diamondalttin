'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/types';
import { getAllBanners, createBanner, deleteBanner, toggleBanner, uploadImage } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react';

export default function BannerUploader() {
  const { t } = useLanguage();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    setLoading(true);
    const data = await getAllBanners();
    setBanners(data);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file, 'banners');
    if (url) {
      await createBanner(url);
      loadBanners();
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this banner?')) {
      await deleteBanner(id);
      loadBanners();
    }
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    await toggleBanner(id, !currentStatus);
    loadBanners();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gold-light">{t.admin.banners}</h3>
        <label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <Button size="sm" disabled={uploading}>
            <Upload size={16} className="mr-1" />
            {uploading ? 'Uploading...' : t.admin.uploadBanner}
          </Button>
        </label>
      </div>

      {loading ? (
        <div className="text-center py-8 text-zinc-500">{t.common.loading}</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">No banners uploaded yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="relative bg-zinc-900 rounded-lg overflow-hidden">
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleToggle(banner.id, banner.is_active)}
                  className={`p-2 rounded-lg ${
                    banner.is_active ? 'bg-green-500/80' : 'bg-zinc-600/80'
                  } text-white`}
                >
                  {banner.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 rounded-lg bg-red-500/80 text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  banner.is_active ? 'bg-green-500' : 'bg-zinc-600'
                } text-white`}>
                  {banner.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
