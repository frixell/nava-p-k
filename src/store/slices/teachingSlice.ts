import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import database from '../../firebase/firebase';
import { deleteImage } from '../../services/imageService';
import type { TeachItem, TeachingSeo } from '../../containers/teaching/types';
import type { SeoPayload } from '../../types/seo';
import type { AppDispatch, AppThunk, RootState } from '../configureStore';

export type TeachingsMap = Record<string, TeachItem>;
export type TeachCollection = TeachingsMap | TeachItem[] | null | undefined;

interface TeachingPageState {
    teachings: TeachItem[];
    seo: TeachingSeo;
}

interface TeachingPagePayload {
    teachings: TeachItem[];
    seo?: SeoPayload | TeachingSeo | null;
}

type SnapshotValue = {
    teachings?: TeachCollection;
    seo?: SeoPayload | TeachingSeo;
} | null;

const defaultSeo: TeachingSeo = { title: '', description: '', keyWords: '' };

const normalizeTeach = (teach: Partial<TeachItem>, fallbackId: string): TeachItem => ({
    id: teach.id ?? fallbackId,
    publicId: teach.publicId,
    image: teach.image ?? null,
    details: teach.details ?? '',
    description: teach.description ?? '',
    detailsHebrew: teach.detailsHebrew ?? '',
    descriptionHebrew: teach.descriptionHebrew ?? '',
    order: typeof teach.order === 'number' ? teach.order : undefined,
    visible: teach.visible,
    ...teach
});

const normalizeTeachings = (source: TeachCollection): TeachItem[] => {
    if (!source) {
        return [];
    }

    if (Array.isArray(source)) {
        return source.map((item, index) => normalizeTeach(item, item.id ?? String(index)));
    }

    return Object.keys(source).map((key) => normalizeTeach(source[key], key));
};

const mergeSeo = (seo?: SeoPayload | TeachingSeo | null): TeachingSeo => ({
    ...defaultSeo,
    ...(seo ?? {})
});

const initialState: TeachingPageState = {
    teachings: [],
    seo: defaultSeo
};

const teachingSlice = createSlice({
    name: 'teachingpage',
    initialState,
    reducers: {
        setTeachingPage: (_state: TeachingPageState, action: PayloadAction<TeachingPagePayload>) => ({
            teachings: action.payload.teachings,
            seo: mergeSeo(action.payload.seo)
        }),
        setTeachingSeo: (state: TeachingPageState, action: PayloadAction<SeoPayload | TeachingSeo>) => {
            state.seo = mergeSeo(action.payload);
        },
        replaceTeachings: (state: TeachingPageState, action: PayloadAction<TeachItem[]>) => {
            state.teachings = action.payload;
        },
        addTeach: (state: TeachingPageState, action: PayloadAction<TeachItem>) => {
            state.teachings.push(action.payload);
        },
        updateTeach: (state: TeachingPageState, action: PayloadAction<TeachItem>) => {
            const index = state.teachings.findIndex((teach) => teach.id === action.payload.id);
            if (index >= 0) {
                state.teachings[index] = {
                    ...state.teachings[index],
                    ...action.payload
                };
            } else {
                state.teachings.push(action.payload);
            }
        },
        removeTeach: (state: TeachingPageState, action: PayloadAction<string>) => {
            state.teachings = state.teachings.filter((teach) => teach.id !== action.payload);
        }
    }
});

export const {
    setTeachingPage,
    setTeachingSeo,
    replaceTeachings,
    addTeach,
    updateTeach,
    removeTeach
} = teachingSlice.actions;

export const startSetTeachingPage = (): AppThunk<Promise<TeachItem[]>> => async (
    dispatch: AppDispatch
) => {
    const snapshot = await database.ref('website/teachingpage').once('value');
    const value = snapshot.val() as SnapshotValue;
    const teachingsArray = normalizeTeachings(value?.teachings ?? null);
    dispatch(setTeachingPage({ teachings: teachingsArray, seo: value?.seo }));
    return teachingsArray;
};

export const startEditTeachingPageSeo = (seo: SeoPayload): AppThunk<Promise<void>> => async (
    dispatch
) => {
    await database.ref('serverSeo/teaching/seo').update(seo);
    await database.ref('website/teachingpage/seo').update(seo);
    dispatch(setTeachingSeo(seo));
};

export const startUpdateTeachings = (
    fbTeachings: TeachingsMap,
    teachings: TeachItem[]
): AppThunk<Promise<TeachItem[]>> => async (dispatch: AppDispatch) => {
    await database.ref('website/teachingpage/teachings').update(fbTeachings);
    dispatch(replaceTeachings(teachings));
    return teachings;
};

export const startAddTeach = (
    teachData: Partial<TeachItem> = {},
    order: number
): AppThunk<Promise<TeachItem[]>> => async (
    dispatch: AppDispatch,
    getState: () => RootState
) => {
    const firebaseTeach = {
        publicId: teachData.publicId ?? '',
        image: teachData.image ?? '',
        details: teachData.details ?? '',
        description: teachData.description ?? '',
        detailsHebrew: teachData.detailsHebrew ?? '',
        descriptionHebrew: teachData.descriptionHebrew ?? '',
        order
    };

    const ref = await database.ref('website/teachingpage/teachings').push(firebaseTeach);
    const teachId = ref.key ?? '';
    const localTeach = normalizeTeach({ ...firebaseTeach, id: teachId }, teachId);

    dispatch(addTeach(localTeach));

    const state = getState();
    const nextTeachings = state.teachingpage?.teachings ?? [];
    return nextTeachings.map((teach: TeachItem) => ({ ...teach }));
};

export const startUpdateTeach = (
    teachData: Partial<TeachItem> = {}
): AppThunk<Promise<string>> => async (dispatch: AppDispatch) => {
    const id = teachData.id ?? '';
    const teach = normalizeTeach(teachData, id);

    await database.ref(`website/teachingpage/teachings/${id}`).update(teach);
    dispatch(updateTeach(teach));
    return id;
};

export const startUpdateTeachImage = (
    teachData: Partial<TeachItem> = {},
    publicid?: string
): AppThunk<Promise<string>> => async (dispatch: AppDispatch) => {
    const id = teachData.id ?? '';
    const teach = normalizeTeach(teachData, id);

    if (publicid) {
        await deleteImage(publicid);
    }

    await database.ref(`website/teachingpage/teachings/${id}`).update(teach);
    dispatch(updateTeach(teach));
    return id;
};

export const startShowTeach = (
    teach: TeachItem
): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    await database.ref(`website/teachingpage/teachings/${teach.id}`).update(teach);
    dispatch(updateTeach(teach));
};

export const startDeleteTeach = (
    teachData: Partial<TeachItem> = {}
): AppThunk<Promise<string>> => async (dispatch: AppDispatch) => {
    const id = teachData.id ?? '';
    const teach = normalizeTeach(teachData, id);

    const imagePublicId =
        (teach.image && typeof teach.image === 'object' && 'publicId' in teach.image
            ? (teach.image as { publicId?: string }).publicId
            : undefined) ?? teach.publicId;

    if (imagePublicId) {
        await deleteImage(String(imagePublicId));
    }

    await database.ref(`website/teachingpage/teachings/${id}`).remove();
    dispatch(removeTeach(id));
    return id;
};

export default teachingSlice.reducer;
