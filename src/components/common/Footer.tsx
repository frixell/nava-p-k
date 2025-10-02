import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type FooterPosition = 'absolute' | 'relative' | 'fixed';

interface FooterProps {
  position?: FooterPosition;
}

const positionClassMap: Record<FooterPosition, string> = {
  absolute: 'footer__box--absolute',
  relative: 'footer__box--relative',
  fixed: 'footer__box--fixed'
};

const Footer: React.FC<FooterProps> = ({ position }) => {
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const direction: 'ltr' | 'rtl' = isHebrew ? 'rtl' : 'ltr';

  const modifierClass = useMemo(() => {
    if (!position) {
      return '';
    }
    return positionClassMap[position] ? ` ${positionClassMap[position]}` : '';
  }, [position]);

  const localeClass = isHebrew ? ' footer__box--he' : ' footer__box--en';

  return (
    <div className={`footer__box${localeClass}${modifierClass}`}>
      <p className="footer__text Heebo-Regular desktop" dir={direction}>
        {t('allRightsReserved')} | {t('programmingBy')}
      </p>
      <p className="footer__text Heebo-Regular mobile" dir={direction}>
        {t('allRightsReserved')} | {t('programmingBy')}
      </p>
    </div>
  );
};

export default Footer;
