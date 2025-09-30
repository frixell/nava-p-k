import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations as legacyTranslations } from '../translations';

const baseResources = {
  en: {
    translations: {
      "homepageEventsHeader": "Ziva Kainer - Paintings and More",
      "readMore": "Read More",
      "newsLetter": "News Letter",
      "newsLetterText": "Join and recive update on paintings and workshops"
    }
  },
  he: {
    translations: {
      "homepageEventsHeader": "זיוה קיינר - ציורים וסדנאות",
      "readMore": "קראו עוד",
      "newsLetter": "רשימת תפוצה",
      "newsLetterText": "הצטרפו וקבלו עדכונים על עבודות חדשות וסדנאות"
    }
  }
};

const resources = Object.keys({ ...legacyTranslations, ...baseResources }).reduce((acc, lng) => {
  const existing = baseResources[lng]?.translations ?? {};
  const legacy = legacyTranslations[lng] ?? {};

  acc[lng] = {
    translations: {
      ...legacy,
      ...existing
    }
  };

  return acc;
}, {});

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources,
    fallbackLng: 'en',
    debug: true,
 
    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',
 
    keySeparator: false, // we use content as keys
 
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },
 
    react: {
      useSuspense: false
    }
  });

export default i18n;
