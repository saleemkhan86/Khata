'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Package, Camera, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';
import { supabase, isSupabaseConfigured, storageBucket } from '@/lib/supabase';
import { t } from '@/lib/i18n';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProductModal({ open, onClose }: AddProductModalProps) {
  const { lang } = useLanguage();
  const { addProduct, settings } = useStore();
  const [name, setName] = useState('');
  const [urduName, setUrduName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !buyPrice || !sellPrice || !stock) return;

    setError(null);
    setSaving(true);
    try {
      let imageUrl: string | null = null;

      if (imageFile && isSupabaseConfigured && supabase) {
        const ext = imageFile.name.split('.').pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(storageBucket)
          .upload(path, imageFile);
        if (!uploadError) {
          const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
          imageUrl = data.publicUrl;
        } else {
          console.warn('Image upload skipped:', uploadError.message);
        }
      } else if (imagePreview) {
        imageUrl = imagePreview;
      }

      await addProduct({
        name,
        urdu_name: urduName,
        buy_price: parseFloat(buyPrice),
        sell_price: parseFloat(sellPrice),
        stock_quantity: parseInt(stock, 10),
        image_url: imageUrl,
      });

      resetForm();
      onClose();
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Could not add product. Please try again.';
      setError(message);
      console.error('Failed to add product:', err);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName('');
    setUrduName('');
    setBuyPrice('');
    setSellPrice('');
    setStock('');
    setImageFile(null);
    setImagePreview(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1f2c34] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#00a884] text-white px-4 py-3 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-semibold text-sm">{t('addNewProduct', lang)}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-36 rounded-xl bg-[#efeae2] dark:bg-[#0b141a] border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-[#00a884] transition-colors overflow-hidden relative"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={28} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">{t('imageUpload', lang)}</span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              {t('productName', lang)} *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              {t('urduName', lang)}
            </label>
            <input
              type="text"
              value={urduName}
              onChange={e => setUrduName(e.target.value)}
              dir="rtl"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50 text-end"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                {t('buyPrice', lang)} ({settings.currency_symbol}) *
              </label>
              <input
                type="number"
                value={buyPrice}
                onChange={e => setBuyPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                {t('sellPrice', lang)} ({settings.currency_symbol}) *
              </label>
              <input
                type="number"
                value={sellPrice}
                onChange={e => setSellPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              {t('initialStock', lang)} *
            </label>
            <input
              type="number"
              value={stock}
              onChange={e => setStock(e.target.value)}
              required
              min="0"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[#00a884] text-white rounded-xl font-semibold text-sm hover:bg-[#009975] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Package size={18} />
            )}
            {t('addProduct', lang)}
          </button>
        </form>
      </div>
    </div>
  );
}
