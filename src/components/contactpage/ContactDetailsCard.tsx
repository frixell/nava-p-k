import React from 'react';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PlaceIcon from '@mui/icons-material/Place';
import {
  Card,
  CardHeading,
  CardSubheading,
  LinkList,
  LinkItem,
  LinkAnchor
} from './ContactPage.styles';
import { useTranslation } from 'react-i18next';

interface ContactDetailsCardProps {
  language: string;
}

const CONTACTS = {
  phone: '+972505966599',
  email: 'nava-p-k@gmail.com',
  address: {
    he: 'עין הוד, ישראל',
    en: 'Ein Hod, Israel'
  },
  facebook: 'https://www.facebook.com/profile.php?id=100010955083493',
  instagram: 'https://www.instagram.com/nava_persov_kainer/'
};

const ContactDetailsCard: React.FC<ContactDetailsCardProps> = ({ language }) => {
  const { t } = useTranslation();
  const dir: 'ltr' | 'rtl' = language === 'he' ? 'rtl' : 'ltr';

  return (
    <Card style={{ direction: dir }}>
      <CardHeading direction={dir}>{t('contact.details.title', 'Let’s stay in touch')}</CardHeading>
      <CardSubheading direction={dir}>
        {t('contact.details.subtitle', 'Call, write or follow on social media.')}
      </CardSubheading>

      <LinkList>
        <LinkItem>
          <LinkAnchor href={`tel:${CONTACTS.phone}`}>
            <LocalPhoneIcon fontSize="small" />
            <span>{CONTACTS.phone}</span>
          </LinkAnchor>
        </LinkItem>
        <LinkItem>
          <LinkAnchor href={`mailto:${CONTACTS.email}`}>
            <MailOutlineIcon fontSize="small" />
            <span>{CONTACTS.email}</span>
          </LinkAnchor>
        </LinkItem>
        <LinkItem>
          <LinkAnchor href={CONTACTS.facebook} target="_blank" rel="noreferrer">
            <FacebookIcon fontSize="small" />
            <span>{t('contact.details.facebook', 'Facebook')}</span>
          </LinkAnchor>
        </LinkItem>
        <LinkItem>
          <LinkAnchor href={CONTACTS.instagram} target="_blank" rel="noreferrer">
            <InstagramIcon fontSize="small" />
            <span>{t('contact.details.instagram', 'Instagram')}</span>
          </LinkAnchor>
        </LinkItem>
        <LinkItem>
          <LinkAnchor
            href="https://maps.app.goo.gl/eTu9nzfkESJCqCwF6"
            target="_blank"
            rel="noreferrer"
          >
            <PlaceIcon fontSize="small" />
            <span>{CONTACTS.address[language === 'he' ? 'he' : 'en']}</span>
          </LinkAnchor>
        </LinkItem>
      </LinkList>
    </Card>
  );
};

export default ContactDetailsCard;
