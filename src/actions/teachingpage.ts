import type { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import database from '../firebase/firebase';
import { deleteImage } from '../services/imageService';
import type { TeachItem } from '../containers/teaching/types';
import type { RootState } from '../types/store';
import type { SeoPayload } from '../types/seo';

export type TeachingsMap = Record<string, TeachItem>;
export type TeachCollection = TeachingsMap | TeachItem[] | null | undefined;

type TeachingThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

type SnapshotValue = {
  teachings?: TeachCollection;
  seo?: SeoPayload;
} | null;

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

export const editTeachingPageSeo = (seo: SeoPayload) => ({
  type: 'EDIT_TEACHINGPAGE_SEO' as const,
  seo
});

export const startEditTeachingPageSeo = (seo: SeoPayload): TeachingThunk<Promise<void>> => {
  return async (dispatch) => {
    await database.ref('serverSeo/teaching/seo').update(seo);
    await database.ref('website/teachingpage/seo').update(seo);
    dispatch(editTeachingPageSeo(seo));
  };
};

export const setTeachingPage = (teachings: TeachItem[], seo?: SeoPayload) => ({
  type: 'SET_TEACHINGPAGE' as const,
  teachings,
  seo
});

export const startSetTeachingPage = (): TeachingThunk<Promise<void>> => {
  return async (dispatch) => {
    const snapshot = await database.ref('website/teachingpage').once('value');
    const value: SnapshotValue = snapshot.val();
    const teachingsArray = normalizeTeachings(value?.teachings ?? null);
    dispatch(setTeachingPage(teachingsArray, value?.seo));
  };
};

export const updateTeachings = (teachings: TeachItem[]) => ({
  type: 'UPDATE_TEACHINGS' as const,
  teachings
});

export const startUpdateTeachings = (
  fbTeachings: TeachingsMap,
  teachings: TeachItem[]
): TeachingThunk<Promise<TeachItem[]>> => {
  return async (dispatch) => {
    await database.ref('website/teachingpage/teachings').update(fbTeachings);
    dispatch(updateTeachings(teachings));
    return teachings;
  };
};

export const addTeach = (teach: TeachItem) => ({
  type: 'ADD_TEACH' as const,
  teach
});

export const startAddTeach = (
  teachData: Partial<TeachItem> = {},
  order: number
): TeachingThunk<Promise<TeachItem[]>> => {
  return async (dispatch, getState) => {
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
    const localTeach = normalizeTeach({ ...firebaseTeach, id: ref.key ?? '' }, ref.key ?? '');

    const state = getState() as RootState & { teachingpage?: { teachings?: TeachCollection } };
    const existingTeachings = normalizeTeachings(state.teachingpage?.teachings ?? null);
    const nextTeachings = [...existingTeachings, localTeach];

    dispatch(addTeach(localTeach));
    return nextTeachings;
  };
};

export const updateTeach = (teach: TeachItem) => ({
  type: 'UPDATE_TEACH' as const,
  teach
});

export const startUpdateTeach = (teachData: Partial<TeachItem> = {}): TeachingThunk<Promise<string>> => {
  return async (dispatch) => {
    const id = teachData.id ?? '';
    const teach = normalizeTeach(teachData, id);

    await database.ref(`website/teachingpage/teachings/${id}`).update(teach);
    dispatch(updateTeach(teach));
    return id;
  };
};

export const updateTeachImage = (teach: TeachItem) => ({
  type: 'UPDATE_TEACH' as const,
  teach
});

export const startUpdateTeachImage = (
  teachData: Partial<TeachItem> = {},
  publicid?: string
): TeachingThunk<Promise<string>> => {
  return async (dispatch) => {
    const id = teachData.id ?? '';
    const teach = normalizeTeach(teachData, id);

    if (publicid) {
      await deleteImage(publicid);
    }

    await database.ref(`website/teachingpage/teachings/${id}`).update(teach);
    dispatch(updateTeachImage(teach));
    return id;
  };
};

export const showTeach = (teach: TeachItem) => ({
  type: 'UPDATE_TEACH' as const,
  teach
});

export const startShowTeach = (teach: TeachItem): TeachingThunk<Promise<void>> => {
  return async (dispatch) => {
    await database.ref(`website/teachingpage/teachings/${teach.id}`).update(teach);
    dispatch(showTeach(teach));
  };
};

export const deleteTeach = (teach: TeachItem) => ({
  type: 'DELETE_TEACH' as const,
  teach
});

export const startDeleteTeach = (teachData: Partial<TeachItem> = {}): TeachingThunk<Promise<string>> => {
  return async (dispatch) => {
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
    dispatch(deleteTeach(teach));
    return id;
  };
};
