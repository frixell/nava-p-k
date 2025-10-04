import React from 'react';
import { useTranslation } from 'react-i18next';
import { FooterContainer, FooterText } from './Footer.styles';

type FooterPosition = 'absolute' | 'relative' | 'fixed';

interface FooterProps {
  position?: FooterPosition;
}

const Footer: React.FC<FooterProps> = ({ position }) => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const direction: 'ltr' | 'rtl' = isHebrew ? 'rtl' : 'ltr';

  return (
    <FooterContainer position={position}>
      <FooterText screen="desktop" dir={direction}>
        {t('allRightsReserved')} | {t('programmingBy')}
      </FooterText>
      <FooterText screen="mobile" dir={direction}>
        {t('allRightsReserved')} | {t('programmingBy')}
      </FooterText>
    </FooterContainer>
  );
};

export default Footer;
