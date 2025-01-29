import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import es from './locales/es.json';

const storedLanguage = localStorage.getItem('preferredLanguage');

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    lng: storedLanguage || undefined, // Use stored preference if available
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferredLanguage',
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;