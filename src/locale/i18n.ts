import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HOME_EN from './langs/en/home.json';
import HOME_VN from './langs/vi/home.json';

import CONTACT_EN from './langs/en/contact.json';
import CONTACT_VN from './langs/vi/contact.json';

import VALIDATION_EN from './langs/en/validation.json';
import VALIDATION_VN from './langs/vi/validation.json';
import AUTH_EN from './langs/en/auth.json';
import AUTH_VN from './langs/vi/auth.json';

const i18nInstance = i18n.createInstance();

i18nInstance.use(initReactI18next).init({
  resources: {
    en: {
      home: HOME_EN,
      contact: CONTACT_EN,
      validation: VALIDATION_EN,
      auth: AUTH_EN,
    },
    vi: {
      home: HOME_VN,
      contact: CONTACT_VN,
      validation: VALIDATION_VN,
      auth: AUTH_VN,
    },
  },
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['path', 'cookie', 'navigator'],
    lookupFromPathIndex: 0,
  },
  react: {
    useSuspense: false,
  },
});

export default i18nInstance;
