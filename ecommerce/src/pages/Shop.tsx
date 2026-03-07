import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import type { Product, Category } from '../types';
import ProductCarousel from '../components/product/ProductCarousel';
import ProductCard from '../components/product/ProductCard';

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<{ category: Category; products: Product[] }[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        const allProducts = await productService.getAll();
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setSearchResults(filtered);
      } else {
        const categories = await categoryService.getAll();
        const productsPromises = categories.map(async (category) => {
          const products = await productService.getByCategory(category.id);
          return { category, products };
        });
        
        const result = await Promise.all(productsPromises);
        setCategoriesWithProducts(result.filter(item => item.products.length > 0));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {searchQuery ? `نتائج البحث عن "${searchQuery}"` : 'المتجر'}
          </h1>
          {searchQuery && searchResults.length > 0 && (
            <p className="text-gray-600">
              تم العثور على <span className="font-bold text-primary-600">{searchResults.length}</span> منتج
            </p>
          )}
        </div>

        {/* Search Results */}
        {searchQuery ? (
          searchResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                لا توجد نتائج لـ "{searchQuery}"
              </h2>
              <p className="text-gray-600 mb-6">جرب كلمات أخرى أو تصفح الفئات</p>
              <button
                onClick={() => window.location.href = '/shop'}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                تصفح جميع المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        ) : (
          categoriesWithProducts.length === 0 ? (
            <div className="text-center text-gray-600">
              لا توجد منتجات حالياً
            </div>
          ) : (
            <div className="space-y-16">
              {categoriesWithProducts.map(({ category, products }) => (
                <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {category.name}
                  </h2>
                  <ProductCarousel products={products} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Shop;
