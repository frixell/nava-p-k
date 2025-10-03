import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import ContactFormCard from '../components/contactpage/ContactFormCard';
import ContactDetailsCard from '../components/contactpage/ContactDetailsCard';
import { PageContainer } from './PageLayout.styles';
import { ContactLayout, CardGrid } from '../components/contactpage/ContactPage.styles';
import { submitContactMessage } from '../services/contactService';
import type { ContactFormInput } from '../utils/dataTransformers';

interface ContactPageProps {
  urlLang?: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ urlLang }) => {
  const { t, i18n } = useTranslation();
  if (urlLang && i18n.language !== urlLang) {
    i18n.changeLanguage(urlLang);
  }

  const handleSubmit = useCallback(async (payload: ContactFormInput) => {
    await submitContactMessage(payload);
  }, []);

  const langLink = '/צרו_קשר';
  const langLinkEng = '/Contact';

  return (
    <PageContainer>
      <Helmet>
        <title>{t('contact.meta.title', 'Contact • Nava Kainer-Persov')}</title>
      </Helmet>

      <Navigation langLink={langLink} langLinkEng={langLinkEng} />

      <ContactLayout>
        <CardGrid>
          <ContactFormCard language={i18n.language} onSubmit={handleSubmit} />
          <ContactDetailsCard language={i18n.language} />
        </CardGrid>
      </ContactLayout>

      <Footer position="relative" />
    </PageContainer>
  );
};

export default ContactPage;
