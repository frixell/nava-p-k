import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash.isequal';
import { startLogout } from '../store/slices/authSlice';
import type { SeoPayload } from '../types/seo';
import type { ImageAsset } from '../types/content';
import {
  startSetAboutPage,
  startEditAboutPage,
  startEditAboutPageSeo,
  startSaveAboutImage,
  type AboutPageState,
  type AboutSeo,
  createEmptyAboutPage
} from '../store/slices/aboutSlice';
import { handlePageScroll } from '../reusableFunctions/handlePageScroll';
import type { SeoFormState } from '../shared/components/backoffice/SeoModal';
import { cloudinaryEnv, isCloudinaryConfigured, logMissingCloudinaryConfig } from '../constants/cloudinary';

interface CloudinaryWidget {
  open(): void;
  close(): void;
}

interface CloudinaryUploadInfo {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  original_filename?: string;
}

type CloudinaryUploadResult =
  | { event: 'success'; info: CloudinaryUploadInfo }
  | { event: Exclude<string, 'success'>; info?: unknown };

interface CloudinaryGlobal {
  openUploadWidget(
    options: Record<string, unknown>,
    callback: (error: Error | null, result?: CloudinaryUploadResult) => void
  ): CloudinaryWidget | undefined;
}

declare const cloudinary: CloudinaryGlobal | undefined;

logMissingCloudinaryConfig();

type AboutImage = ImageAsset;

type AboutPageData = AboutPageState;

const defaultSeo: SeoFormState = {
  title: '',
  description: '',
  keyWords: ''
};

const toSeoFormState = (seo?: AboutSeo | SeoFormState | null): SeoFormState => ({
  title: typeof seo?.title === 'string' ? seo.title : '',
  description: typeof seo?.description === 'string' ? seo.description : '',
  keyWords: typeof seo?.keyWords === 'string' ? seo.keyWords : ''
});

const isSuccessUpload = (
  result?: CloudinaryUploadResult
): result is Extract<CloudinaryUploadResult, { event: 'success' }> =>
  Boolean(result && result.event === 'success');

const defaultAboutPage: AboutPageData = createEmptyAboutPage();

interface UseAboutPageStateParams {
  urlLang?: string;
}

export const useAboutPageState = ({ urlLang }: UseAboutPageStateParams) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.uid));
  const aboutpageFromStore = useAppSelector((state) => state.aboutpage);

  const [aboutpage, setAboutpage] = useState<AboutPageData>(defaultAboutPage);
  const [aboutpageOrigin, setAboutpageOrigin] = useState<AboutPageData | null>(null);
  const [pageupImageClassName, setPageupImageClassName] = useState('pageup__image__absolute');
  const [isSeoModalOpen, setSeoModalOpen] = useState(false);
  const [seo, setSeo] = useState<SeoFormState>(defaultSeo);

  useEffect(() => {
    dispatch(startSetAboutPage()).then((payload: AboutPageState) => {
      setAboutpage(payload);
      setAboutpageOrigin(payload);
      setSeo(toSeoFormState(payload.seo));
      return payload;
    });
  }, [dispatch]);

  useEffect(() => {
    if (!aboutpageOrigin || !isEqual(aboutpageFromStore, aboutpageOrigin)) {
      setAboutpage(aboutpageFromStore);
      setAboutpageOrigin(aboutpageFromStore);
      setSeo(toSeoFormState(aboutpageFromStore.seo));
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

  const updateField = useCallback(
    (action: 'setString' | 'setNumber', name: string, value: string | number) => {
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
    },
    []
  );

  const saveAboutPage = useCallback(() => {
    const firebasePayload = JSON.parse(JSON.stringify(aboutpage)) as Record<string, unknown>;
    dispatch(startEditAboutPage(firebasePayload, aboutpage));
    setAboutpageOrigin(aboutpage);
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
    const payload: SeoPayload = { ...seo };
    await dispatch(startEditAboutPageSeo(payload));
    toggleSeoModal();
  }, [dispatch, seo, toggleSeoModal]);

  const handleLogout = useCallback(() => {
    dispatch(startLogout());
  }, [dispatch]);

  const openUploadWidget = useCallback(() => {
    if (!cloudinary || typeof cloudinary.openUploadWidget !== 'function') {
      return;
    }
    if (!isCloudinaryConfigured()) {
      logMissingCloudinaryConfig();
      return;
    }
    const currentPublicId = (aboutpage?.image as AboutImage | undefined)?.publicId ?? null;
    const widget = cloudinary.openUploadWidget(
      {
        cloud_name: cloudinaryEnv.cloudName,
        upload_preset: cloudinaryEnv.uploadPreset,
        sources: ['local', 'url', 'image_search', 'facebook', 'dropbox', 'instagram', 'camera']
      },
      async (error: Error | null, result?: CloudinaryUploadResult) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          return;
        }
        if (!isSuccessUpload(result)) {
          return;
        }
        const uploadInfo = result.info;
        const image: AboutImage = {
          publicId: uploadInfo.public_id,
          src: uploadInfo.secure_url,
          width: uploadInfo.width,
          height: uploadInfo.height,
          alt: uploadInfo.original_filename,
          order: 0
        };

        await dispatch(startSaveAboutImage(image, currentPublicId ?? undefined));
        setAboutpage((prev) => ({
          ...prev,
          image
        }));
        widget?.close();
      }
    );
    widget?.open();
  }, [
    aboutpage,
    dispatch,
    isCloudinaryConfigured,
    logMissingCloudinaryConfig,
    cloudinaryEnv.cloudName,
    cloudinaryEnv.uploadPreset
  ]);

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
