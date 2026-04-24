import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import type { Product, Category } from '../types';
import ProductCard from '../components/product/ProductCard';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [categoryData, productsData] = await Promise.all([
        categoryService.getById(id),
        productService.getByCategory(id),
      ]);
      setCategory(categoryData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading category:', error);
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

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">الفئة غير موجودة</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          {category.name}
        </h1>

        {products.length === 0 ? (
          <div className="text-center text-gray-600">
            لا توجد منتجات في هذه الفئة
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
