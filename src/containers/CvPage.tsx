import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/common/Navigation';
import PageUpStrip from '../components/common/PageUpStrip';
import Footer from '../components/common/Footer';
import { useCvPageState } from './useCvPageState';
import { startSetCvPage, startEditCvPage, startEditCvPageSeo } from '../store/slices/cvSlice';
import { startLogout } from '../store/slices/authSlice';
import CvToolbar from './CvToolbar';
import CvSeoModal from './CvSeoModal';
import CvBody from './CvBody';
import { PageContainer, PageUpSpacer, FakePageUpStripAnchor } from './PageLayout.styles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { RootState } from '../types/store';

interface CvPageProps {
  urlLang?: string;
}

const CvPage: React.FC<CvPageProps> = ({ urlLang }) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const isAuthenticated = useAppSelector((state: RootState) => {
    const authState = state.auth as { uid?: string | null } | undefined;
    return Boolean(authState?.uid);
  });
  const cvpageData = useAppSelector((state: RootState) => state.cvpage);

  const loadCvPage: () => void = useCallback(() => {
    dispatch(startSetCvPage() as any);
  }, [dispatch]);
  const saveCvPageToDb: (fb: any, cv: any) => void = useCallback(
    (fb: any, cv: any) => {
      dispatch(startEditCvPage(fb, cv) as any);
    },
    [dispatch]
  );
  const saveSeoToDb: (seo: any) => void = useCallback(
    (seo: any) => {
      dispatch(startEditCvPageSeo(seo) as any);
    },
    [dispatch]
  );
  const logout: () => void = useCallback(() => {
    dispatch(startLogout() as any);
  }, [dispatch]);

  const {
    cvpage,
    cvpageOrigin,
    seo,
    needSave,
    isSeoModalOpen,
    toggleSeoModal,
    handleSeoChange,
    submitSeo,
    saveCvPage,
    setData,
    pageupImageClassName,
    langLink,
    langLinkEng
  } = useCvPageState({
    cvpageData,
    startSetCvPage: loadCvPage,
    startEditCvPage: saveCvPageToDb,
    startEditCvPageSeo: saveSeoToDb,
    i18n,
    urlLang
  });

  const isSpacerHidden = pageupImageClassName === 'pageup__image';

  return (
    <PageContainer>
      <Helmet>
        <title>{seo?.title}</title>
      </Helmet>

      {isAuthenticated && (
        <CvSeoModal
          open={isSeoModalOpen}
          language={i18n.language}
          seo={seo}
          onChange={handleSeoChange}
          onSubmit={submitSeo}
          onClose={toggleSeoModal}
        />
      )}

      <Navigation langLink={langLink} langLinkEng={langLinkEng} />

      <CvToolbar
        isAuthenticated={isAuthenticated}
        isEnglish={i18n.language === 'en'}
        needSave={needSave}
        onSave={saveCvPage}
        onSeo={toggleSeoModal}
        onExit={logout}
        translate={(key, fallback) => t(key, { defaultValue: fallback })}
      />

      <CvBody
        isAuthenticated={isAuthenticated}
        language={i18n.language}
        cvpage={cvpage}
        cvpageOrigin={cvpageOrigin}
        setData={setData}
      />

      <PageUpSpacer
        isHidden={isSpacerHidden}
        hidden={isSpacerHidden}
        aria-hidden={isSpacerHidden}
      />
      <PageUpStrip pageupImageClassName={pageupImageClassName} />
      <FakePageUpStripAnchor id="fake_pageupstrip" />
      <Footer position="relative" />
    </PageContainer>
  );
};

export default CvPage;
