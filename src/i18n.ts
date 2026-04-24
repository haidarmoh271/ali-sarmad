import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar';
import en from './locales/en';

const savedLanguage = localStorage.getItem('language') || 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar,
      en,
    },
    lng: savedLanguage,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

export default i18n;
