import { useCallback, useEffect, useMemo, useState } from 'react';
import isEqual from 'lodash.isequal';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import type { CvPageState, CvSeo } from '../store/slices/cvSlice';
import type { SeoFormState } from '../shared/components/backoffice/SeoModal';
import type { SyntheticSetDataEvent } from '../components/cvpage/CvContentStrip';
import { createEmptyCvPage } from '../store/slices/cvSlice';

const defaultSeo: SeoFormState = {
  title: '',
  description: '',
  keyWords: ''
};

const toSeoFormState = (seo?: CvSeo | null): SeoFormState => ({
  title: typeof seo?.title === 'string' ? seo.title : '',
  description: typeof seo?.description === 'string' ? seo.description : '',
  keyWords: typeof seo?.keyWords === 'string' ? seo.keyWords : ''
});

const defaultCvPage: CvPageState = createEmptyCvPage();

interface UseCvPageStateParams {
  cvpageData: CvPageState | null;
  startSetCvPage: () => unknown;
  startEditCvPage: (fbCvpage: Record<string, unknown>, cvpage: CvPageState) => unknown;
  startEditCvPageSeo: (seo: CvSeo) => unknown;
  i18n: { language: string; changeLanguage(lang: string): void };
  urlLang?: string;
}

export const useCvPageState = ({
  cvpageData,
  startSetCvPage,
  startEditCvPage,
  startEditCvPageSeo,
  i18n,
  urlLang
}: UseCvPageStateParams) => {
  const [cvpage, setCvpage] = useState<CvPageState>(defaultCvPage);
  const [cvpageOrigin, setCvpageOrigin] = useState<CvPageState | null>(null);
  const [seo, setSeo] = useState<SeoFormState>(defaultSeo);
  const [isSeoModalOpen, setSeoModalOpen] = useState(false);
  const [pageupImageClassName, setPageupImageClassName] = useState('pageup__image__absolute');

  useEffect(() => {
    if (urlLang && i18n.language !== urlLang) {
      i18n.changeLanguage(urlLang);
    }
  }, [i18n, urlLang]);

  useEffect(() => {
    startSetCvPage();
  }, [startSetCvPage]);

  useEffect(() => {
    if (!cvpageData) {
      return;
    }
    setCvpage(cvpageData);
    setCvpageOrigin(cvpageData);
    setSeo(toSeoFormState(cvpageData.seo));
  }, [cvpageData]);

  const needSave = useMemo(() => {
    if (!cvpageOrigin) {
      return false;
    }
    return !isEqual(cvpageOrigin, cvpage);
  }, [cvpage, cvpageOrigin]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }
    const onScroll = () => {
      setPageupImageClassName((prev) => {
        const result = handlePageScroll(prev);
        if (result && result.pageupImageClassName) {
          return result.pageupImageClassName;
        }
        return prev;
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    if (needSave) {
      window.addEventListener('beforeunload', beforeUnload);
      return () => window.removeEventListener('beforeunload', beforeUnload);
    }
    return () => undefined;
  }, [needSave]);

  const setData = useCallback((event: SyntheticSetDataEvent) => {
    const { value, dataset } = event.target;
    const name = dataset?.name;
    const action = dataset?.action ?? 'setString';
    if (!name) {
      return;
    }
    setCvpage((prev) => ({
      ...prev,
      [name]: action === 'setNumber' ? Number(value) : value
    }));
  }, []);

  const saveCvPage = useCallback(async () => {
    const firebasePayload = JSON.parse(JSON.stringify(cvpage)) as Record<string, unknown>;
    await Promise.resolve(startEditCvPage(firebasePayload, cvpage));
    setCvpageOrigin(cvpage);
  }, [cvpage, startEditCvPage]);

  const toggleSeoModal = useCallback(() => {
    setSeoModalOpen((prev) => !prev);
  }, []);

  const handleSeoChange = useCallback((field: keyof SeoFormState, value: string) => {
    setSeo((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const submitSeo = useCallback(async () => {
    const payload: CvSeo = { ...seo };
    await Promise.resolve(startEditCvPageSeo(payload));
    toggleSeoModal();
  }, [seo, startEditCvPageSeo, toggleSeoModal]);

  return {
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
    langLink: '/קורות_חיים',
    langLinkEng: '/CV'
  };
};

export type { CvPageState };
