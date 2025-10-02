import type { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import database from '../firebase/firebase';

type RootState = any;
type TeachingThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

type TeachEntity = Record<string, any>;
type TeachCollection = Record<string, TeachEntity> | TeachEntity[] | null | undefined;

type TeachingPageSnapshot = {
  teachings?: TeachCollection;
  seo?: any;
} | null;

const normalizeTeachings = (source: TeachCollection): TeachEntity[] => {
  if (!source) {
    return [];
  }

  if (Array.isArray(source)) {
    return source.map((teach) => ({ ...teach }));
  }

  return Object.keys(source).map((key) => ({ id: key, ...source[key] }));
};

export const editTeachingPageSeo = (seo: any) => ({
  type: 'EDIT_TEACHINGPAGE_SEO' as const,
  seo
});

export const startEditTeachingPageSeo = (seo: any): TeachingThunk<Promise<void>> => {
  return async (dispatch) => {
    await database.ref('serverSeo/teaching/seo').update(seo);
    await database.ref('website/teachingpage/seo').update(seo);
    dispatch(editTeachingPageSeo(seo));
  };
};

export const setTeachingPage = (teachings: TeachEntity[], seo?: any) => ({
  type: 'SET_TEACHINGPAGE' as const,
  teachings,
  seo
});

export const startSetTeachingPage = (): TeachingThunk<Promise<void>> => {
  return async (dispatch) => {
    const snapshot = await database.ref('website/teachingpage').once('value');
    const teachingpage: TeachingPageSnapshot = snapshot.val();
    const teachingsArray = normalizeTeachings(teachingpage?.teachings);
    dispatch(setTeachingPage(teachingsArray, teachingpage?.seo));
  };
};

export const updateTeachings = (teachings: TeachEntity[]) => ({
  type: 'UPDATE_TEACHINGS' as const,
  teachings
});

export const startUpdateTeachings = (
  fbTeachings: Record<string, unknown>,
  teachings: TeachEntity[]
): TeachingThunk<Promise<TeachEntity[]>> => {
  return async (dispatch) => {
    await database.ref('website/teachingpage/teachings').update(fbTeachings);
    dispatch(updateTeachings(teachings));
    return teachings;
  };
};

export const addTeach = (teach: TeachEntity) => ({
  type: 'ADD_TEACH' as const,
  teach
});

export const startAddTeach = (
  teachData: TeachEntity = {},
  order: number
): TeachingThunk<Promise<TeachEntity[]>> => {
  return async (dispatch, getState) => {
    const teach = {
      publicId: '',
      image: '',
      details: '',
      description: '',
      detailsHebrew: '',
      descriptionHebrew: '',
      ...teachData,
      order
    };

    const ref = await database.ref('website/teachingpage/teachings').push(teach);
    const localTeach: TeachEntity = {
      ...teach,
      id: ref.key
    };

    const state = getState();
    const existingStore: TeachCollection = state?.teachingpage?.teachings;
    const nextTeachings = normalizeTeachings(existingStore);
    nextTeachings.push(localTeach);

    dispatch(addTeach(localTeach));
    return nextTeachings;
  };
};

export const updateTeach = (teach: TeachEntity) => ({
  type: 'UPDATE_TEACH' as const,
  teach
});

export const startUpdateTeach = (teachData: TeachEntity = {}): TeachingThunk<Promise<string>> => {
  return async (dispatch) => {
    const {
      id = '',
      publicId = '',
      image = '',
      details = '',
      description = '',
      detailsHebrew = '',
      descriptionHebrew = '',
      order
    } = teachData;

    const teach: TeachEntity = {
      id,
      publicId,
      image,
      details,
      description,
      detailsHebrew,
      descriptionHebrew,
      order
    };

    await database.ref(`website/teachingpage/teachings/${id}`).update(teach);
    dispatch(updateTeach(teach));
    return id;
  };
};

export const updateTeachImage = (teach: TeachEntity) => ({
  type: 'UPDATE_TEACH' as const,
  teach
});

export const startUpdateTeachImage = (
  teachData: TeachEntity = {},
  publicid?: string
): TeachingThunk<Promise<string>> => {
  return async (dispatch) => {
    const {
      id = '',
      publicId = '',
      image = '',
      details = '',
      description = '',
      detailsHebrew = '',
      descriptionHebrew = '',
      order
    } = teachData;

    const teach: TeachEntity = {
      id,
      publicId,
      image,
      details,
      description,
      detailsHebrew,
      descriptionHebrew,
      order
    };

    if (publicid) {
      await fetch('/deleteImage', {
        method: 'POST',
        body: `publicid=${publicid}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }

    await database.ref(`website/teachingpage/teachings/${id}`).update(teach);
    dispatch(updateTeachImage(teach));
    return id;
  };
};

export const showTeach = (teach: TeachEntity) => ({
  type: 'UPDATE_TEACH' as const,
  teach
});

export const startShowTeach = (teach: TeachEntity): TeachingThunk<Promise<void>> => {
  return async (dispatch) => {
    await database.ref(`website/teachingpage/teachings/${teach.id}`).update(teach);
    dispatch(showTeach(teach));
  };
};

export const deleteTeach = (teach: TeachEntity) => ({
  type: 'DELETE_TEACH' as const,
  teach
});

export const startDeleteTeach = (teachData: TeachEntity = {}): TeachingThunk<Promise<string>> => {
  return async (dispatch) => {
    const {
      id = '',
      publicId = '',
      image = '',
      details = '',
      description = '',
      detailsHebrew = '',
      descriptionHebrew = '',
      order
    } = teachData;

    const teach: TeachEntity = {
      id,
      publicId,
      image,
      details,
      description,
      detailsHebrew,
      descriptionHebrew,
      order
    };

    const imagePublicId =
      (image && typeof image === 'object' && 'publicId' in image ? image.publicId : undefined) ?? publicId;

    if (imagePublicId) {
      await fetch('/deleteImage', {
        method: 'POST',
        body: `publicid=${String(imagePublicId)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }

    await database.ref(`website/teachingpage/teachings/${id}`).remove();
    dispatch(deleteTeach(teach));
    return id;
  };
};
