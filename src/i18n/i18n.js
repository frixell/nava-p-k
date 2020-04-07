import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
 
i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
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
    },
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
      wait: true
    }
  });
 
export default i18n;