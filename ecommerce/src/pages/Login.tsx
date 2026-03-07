import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signInAsAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt:', { 
      email, 
      isAdminMode, 
      mode: isAdminMode ? 'Admin' : 'User' 
    });

    try {
      if (isAdminMode) {
        console.log('👑 Attempting admin login...');
        await signInAsAdmin(email, password);
        console.log('✅ Admin login successful!');
        navigate('/admin');
      } else {
        console.log('👤 Attempting user login...');
        await signIn(email, password);
        console.log('✅ User login successful!');
        navigate('/');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError((err as Error).message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isAdminMode ? 'Admin Login' : t('login')}
        </h2>

        {/* Admin Mode Toggle */}
        <div className="mb-6">
          <div className="text-center mb-3 text-sm text-gray-600">
            {isAdminMode ? '👑 تسجيل دخول كمدير' : '👤 تسجيل دخول كمستخدم'}
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${
                isAdminMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              }`}
            >
              {isAdminMode ? '👤 التبديل لتسجيل دخول المستخدم' : '👑 التبديل لتسجيل دخول المدير'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? t('loading') : t('login')}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          {t('noAccount')}{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
