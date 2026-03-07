import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import type { User } from '../../types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    try {
      await userService.delete(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-800">إدارة المستخدمين</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="البحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">إجمالي المستخدمين</h3>
          <p className="text-4xl font-bold text-primary-600">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">مستخدمين جدد هذا الشهر</h3>
          <p className="text-4xl font-bold text-green-600">
            {users.filter(u => {
              const created = new Date(u.created_at);
              const now = new Date();
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">مستخدمين نشطين</h3>
          <p className="text-4xl font-bold text-blue-600">{users.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  الاسم
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  البريد الإلكتروني
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  رقم الهاتف
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  المدينة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    لا توجد نتائج
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                      {user.full_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {user.city || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            alert(`تفاصيل المستخدم:\n\nالاسم: ${user.full_name}\nالبريد: ${user.email}\nالهاتف: ${user.phone || 'غير متوفر'}\nالعنوان: ${user.address || 'غير متوفر'}\nالمدينة: ${user.city || 'غير متوفر'}\nالدولة: ${user.country || 'غير متوفر'}`);
                          }}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          عرض
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
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

export default AdminUsers;
