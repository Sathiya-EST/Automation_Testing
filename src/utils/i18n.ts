import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLang from './locales/en/index.json';
import frLang from './locales/fr/index.json';
const resources = {
  en: { translation: enLang },
  fr: { translation: frLang },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'fr',
    supportedLngs: ['en', 'fr', 'es'],
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });
i18n.changeLanguage('en');

export default i18n;
