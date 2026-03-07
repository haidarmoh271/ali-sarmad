import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useCartStore } from '../../stores/cartStore';
import { Link } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import ContactModal from './ContactModal';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const items = useCartStore(state => state.items);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          <Link to="/" className="logo text-2xl font-bold text-primary-500">
            مسواكي
          </Link>

          <SearchBar />

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/account"
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                >
                  {t('myAccount')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-500 transition-colors"
              >
                {t('login')}
              </Link>
            )}

            <Link to="/wishlist" className="relative">
              <svg
                className="w-6 h-6 text-gray-700 hover:text-primary-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            <Link to="/cart" className="relative">
              <svg
                className="w-6 h-6 text-gray-700 hover:text-primary-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="mt-4 border-t pt-4">
          <ul className="flex items-center gap-8 text-gray-700">
            <li>
              <Link
                to="/"
                className="hover:text-primary-500 transition-colors font-medium"
              >
                {t('home')}
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="hover:text-primary-500 transition-colors font-medium"
              >
                {t('shop')}
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="hover:text-primary-500 transition-colors font-medium"
              >
                {t('categories')}
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowContactModal(true)}
                className="hover:text-primary-500 transition-colors font-medium"
              >
                {t('contact')}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <CategoryModal 
        isOpen={showCategoryModal} 
        onClose={() => setShowCategoryModal(false)} 
      />
      
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </header>
  );
};

export default Navbar;
