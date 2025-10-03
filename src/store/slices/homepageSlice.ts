import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import database from '../../firebase/firebase';
import { deleteImage } from '../../services/imageService';
import type { AppDispatch, AppThunk, RootState } from '../configureStore';

export type HomepageSeo = Record<string, string>;

export interface TellData {
    name: string;
    position: string;
    company: number;
    createdAt: number;
    text: string;
    order: number;
}

export interface HomepageState {
    tell: Record<string, TellData>;
    seo: HomepageSeo | null;
    [key: string]: unknown;
}

type HomepageWrapper = { homepage: Partial<HomepageState> };
type HomepagePayload = Partial<HomepageState> | HomepageWrapper;

type HomepageCallback = (error: Error | null, data?: HomepageState) => void;

const initialState: HomepageState = {
    tell: {},
    seo: null
};

const ensureHomepageState = (
    payload?: Partial<HomepageState> | null,
    fallback: HomepageState = initialState
): HomepageState => ({
    ...fallback,
    ...(payload ?? {}),
    tell: { ...(payload?.tell ?? fallback.tell) },
    seo: payload?.seo ?? fallback.seo
});

const isHomepageWrapper = (payload: HomepagePayload): payload is HomepageWrapper =>
    typeof payload === 'object' && payload !== null && 'homepage' in payload;

const extractHomepage = (payload: HomepagePayload): HomepageState => {
    if (isHomepageWrapper(payload)) {
        return ensureHomepageState(payload.homepage, initialState);
    }
    return ensureHomepageState(payload, initialState);
};

const homepageSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {
        setHomepage: (
            _state: HomepageState,
            action: PayloadAction<Partial<HomepageState> | null | undefined>
        ) => ensureHomepageState(action.payload ?? null),
        updateHomepage: (state: HomepageState, action: PayloadAction<Partial<HomepageState>>) => ({
            ...state,
            ...ensureHomepageState(action.payload, state)
        }),
        updateHomepageSeo: (state: HomepageState, action: PayloadAction<HomepageSeo>) => {
            const nextSeo: HomepageSeo = {
                ...(state.seo ?? {}),
                ...action.payload
            };
            return {
                ...state,
                seo: nextSeo
            };
        },
        addHomepageTell: (state: HomepageState, action: PayloadAction<{ id: string; tell: TellData }>) => ({
            ...state,
            tell: {
                ...state.tell,
                [action.payload.id]: action.payload.tell
            }
        })
    }
});

export const {
    setHomepage,
    updateHomepage,
    updateHomepageSeo,
    addHomepageTell
} = homepageSlice.actions;

const writeHomepage = async (payload: HomepagePayload) => {
    if (isHomepageWrapper(payload)) {
        await database.ref('website').update({ homepage: extractHomepage(payload) });
        return;
    }
    await database.ref('website/homepage').update(extractHomepage(payload));
};

export const startSetHomePage = (
    done?: HomepageCallback
): AppThunk<Promise<HomepageState>> => async (dispatch: AppDispatch) => {
    try {
        const snapshot = await database.ref('website/homepage').once('value');
        const value = snapshot.val() as Partial<HomepageState> | null;
        const homepage = ensureHomepageState(value);
        dispatch(setHomepage(homepage));
        done?.(null, homepage);
        return homepage;
    } catch (error) {
        done?.(error as Error);
        throw error;
    }
};

export const startEditHomePage = (
    payload: HomepagePayload
): AppThunk<Promise<HomepageState>> => async (dispatch: AppDispatch) => {
    const homepage = extractHomepage(payload);
    await writeHomepage(payload);
    dispatch(updateHomepage(homepage));
    return homepage;
};

export const startEditHomePageSeo = (seo: HomepageSeo): AppThunk<Promise<HomepageSeo>> => async (
    dispatch: AppDispatch
) => {
    await database.ref('serverSeo/seo').update(seo);
    await database.ref('website/homepage/seo').update(seo);
    dispatch(updateHomepageSeo(seo));
    return seo;
};

export const startAddHomePageTell = (
    _homepage: Partial<HomepageState> = {},
    tellData: Partial<TellData> = {}
): AppThunk<Promise<HomepageState>> => async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
        name = '',
        position = '',
        company = 0,
        createdAt = 0,
        text = '',
        order = 0
    } = tellData;

    const tell: TellData = { company, createdAt, name, position, text, order };

    const ref = await database.ref('website/homepage/tell').push(tell);
    const id = ref.key;
    if (!id) {
        throw new Error('Failed to create tell entry');
    }

    dispatch(addHomepageTell({ id, tell }));

    const state = getState();
    const currentHomepage = state.homepage;
    const mergedHomepage: HomepageState = {
        ...currentHomepage,
        tell: {
            ...currentHomepage.tell,
            [id]: tell
        }
    };

    return mergedHomepage;
};

export const startDeleteHomePageImage = (
    payload: HomepagePayload,
    publicid: string
): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    if (publicid) {
        await deleteImage(publicid);
    }
    const homepage = extractHomepage(payload);
    await writeHomepage(payload);
    dispatch(updateHomepage(homepage));
};

export default homepageSlice.reducer;
