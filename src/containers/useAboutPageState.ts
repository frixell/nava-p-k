import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash.isequal';
import { startLogout } from '../store/slices/authSlice';
import type { SeoPayload } from '../types/seo';
import type { RootState } from '../types/store';
import {
  startSetAboutPage,
  startEditAboutPage,
  startEditAboutPageSeo,
  startSaveAboutImage
} from '../store/slices/aboutSlice';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import type { SeoFormState } from '../shared/components/backoffice/SeoModal';

declare const cloudinary: any;

type AboutImage = {
  publicId?: string;
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
};

type AboutPageData = Record<string, unknown> & {
  slogen?: string;
  slogenHebrew?: string;
  about?: unknown;
  content?: string;
  contentHebrew?: string;
  image?: AboutImage;
  seo?: SeoFormState;
};

const defaultSeo: SeoFormState = {
  title: '',
  description: '',
  keyWords: ''
};

const defaultAboutPage: AboutPageData = {
  slogen: '',
  slogenHebrew: '',
  about: '',
  content: '',
  contentHebrew: '',
  image: {}
};

interface UseAboutPageStateParams {
  urlLang?: string;
}

export const useAboutPageState = ({ urlLang }: UseAboutPageStateParams) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const isAuthenticated = useAppSelector((state: RootState) => {
    const authState = state.auth as { uid?: string | null } | undefined;
    return Boolean(authState?.uid);
  });
  const aboutpageFromStore = useAppSelector((state: RootState) => state.aboutpage);

  const [aboutpage, setAboutpage] = useState<AboutPageData>(defaultAboutPage);
  const [aboutpageOrigin, setAboutpageOrigin] = useState<AboutPageData | null>(null);
  const [pageupImageClassName, setPageupImageClassName] = useState('pageup__image__absolute');
  const [isSeoModalOpen, setSeoModalOpen] = useState(false);
  const [seo, setSeo] = useState<SeoFormState>(defaultSeo);

  useEffect(() => {
    dispatch(startSetAboutPage() as any).then((payload: AboutPageData) => {
      if (payload) {
        setAboutpage(payload);
        setAboutpageOrigin(payload);
        setSeo(payload.seo ?? defaultSeo);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (!aboutpageFromStore || !Object.keys(aboutpageFromStore).length) {
      return;
    }
    if (!aboutpageOrigin || !isEqual(aboutpageFromStore, aboutpageOrigin)) {
      setAboutpage(aboutpageFromStore);
      setAboutpageOrigin(aboutpageFromStore);
      setSeo(aboutpageFromStore.seo ?? defaultSeo);
    }
  }, [aboutpageFromStore, aboutpageOrigin]);

  useEffect(() => {
    if (urlLang && i18n.language !== urlLang) {
      void i18n.changeLanguage(urlLang);
    }
  }, [i18n, urlLang]);

  const needSave = useMemo(() => {
    if (!aboutpageOrigin) {
      return false;
    }
    return !isEqual(aboutpageOrigin, aboutpage);
  }, [aboutpage, aboutpageOrigin]);

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

  const updateField = useCallback((action: 'setString' | 'setNumber', name: string, value: string | number) => {
    setAboutpage((prev) => {
      if (!prev) {
        return prev;
      }
      const nextValue = action === 'setNumber' ? Number(value) : value;
      return {
        ...prev,
        [name]: nextValue
      };
    });
  }, []);

  const saveAboutPage = useCallback(() => {
    const payload = JSON.parse(JSON.stringify(aboutpage));
    dispatch(startEditAboutPage(payload, payload) as any);
    setAboutpageOrigin(payload);
  }, [aboutpage, dispatch]);

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
    await dispatch(startEditAboutPageSeo(seo as unknown as SeoPayload) as any);
    toggleSeoModal();
  }, [dispatch, seo, toggleSeoModal]);

  const handleLogout = useCallback(() => {
    dispatch(startLogout() as any);
  }, [dispatch]);

  const openUploadWidget = useCallback(() => {
    if (typeof cloudinary === 'undefined' || !cloudinary.openUploadWidget) {
      return;
    }
    const currentPublicId = (aboutpage?.image as AboutImage | undefined)?.publicId ?? null;
    const widget = cloudinary.openUploadWidget(
      {
        cloud_name: 'dewafmxth',
        upload_preset: 'ml_default',
        sources: ['local', 'url', 'image_search', 'facebook', 'dropbox', 'instagram', 'camera']
      },
      (error: unknown, result: any) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          return;
        }
        if (result?.event === 'success') {
          const image: AboutImage = {
            publicId: result.info.public_id,
            src: result.info.secure_url,
            width: result.info.width,
            height: result.info.height,
            alt: result.info.original_filename
          };
          dispatch(startSaveAboutImage(image, currentPublicId || undefined) as any).then(() => {
            setAboutpage((prev) => ({
              ...prev,
              image
            }));
          });
          widget?.close();
        }
      }
    );
    widget?.open();
  }, [aboutpage, dispatch]);

  return {
    t,
    i18n,
    isAuthenticated,
    aboutpage,
    aboutpageOrigin,
    seo,
    needSave,
    pageupImageClassName,
    isSeoModalOpen,
    langLink: '/אודות',
    langLinkEng: '/About',
    updateField,
    saveAboutPage,
    toggleSeoModal,
    handleSeoChange,
    submitSeo,
    handleLogout,
    openUploadWidget
  };
};

export type { AboutPageData, AboutImage };
