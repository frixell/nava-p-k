import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';
import database from '../../firebase/firebase';
import { deleteImage } from '../../services/imageService';
import type { RootState } from '../configureStore';

export interface HomepageSeo extends Record<string, string> {}

export interface TellData {
    name: string;
    position: string;
    company: number;
    createdAt: number;
    text: string;
    order: number;
}

export interface HomepageState {
    tell?: Record<string, TellData>;
    seo?: HomepageSeo;
    [key: string]: unknown;
}

type HomepageWrapper = { homepage: HomepageState };
type HomepagePayload = HomepageState | HomepageWrapper;

type HomepageCallback = (error: Error | null, data?: HomepageState) => void;

const initialState: HomepageState = {};

const ensureHomepageState = (payload?: HomepageState | null): HomepageState => ({
    ...(payload ?? {})
} as HomepageState);

const isHomepageWrapper = (payload: HomepagePayload): payload is HomepageWrapper =>
    typeof payload === 'object' && payload !== null && 'homepage' in payload;

const extractHomepage = (payload: HomepagePayload): HomepageState => {
    if (isHomepageWrapper(payload)) {
        return ensureHomepageState(payload.homepage);
    }
    return ensureHomepageState(payload);
};

const homepageSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {
        setHomepage: (_state: HomepageState, action: PayloadAction<HomepageState | null | undefined>) =>
            ensureHomepageState(action.payload ?? undefined),
        updateHomepage: (state: HomepageState, action: PayloadAction<HomepageState>) => ({
            ...state,
            ...ensureHomepageState(action.payload)
        }),
        updateHomepageSeo: (state: HomepageState, action: PayloadAction<HomepageSeo>) => ({
            ...state,
            seo: {
                ...(state.seo ?? {}),
                ...action.payload
            }
        }),
        addHomepageTell: (state: HomepageState, action: PayloadAction<{ id: string; tell: TellData }>) => ({
            ...state,
            tell: {
                ...(state.tell ?? {}),
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
        await database.ref('website').update(payload);
    } else {
        await database.ref('website/homepage').update(extractHomepage(payload));
    }
};

export const startSetHomePage = (done?: HomepageCallback) => async (dispatch: Dispatch) => {
    try {
        const snapshot = await database.ref('website/homepage').once('value');
        const value = snapshot.val() as HomepageState | null;
        const homepage = ensureHomepageState(value);
        dispatch(setHomepage(homepage));
        done?.(null, homepage);
        return homepage;
    } catch (error) {
        done?.(error as Error);
        throw error;
    }
};

export const startEditHomePage = (payload: HomepagePayload) => async (dispatch: Dispatch) => {
    const homepage = extractHomepage(payload);
    await writeHomepage(payload);
    dispatch(updateHomepage(homepage));
    return homepage;
};

export const startEditHomePageSeo = (seo: HomepageSeo) => async (dispatch: Dispatch) => {
    await database.ref('serverSeo/seo').update(seo);
    await database.ref('website/homepage/seo').update(seo);
    dispatch(updateHomepageSeo(seo));
    return seo;
};

export const startAddHomePageTell = (
    _homepage: HomepageState = {},
    tellData: Partial<TellData> = {}
) => async (dispatch: Dispatch, getState: () => RootState) => {
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
    const currentHomepage = ensureHomepageState(state.homepage as HomepageState);
    const mergedHomepage: HomepageState = {
        ...currentHomepage,
        tell: {
            ...(currentHomepage?.tell ?? {}),
            [id]: tell
        }
    };

    return mergedHomepage;
};

export const startDeleteHomePageImage = (
    payload: HomepagePayload,
    publicid: string
) => async (dispatch: Dispatch) => {
    if (publicid) {
        await deleteImage(publicid);
    }
    const homepage = extractHomepage(payload);
    await writeHomepage(payload);
    dispatch(updateHomepage(homepage));
};

export default homepageSlice.reducer;
