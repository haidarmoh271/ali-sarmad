import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import ProductCard from '../components/product/ProductCard';
import HeroCarousel from '../components/home/HeroCarousel';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { userService } from '../services/userService';
import type { Product, Category } from '../types';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ products: 0, users: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featured, allProducts, allCategories, allUsers] = await Promise.all([
        productService.getFeatured(),
        productService.getAll(),
        categoryService.getAll(),
        userService.getAll(),
      ]);
      
      setFeaturedProducts(featured);
      setLatestProducts(allProducts.slice(0, 8));
      setCategories(allCategories.slice(0, 8));
      setStats({
        products: allProducts.length,
        users: allUsers.length,
        categories: allCategories.length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('loading')}...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Welcome Text */}
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                {user ? (
                  <>
                    مرحباً <span className="text-yellow-300">{user.full_name}</span> في مسواكي
                  </>
                ) : (
                  'مرحباً بكم في مسواكي'
                )}
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-100">
                أفضل المنتجات بأفضل الأسعار
              </p>
              <p className="text-lg mb-8 text-white/90">
                اكتشف مجموعة واسعة من المنتجات المميزة والعروض الحصرية التي نقدمها لك
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2"
                >
                  <span>{t('shopNow')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/shop"
                  className="bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-800 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2"
                >
                  <span>المنتجات المميزة</span>
                  <span>⭐</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{stats.products}+</div>
                  <div className="text-sm text-primary-100">منتج</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{stats.users}+</div>
                  <div className="text-sm text-primary-100">عميل سعيد</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{stats.categories}+</div>
                  <div className="text-sm text-primary-100">فئة</div>
                </div>
              </div>
            </div>

            {/* Hero Carousel - Featured Products */}
            <div className="relative h-[600px] hidden lg:block">
              {featuredProducts.length > 0 ? (
                <HeroCarousel products={featuredProducts} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white/80">
                    <div className="text-6xl mb-4">🛍️</div>
                    <p className="text-xl">لا توجد منتجات مميزة</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('categories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <svg
                    className="w-10 h-10 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {t('featuredProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      {latestProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {t('latestProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            عروض خاصة
          </h2>
          <p className="text-xl mb-8">
            خصومات تصل إلى 50%
          </p>
          <Link
            to="/offers"
            className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            {t('viewOffers')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
