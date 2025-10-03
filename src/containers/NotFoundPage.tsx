import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import {
  PageWrapper,
  HeroSection,
  Panel,
  Title,
  Subtitle,
  ActionBar,
  ActionButton,
  ActionText
} from './NotFoundPage.styles';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const isHebrew = i18n.language === 'he';

  const navigationLinks = useMemo(
    () => ({
      langLink: '/לא_נמצא',
      langLinkEng: '/not_found'
    }),
    []
  );

  const handleGoHome = () => navigate('/');

  return (
    <PageWrapper>
      <Navigation langLink={navigationLinks.langLink} langLinkEng={navigationLinks.langLinkEng} />

      <HeroSection>
        <Panel>
          <Title>404</Title>
          <Subtitle>{isHebrew ? 'העמוד לא נמצא' : 'Page not found'}</Subtitle>
          <ActionBar dir={isHebrew ? 'rtl' : 'ltr'}>
            <ActionButton type="button" onClick={handleGoHome}>
              <ActionText>{isHebrew ? 'בחזרה לאתר' : 'Back to site'}</ActionText>
            </ActionButton>
          </ActionBar>
        </Panel>
      </HeroSection>

      <Footer />
    </PageWrapper>
  );
};

export default NotFoundPage;
