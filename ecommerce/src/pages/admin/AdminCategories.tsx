import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  const loadCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
    
    const counts: Record<string, number> = {};
    await Promise.all(
      data.map(async (category) => {
        const { count } = await categoryService.checkProductsExist(category.id);
        counts[category.id] = count;
      })
    );
    setProductCounts(counts);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadCategories();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await categoryService.update(editingId, formData);
      } else {
        await categoryService.create(formData);
      }
      
      setFormData({ name: '' });
      setShowForm(false);
      setEditingId(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { hasProducts, count } = await categoryService.checkProductsExist(id);
    
    if (hasProducts) {
      alert(
        `⚠️ لا يمكن حذف هذه الفئة!\n\n` +
        `هذه الفئة تحتوي على ${count} منتج${count > 1 ? 'ات' : ''} مرتبط${count > 1 ? 'ة' : ''} بها.\n\n` +
        `لحذف هذه الفئة، يجب عليك أولاً:\n` +
        `• نقل المنتجات إلى فئة أخرى\n` +
        `• أو حذف المنتجات المرتبطة بها`
      );
      return;
    }
    
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
    
    try {
      await categoryService.delete(id);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الفئات</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {showForm ? 'إلغاء' : '+ إضافة فئة جديدة'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الفئة *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  dir="rtl"
                  placeholder="يمكنك الكتابة بالعربية أو الإنجليزية"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                {editingId ? 'حفظ التعديلات' : 'إضافة الفئة'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  اسم الفئة
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  عدد المنتجات
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  تاريخ الإنشاء
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    لا توجد فئات حالياً
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-right text-gray-800">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        productCounts[category.id] > 0 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {productCounts[category.id] || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {new Date(category.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(category)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={productCounts[category.id] > 0}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            productCounts[category.id] > 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                          title={
                            productCounts[category.id] > 0
                              ? `لا يمكن الحذف - يوجد ${productCounts[category.id]} منتج${productCounts[category.id] > 1 ? 'ات' : ''} مرتبط${productCounts[category.id] > 1 ? 'ة' : ''}`
                              : 'حذف الفئة'
                          }
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
