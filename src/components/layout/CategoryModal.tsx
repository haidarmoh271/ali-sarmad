import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';
import { Link } from 'react-router-dom';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getWithProducts();
      setCategories(data);
    } catch (error) {
      console.error('خطأ في تحميل الفئات:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">جميع الفئات</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-600">جاري التحميل...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-600">لا توجد فئات متاحة</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  onClick={onClose}
                  className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏷️</div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
