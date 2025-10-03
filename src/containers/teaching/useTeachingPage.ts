import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AnyAction } from 'redux';
import {
    useAppDispatch,
    useAppSelector
} from '../../store/hooks';
import type { RootState } from '../../types/store';
import {
    startSetTeachingPage,
    startEditTeachingPageSeo,
    startAddTeach,
    startShowTeach,
    startUpdateTeach,
    startUpdateTeachImage,
    startUpdateTeachings,
    startDeleteTeach
} from '../../store/slices/teachingSlice';
import { startLogout } from '../../store/slices/authSlice';
import { handlePageScroll } from '../../reusableFunctions/handlePageScroll';
import isEqual from 'lodash.isequal';
import {
    TeachItem,
    TeachImage,
    TeachingSeo,
    TeachingPageStore,
    EMPTY_TEACH,
    DEFAULT_SEO
} from './types';
import type { SeoPayload } from '../../types/seo';

declare const cloudinary: any;

interface UseTeachingPageArgs {
    urlLang?: string;
    i18n: { language: string; changeLanguage(lang: string): void };
}

export interface UseTeachingPageResult {
    isAuthenticated: boolean;
    teachings: TeachItem[];
    draftTeach: TeachItem | null;
    draftError: string | null;
    seo: TeachingSeo;
    seoModalOpen: boolean;
    editModalOpen: boolean;
    pageupImageClassName: string;
    openSeoModal(): void;
    closeSeoModal(): void;
    updateSeoField(field: keyof TeachingSeo, value: string): void;
    saveSeo(): Promise<void>;
    openTeachEditor(teach?: TeachItem): void;
    closeTeachEditor(): void;
    updateDraftTeach(field: keyof TeachItem, value: unknown): void;
    saveDraftTeach(): Promise<void>;
    deleteTeach(id: string): Promise<void>;
    toggleTeachVisibility(id: string, visible: boolean): Promise<void>;
    changeTeachOrder(id: string, order: number): void;
    commitTeachOrder(id: string, order: number): Promise<void>;
    launchImageUpload(): void;
    logout(): void;
}

const toTeachArray = (source?: TeachItem[] | Record<string, TeachItem>): TeachItem[] => {
    if (!source) {
        return [];
    }

    if (Array.isArray(source)) {
        return source.map((teach) => ({ ...teach }));
    }

    return Object.keys(source).map((key) => {
        const data = source[key] || {};
        return { ...data, id: data.id ?? key } as TeachItem;
    });
};

const normalizeTeach = (teach: TeachItem): TeachItem => ({
    ...teach,
    order: typeof teach.order === 'number' ? teach.order : Number(teach.order ?? 0),
    visible: typeof teach.visible === 'string' ? teach.visible === 'true' : teach.visible
});

const sortTeachings = (items: TeachItem[]): TeachItem[] =>
    [...items].sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : Number(a.order ?? 0);
        const orderB = typeof b.order === 'number' ? b.order : Number(b.order ?? 0);
        return orderB - orderA;
    });

const buildTeachings = (source?: TeachItem[] | Record<string, TeachItem>): TeachItem[] =>
    sortTeachings(toTeachArray(source).map(normalizeTeach));

const stripHtml = (value: unknown): string =>
    typeof value === 'string'
        ? value
              .replace(/<[^>]*>/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
        : '';

const hasRichTextContent = (...values: Array<unknown>): boolean =>
    values.some((value) => stripHtml(value).length > 0);

const validateTeachDraft = (draft: TeachItem): string | null => {
    const hasPrimaryContent = hasRichTextContent(draft.details, draft.detailsHebrew);
    const hasSecondaryContent = hasRichTextContent(draft.description, draft.descriptionHebrew);
    if (!hasPrimaryContent || !hasSecondaryContent) {
        return 'Details and description are required in at least one language.';
    }
    return null;
};

export const useTeachingPage = ({ urlLang, i18n }: UseTeachingPageArgs): UseTeachingPageResult => {
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector((state: RootState) => {
        const authState = state.auth as { uid?: string | null } | undefined;
        return Boolean(authState?.uid);
    });
    const teachingStore = useAppSelector((state: RootState) =>
        (state.teachingpage as TeachingPageStore) || {}
    );

    const [teachings, setTeachings] = useState<TeachItem[]>(() => buildTeachings(teachingStore.teachings));
    const [draftTeach, setDraftTeach] = useState<TeachItem | null>(null);
    const [draftError, setDraftError] = useState<string | null>(null);
    const [seo, setSeo] = useState<TeachingSeo>(teachingStore.seo ?? DEFAULT_SEO);
    const [seoModalOpen, setSeoModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [pageupImageClassName, setPageupImageClassName] = useState('pageup__image__absolute');

    const pageupClassRef = useRef(pageupImageClassName);

    useEffect(() => {
        pageupClassRef.current = pageupImageClassName;
    }, [pageupImageClassName]);

    useEffect(() => {
        if (urlLang && i18n.language !== urlLang) {
            i18n.changeLanguage(urlLang);
        }
    }, [urlLang, i18n]);

    useEffect(() => {
        const normalizedTeachings = buildTeachings(teachingStore.teachings);
        if (!isEqual(normalizedTeachings, teachings)) {
            setTeachings(normalizedTeachings);
        }

        if (draftTeach?.id) {
            const match = normalizedTeachings.find((item) => item.id === draftTeach.id);
            if (match) {
                setDraftTeach({ ...match });
            }
        }
    }, [teachingStore.teachings]);

    useEffect(() => {
        if (teachingStore.seo && !isEqual(teachingStore.seo, seo)) {
            setSeo({ ...DEFAULT_SEO, ...teachingStore.seo });
        }
    }, [teachingStore.seo]);

    useEffect(() => {
        dispatch(startSetTeachingPage() as unknown as AnyAction);
    }, [dispatch]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const onScroll = () => {
            const result = handlePageScroll(pageupClassRef.current);
            if (result?.pageupImageClassName && result.pageupImageClassName !== pageupClassRef.current) {
                pageupClassRef.current = result.pageupImageClassName;
                setPageupImageClassName(result.pageupImageClassName);
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const openSeoModal = useCallback(() => setSeoModalOpen(true), []);
    const closeSeoModal = useCallback(() => setSeoModalOpen(false), []);

    const updateSeoField = useCallback((field: keyof TeachingSeo, value: string) => {
        setSeo((prev) => ({ ...prev, [field]: value }));
    }, []);

    const saveSeo = useCallback(async () => {
        await dispatch(startEditTeachingPageSeo(seo as unknown as SeoPayload) as unknown as AnyAction);
        setSeoModalOpen(false);
    }, [dispatch, seo]);

    const applyTeachingsUpdate = useCallback((nextTeachings: TeachItem[]) => {
        const ordered = sortTeachings(nextTeachings.map(normalizeTeach));
        setTeachings(ordered);
        if (ordered.length === 0) {
            setDraftTeach(null);
        }
    }, []);

    const openTeachEditor = useCallback((teach?: TeachItem) => {
        setDraftTeach(teach ? { ...teach } : { ...EMPTY_TEACH, id: '' });
        setEditModalOpen(true);
        setDraftError(null);
    }, []);

    const closeTeachEditor = useCallback(() => {
        setEditModalOpen(false);
        setDraftTeach(null);
        setDraftError(null);
    }, []);

    const updateDraftTeach = useCallback((field: keyof TeachItem, value: unknown) => {
        setDraftTeach((prev) => ({ ...(prev ?? { ...EMPTY_TEACH, id: '' }), [field]: value }));
        setDraftError(null);
    }, []);

    const saveDraftTeach = useCallback(async () => {
        if (!draftTeach) {
            return;
        }

        const normalizedDraft = normalizeTeach(draftTeach);
        const validationError = validateTeachDraft(normalizedDraft);
        if (validationError) {
            setDraftError(validationError);
            return;
        }

        if (draftTeach.id) {
            await dispatch(startUpdateTeach(draftTeach) as unknown as AnyAction);
            applyTeachingsUpdate(
                teachings.map((teach) => (teach.id === draftTeach.id ? { ...teach, ...draftTeach } : teach))
            );
        } else {
            const result = await dispatch(
                startAddTeach(draftTeach, teachings.length + 1) as unknown as AnyAction
            );
            const nextTeachings = Array.isArray(result) ? buildTeachings(result) : teachings;
            applyTeachingsUpdate(nextTeachings as TeachItem[]);
        }

        setEditModalOpen(false);
        setDraftTeach(null);
        setDraftError(null);
    }, [dispatch, draftTeach, teachings, applyTeachingsUpdate]);

    const deleteTeach = useCallback(async (id: string) => {
        const teach = teachings.find((item) => item.id === id);
        if (!teach) {
            return;
        }
        await dispatch(startDeleteTeach(teach) as unknown as AnyAction);
        applyTeachingsUpdate(teachings.filter((item) => item.id !== id));
    }, [dispatch, teachings, applyTeachingsUpdate]);

    const toggleTeachVisibility = useCallback(async (id: string, visible: boolean) => {
        const teach = teachings.find((item) => item.id === id);
        if (!teach) {
            return;
        }
        const updated = { ...teach, visible };
        await dispatch(startShowTeach(updated) as unknown as AnyAction);
        applyTeachingsUpdate(
            teachings.map((item) => (item.id === id ? updated : item))
        );
    }, [dispatch, teachings, applyTeachingsUpdate]);

    const changeTeachOrder = useCallback((id: string, nextOrder: number) => {
        const clamped = Math.min(Math.max(nextOrder, 1), teachings.length || 1);
        setTeachings((prev) => prev.map((teach) => (teach.id === id ? { ...teach, order: clamped } : teach)));
    }, [teachings.length]);

    const commitTeachOrder = useCallback(async (id: string, nextOrder: number) => {
        const clamped = Math.min(Math.max(nextOrder, 1), teachings.length || 1);
        const updated = teachings.map((teach) =>
            teach.id === id ? { ...teach, order: clamped } : teach
        );
        const sorted = sortTeachings(updated);
        const payload: Record<string, TeachItem> = {};
        sorted.forEach((teach) => {
            payload[teach.id] = teach;
        });

        await dispatch(startUpdateTeachings(payload, sorted) as unknown as AnyAction);
        applyTeachingsUpdate(sorted);
    }, [teachings, dispatch, applyTeachingsUpdate]);

    const saveTeachImage = useCallback(async (teachId: string, image: TeachImage, previousPublicId?: string) => {
        const teach = teachings.find((item) => item.id === teachId);
        if (!teach) {
            return;
        }

        const updatedTeach = { ...teach, image };
        await dispatch(startUpdateTeachImage(updatedTeach, previousPublicId) as unknown as AnyAction);
        applyTeachingsUpdate(
            teachings.map((item) => (item.id === teachId ? updatedTeach : item))
        );
    }, [dispatch, teachings, applyTeachingsUpdate]);

    const launchImageUpload = useCallback(() => {
        if (!draftTeach) {
            return;
        }
        const previousId =
            typeof draftTeach.image === 'object' && draftTeach.image !== null && 'publicId' in draftTeach.image
                ? draftTeach.image.publicId
                : draftTeach.publicId;
        const teachId = draftTeach.id;

        const widget = cloudinary.openUploadWidget(
            {
                cloud_name: 'dewafmxth',
                upload_preset: 'ml_default',
                sources: ['local', 'url', 'image_search', 'facebook', 'dropbox', 'instagram', 'camera']
            },
            async (error: Error | null, result: any) => {
                if (error) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error('Upload failed', error);
                    }
                    return;
                }

                if (result?.event === 'success') {
                    const image: TeachImage = {
                        publicId: result.info.public_id,
                        src: result.info.secure_url,
                        width: result.info.width,
                        height: result.info.height
                    };

                    setDraftTeach((prev) => (prev ? { ...prev, image } : prev));

                    if (teachId) {
                        await saveTeachImage(teachId, image, previousId);
                    }

                    widget.close();
                }
            }
        );

        widget.open();
    }, [draftTeach, saveTeachImage]);

    const logout = useCallback(() => {
        dispatch(startLogout() as unknown as AnyAction);
    }, [dispatch]);

    return useMemo(() => ({
        isAuthenticated,
        teachings,
        draftTeach,
        draftError,
        seo,
        seoModalOpen,
        editModalOpen,
        pageupImageClassName,
        openSeoModal,
        closeSeoModal,
        updateSeoField,
        saveSeo,
        openTeachEditor,
        closeTeachEditor,
        updateDraftTeach,
        saveDraftTeach,
        deleteTeach,
        toggleTeachVisibility,
        changeTeachOrder,
        commitTeachOrder,
        launchImageUpload,
        logout
    }), [
        isAuthenticated,
        teachings,
        draftTeach,
        draftError,
        seo,
        seoModalOpen,
        editModalOpen,
        pageupImageClassName,
        openSeoModal,
        closeSeoModal,
        updateSeoField,
        saveSeo,
        openTeachEditor,
        closeTeachEditor,
        updateDraftTeach,
        saveDraftTeach,
        deleteTeach,
        toggleTeachVisibility,
        changeTeachOrder,
        commitTeachOrder,
        launchImageUpload,
        logout
    ]);
};
