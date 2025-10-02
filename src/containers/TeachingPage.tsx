import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Navigation from '../components/common/Navigation';
import Footer from '../components/common/Footer';
import PageUpStrip from '../components/common/PageUpStrip';
import TeachList from './teaching/TeachList';
import TeachEditorModal from './teaching/TeachEditorModal';
import TeachingSeoModal from './teaching/TeachingSeoModal';
import TeachingToolbar from './teaching/TeachingToolbar';
import { useTeachingPage } from './teaching/useTeachingPage';
import {
    PageWrapper,
    ContentSection,
    ContentInner,
    HeaderContainer,
    HeaderTitle
} from './teaching/TeachingPage.styles';

interface TeachingPageProps {
    urlLang?: string;
}

const TeachingPage: React.FC<TeachingPageProps> = ({ urlLang }) => {
    const { i18n } = useTranslation();
    const teaching = useTeachingPage({ urlLang, i18n });
    const language = i18n.language;
    const isHebrew = language === 'he';

    return (
        <PageWrapper>
            <Helmet>
                <title>{teaching.seo.title}</title>
            </Helmet>

            <Navigation langLink="/הוראה" langLinkEng="/teaching" />

            <ContentSection>
                <ContentInner>
                    <TeachingToolbar
                        isAuthenticated={teaching.isAuthenticated}
                        language={language}
                        onAddTeach={() => teaching.openTeachEditor()}
                        onOpenSeo={teaching.openSeoModal}
                        onLogout={teaching.logout}
                    />

                    <HeaderContainer>
                        <HeaderTitle>{isHebrew ? 'הוראה' : 'Teaching'}</HeaderTitle>
                    </HeaderContainer>

                    <TeachList
                        teachings={teaching.teachings}
                        language={language}
                        isAuthenticated={teaching.isAuthenticated}
                        onEdit={teaching.openTeachEditor}
                        onDelete={teaching.deleteTeach}
                        onToggleVisibility={teaching.toggleTeachVisibility}
                        onOrderChange={teaching.changeTeachOrder}
                        onOrderCommit={teaching.commitTeachOrder}
                    />
                </ContentInner>
            </ContentSection>

            <div hidden={teaching.pageupImageClassName === 'pageup__image'} className="pageup__image__fake desktop" />
            <PageUpStrip pageupImageClassName={teaching.pageupImageClassName} />
            <div id="fake_pageupstrip" />
            <Footer lang={language} position="relative" />

            <TeachingSeoModal
                open={teaching.seoModalOpen}
                language={language}
                seo={teaching.seo}
                onClose={teaching.closeSeoModal}
                onChange={teaching.updateSeoField}
                onSubmit={teaching.saveSeo}
            />

            <TeachEditorModal
                open={teaching.editModalOpen}
                language={language}
                teach={teaching.draftTeach}
                onClose={teaching.closeTeachEditor}
                onChange={teaching.updateDraftTeach}
                onSave={teaching.saveDraftTeach}
                onUploadImage={teaching.launchImageUpload}
            />
        </PageWrapper>
    );
};

export default TeachingPage;
