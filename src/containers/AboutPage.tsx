import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/common/Navigation';
import PageUpStrip from '../components/common/PageUpStrip';
import Footer from '../components/common/Footer';
import AboutTopStrip from '../components/aboutpage/AboutTopStrip';
import AboutContentStrip from '../components/aboutpage/AboutContentStrip';
import { PageContainer, PageUpSpacer, FakePageUpStripAnchor } from './PageLayout.styles';
import { AboutStructure, AboutLeftColumn, HeaderContainer, PageHeading } from './AboutPage.styles';
import CvToolbar from './CvToolbar';
import SeoModal from '../shared/components/backoffice/SeoModal';
import { useAboutPageState } from './useAboutPageState';

interface AboutPageProps {
  urlLang?: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ urlLang }) => {
  const { t, i18n, isAuthenticated, aboutpage, aboutpageOrigin, seo, needSave, pageupImageClassName,
    isSeoModalOpen, langLink, langLinkEng, updateField, saveAboutPage, toggleSeoModal,
    handleSeoChange, submitSeo, handleLogout, openUploadWidget } = useAboutPageState({ urlLang });
  const isSpacerHidden = pageupImageClassName === 'pageup__image';
  const textKey = i18n.language === 'en' ? 'slogen' : 'slogenHebrew';

  return (
    <PageContainer>
      <Helmet>
        <title>{seo.title}</title>
      </Helmet>

      {isAuthenticated && (
        <SeoModal
          open={isSeoModalOpen}
          dir={i18n.language === 'he' ? 'rtl' : 'ltr'}
          formState={seo}
          onChange={handleSeoChange}
          onSubmit={submitSeo}
          onClose={toggleSeoModal}
          labels={{
            titlePlaceholder: t('about.seo.title', 'Page title'),
            descriptionPlaceholder: t('about.seo.description', 'Description'),
            keywordsPlaceholder: t('about.seo.keywords', 'Keywords'),
            submit: t('about.seo.submit', 'Update'),
            heading: 'SEO'
          }}
          readonlyPreview={seo}
        />
      )}

      <Navigation langLink={langLink} langLinkEng={langLinkEng} />

      <CvToolbar
        isAuthenticated={isAuthenticated}
        isEnglish={i18n.language === 'en'}
        needSave={needSave}
        onSave={saveAboutPage}
        onSeo={toggleSeoModal}
        onExit={handleLogout}
        translate={(key, fallback) => t(key, { defaultValue: fallback })}
      />

      <AboutStructure>
        <AboutLeftColumn>
          <HeaderContainer>
            <PageHeading>{i18n.language === 'en' ? 'About' : 'אודות'}</PageHeading>
          </HeaderContainer>

          <AboutTopStrip
            language={i18n.language}
            isAuthenticated={isAuthenticated}
            image={aboutpage.image}
            text={aboutpage[textKey] as string}
            onTextChange={(value) => updateField('setString', textKey, value)}
            onRequestUpload={openUploadWidget}
          />

          <AboutContentStrip
            isAuthenticated={isAuthenticated}
            language={i18n.language}
            aboutpage={aboutpage}
            aboutpageOrigin={aboutpageOrigin}
            onContentChange={(name, value) => updateField('setString', name, value)}
          />
        </AboutLeftColumn>
      </AboutStructure>

      <PageUpSpacer isHidden={isSpacerHidden} aria-hidden={isSpacerHidden} />
      <PageUpStrip pageupImageClassName={pageupImageClassName} />
      <FakePageUpStripAnchor id="fake_pageupstrip" />
      <Footer position="relative" />
    </PageContainer>
  );
};

export default AboutPage;
