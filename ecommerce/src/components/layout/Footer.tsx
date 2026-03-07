import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-500">مسواكي</h3>
            <p className="text-gray-300 text-sm">
              متجر إلكتروني متكامل يوفر لكم أفضل المنتجات والعروض
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-primary-500 transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary-500 transition-colors">
                  {t('shop')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary-500 transition-colors">
                  {t('categories')}
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="hover:text-primary-500 transition-colors"
                >
                  {t('contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('myAccount')}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/account" className="hover:text-primary-500 transition-colors">
                  {t('myAccount')}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary-500 transition-colors">
                  {t('wishlist')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-500 transition-colors">
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('contact')}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:info@miswaki.com" className="hover:text-primary-500 transition-colors">
                  📧 info@miswaki.com
                </a>
              </li>
              <li>
                <a href="tel:+9647800000000" className="hover:text-primary-500 transition-colors">
                  📱 +964 780 000 0000
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="hover:text-primary-500 transition-colors text-left"
                >
                  💬 عرض جميع وسائل التواصل
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 مسواكي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
      
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </footer>
  );
};

export default Footer;
