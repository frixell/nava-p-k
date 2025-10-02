import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import isEqual from 'lodash.isequal';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';

interface UseCvPageStateParams {
  cvpageData: any;
  startSetCvPage: () => unknown;
  startEditCvPage: (fbCvpage: any, cvpage: any) => unknown;
  startEditCvPageSeo: (seo: any) => unknown;
  i18n: { language: string; changeLanguage: (lang: string) => void };
  urlLang?: string;
}

const defaultSeo = { title: '', description: '', keyWords: '' };

export const useCvPageState = ({
  cvpageData,
  startSetCvPage,
  startEditCvPage,
  startEditCvPageSeo,
  i18n,
  urlLang
}: UseCvPageStateParams) => {
  const [cvpage, setCvpage] = useState<any>({ content: '' });
  const [cvpageOrigin, setCvpageOrigin] = useState<any>(null);
  const [seo, setSeo] = useState(defaultSeo);
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
    if (!cvpageData) return;
    setCvpage(cvpageData);
    setCvpageOrigin(cvpageData);
    setSeo(cvpageData.seo ?? defaultSeo);
  }, [cvpageData]);

  const needSave = useMemo(() => {
    if (!cvpageOrigin) return false;
    return !isEqual(cvpage, cvpageOrigin);
  }, [cvpage, cvpageOrigin]);

  useEffect(() => {
    const handle = () => {
      setPageupImageClassName((prev) => {
        const result = handlePageScroll(prev);
        if (result && result.pageupImageClassName) {
          return result.pageupImageClassName;
        }
        return prev;
      });
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handle);
      return () => window.removeEventListener('scroll', handle);
    }
    return () => undefined;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };
    if (needSave) {
      window.addEventListener('beforeunload', beforeUnload);
      return () => window.removeEventListener('beforeunload', beforeUnload);
    }
    return () => undefined;
  }, [needSave]);

  type DataEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | {
    target: {
      value: string;
      dataset?: {
        action?: string;
        name?: string;
      };
    };
  };

  const setData = useCallback((event: DataEvent) => {
    const { value, dataset } = event.target;
    const name = dataset?.name;
    const action = dataset?.action;
    if (!name) return;
    setCvpage((prev: any) => {
      const next = { ...prev };
      if (action === 'setNumber') {
        next[name] = Number(value);
      } else {
        next[name] = value;
      }
      return next;
    });
  }, []);

  const saveCvPage = useCallback(async () => {
    const payload = JSON.parse(JSON.stringify(cvpage));
    await Promise.resolve(startEditCvPage(payload, payload));
    setCvpageOrigin(payload);
  }, [cvpage, startEditCvPage]);

  const toggleSeoModal = useCallback(() => {
    setSeoModalOpen((prev) => !prev);
  }, []);

  const handleSeoChange = useCallback((field: 'title' | 'description' | 'keyWords', value: string) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const submitSeo = useCallback(async () => {
    await Promise.resolve(startEditCvPageSeo(seo));
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
