import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import database from '../../firebase/firebase';
import type { SeoPayload } from '../../types/seo';
import type { ImageAsset } from '../../types/content';
import { deleteImage } from '../../services/imageService';
import type { AppDispatch, AppThunk } from '../configureStore';

export type AboutSeo = SeoPayload;

export interface AboutPageState {
    slogen: string;
    slogenHebrew: string;
    about: unknown;
    aboutHebrew?: unknown;
    content: string;
    contentHebrew: string;
    image: ImageAsset | null;
    seo: AboutSeo | null;
    [key: string]: unknown;
}

const initialState: AboutPageState = {
    slogen: '',
    slogenHebrew: '',
    about: '',
    aboutHebrew: undefined,
    content: '',
    contentHebrew: '',
    image: null,
    seo: null
};

const toImageAsset = (image: unknown): ImageAsset | null => {
    if (typeof image !== 'object' || image === null) {
        return null;
    }
    return { ...(image as ImageAsset) };
};

const toSeo = (seo: unknown): AboutSeo | null => {
    if (typeof seo !== 'object' || seo === null) {
        return null;
    }
    const { title = '', description = '', keyWords = '' } = seo as Partial<AboutSeo>;
    return {
        title: typeof title === 'string' ? title : '',
        description: typeof description === 'string' ? description : '',
        keyWords: typeof keyWords === 'string' ? keyWords : ''
    };
};

const ensureAboutPageState = (
    payload?: Partial<AboutPageState> | null,
    fallback: AboutPageState = initialState
): AboutPageState => ({
    ...fallback,
    ...(payload ?? {}),
    image: toImageAsset(payload?.image ?? fallback.image),
    seo: toSeo(payload?.seo ?? fallback.seo)
});

const aboutSlice = createSlice({
    name: 'aboutpage',
    initialState,
    reducers: {
        setAboutPage: (
            _state: AboutPageState,
            action: PayloadAction<Partial<AboutPageState> | null>
        ) => ensureAboutPageState(action.payload),
        updateAboutPage: (state: AboutPageState, action: PayloadAction<Partial<AboutPageState>>) =>
            ensureAboutPageState(action.payload, state),
        updateAboutSeo: (state: AboutPageState, action: PayloadAction<AboutSeo>) => {
            state.seo = { ...action.payload };
        },
        saveAboutImage: (state: AboutPageState, action: PayloadAction<ImageAsset>) => {
            state.image = { ...action.payload };
        }
    }
});

export const {
    setAboutPage,
    updateAboutPage,
    updateAboutSeo,
    saveAboutImage
} = aboutSlice.actions;

export const startSetAboutPage = (): AppThunk<Promise<AboutPageState>> => async (
    dispatch: AppDispatch
) => {
    const snapshot = await database.ref('website/aboutpage/').once('value');
    const value = snapshot.val() as Partial<AboutPageState> | null;
    const aboutpage = ensureAboutPageState(value);
    dispatch(setAboutPage(aboutpage));
    return aboutpage;
};

export const startEditAboutPage = (
    fbAboutpage: Record<string, unknown>,
    aboutpage: Partial<AboutPageState>
): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    await database.ref('website/aboutpage').update({ ...fbAboutpage });
    dispatch(updateAboutPage(aboutpage));
};

export const startEditAboutPageSeo = (seo: AboutSeo): AppThunk<Promise<AboutSeo>> => async (
    dispatch: AppDispatch
) => {
    await database.ref('serverSeo/about/seo').update(seo);
    await database.ref('website/aboutpage/seo').update(seo);
    dispatch(updateAboutSeo(seo));
    return seo;
};

export const startSaveAboutImage = (
    imageData: Partial<ImageAsset> = {},
    publicIdToDelete?: string
): AppThunk<Promise<ImageAsset>> => async (dispatch: AppDispatch) => {
    const {
        publicId = '',
        src = '',
        width = '',
        height = '',
        alt = ''
    } = imageData;

    const image: ImageAsset = {
        publicId,
        src,
        width,
        height,
        alt,
        order: 0
    };

    if (publicIdToDelete) {
        await deleteImage(publicIdToDelete);
    }

    await database.ref('website/aboutpage/image').update(image);
    dispatch(saveAboutImage(image));
    return image;
};

export const createEmptyAboutPage = (): AboutPageState => ensureAboutPageState(null);

export { initialState as initialAboutPageState, ensureAboutPageState };

export default aboutSlice.reducer;
