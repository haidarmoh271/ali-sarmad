import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import { formatIQD } from '../lib/formatIQD';

const Offers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'discount' | 'price'>('discount');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const data = await productService.getOnSale();
      setProducts(data);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'discount') {
      return (b.discount || 0) - (a.discount || 0);
    }
    const finalA = a.price - (a.price * (a.discount || 0) / 100);
    const finalB = b.price - (b.price * (b.discount || 0) / 100);
    return finalA - finalB;
  });

  const maxDiscount = products.length > 0 ? Math.max(...products.map(p => p.discount || 0)) : 0;
  const totalSavings = products.reduce((sum, p) => sum + (p.price * (p.discount || 0) / 100), 0);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🏷️</div>
          <h1 className="text-5xl font-bold mb-4">العروض والخصومات</h1>
          <p className="text-xl text-white/90 mb-8">
            أفضل الأسعار على منتجاتنا المميزة
          </p>
          {/* Stats */}
          <div className="flex justify-center gap-12 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold">{products.length}</div>
              <div className="text-white/80 text-sm mt-1">منتج بخصم</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">-{maxDiscount}%</div>
              <div className="text-white/80 text-sm mt-1">أعلى خصم</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatIQD(totalSavings)}</div>
              <div className="text-white/80 text-sm mt-1">إجمالي التوفير</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {loading ? '...' : `${products.length} منتج`}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm">ترتيب حسب:</span>
            <button
              onClick={() => setSortBy('discount')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'discount'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              أعلى خصم
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'price'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              أقل سعر
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">جاري تحميل العروض...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-8xl mb-6">😔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">لا توجد عروض حالياً</h3>
            <p className="text-gray-500 mb-8">تابعنا للاطلاع على أحدث العروض والخصومات</p>
            <a
              href="/shop"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              تصفح المتجر
            </a>
          </div>
        ) : (
          <>
            {/* Discount badges legend */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[10, 20, 30, 50].map(threshold => {
                const count = products.filter(p => (p.discount || 0) >= threshold).length;
                if (count === 0) return null;
                return (
                  <span
                    key={threshold}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    خصم {threshold}%+ ({count} منتج)
                  </span>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Offers;
