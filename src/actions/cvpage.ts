import type { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import database from '../firebase/firebase';

type RootState = any;
type CvThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

type CvPagePayload = Record<string, unknown> | null;
type CvSeoPayload = Record<string, unknown> | { title: string; description: string; keyWords: string } | any;

type CvImage = {
  id?: string;
  publicId?: string;
  src?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  order?: number;
};

export const editCvPage = (cvpage: CvPagePayload) => ({
  type: 'EDIT_CVPAGE' as const,
  cvpage
});

export const startEditCvPage = (
  fbCvpage: Record<string, unknown>,
  cvpage: CvPagePayload
): CvThunk<Promise<void>> => {
  return async (dispatch) => {
    await database.ref('website/cvpage').update({ ...fbCvpage });
    dispatch(editCvPage(cvpage));
  };
};

export const editCvPageSeo = (seo: CvSeoPayload) => ({
  type: 'EDIT_CVPAGE_SEO' as const,
  seo
});

export const startEditCvPageSeo = (seo: CvSeoPayload): CvThunk<Promise<void>> => {
  return async (dispatch) => {
    await database.ref('serverSeo/cv/seo').update(seo);
    await database.ref('website/cvpage/seo').update(seo);
    dispatch(editCvPageSeo(seo));
  };
};

export const setCvPage = (cvpage: CvPagePayload) => ({
  type: 'SET_CVPAGE' as const,
  cvpage
});

export const startSetCvPage = (): CvThunk<Promise<void>> => {
  return async (dispatch) => {
    const snapshot = await database.ref('website/cvpage/').once('value');
    const cvpage = snapshot.val() ?? null;
    dispatch(setCvPage(cvpage));
  };
};

export const addCvImage = (images: CvImage[]) => ({
  type: 'ADD_CV_IMAGE' as const,
  images
});

export const startAddCvImage = (
  imageData: Partial<CvImage> = {},
  order: number
): CvThunk<Promise<CvImage[]>> => {
  return async (dispatch, getState) => {
    const {
      publicId = '',
      src = '',
      width = '',
      height = '',
      alt = ''
    } = imageData;

    const image: CvImage = {
      publicId,
      src,
      width,
      height,
      alt,
      order
    };

    const ref = await database.ref('website/cvpage/cvimages').push(image);

    const localImage: CvImage = {
      id: ref.key ?? undefined,
      ...image
    };

    const state = getState();
    const existingImages: Record<string, CvImage> = state?.cvpage?.cvimages ?? {};
    const nextImages: Record<string, CvImage> = {
      ...existingImages,
      [ref.key as string]: localImage
    };

    const images: CvImage[] = Object.keys(nextImages).map((key) => ({
      id: key,
      ...nextImages[key]
    }));

    dispatch(addCvImage(images));
    return images;
  };
};

export const deleteCvImage = (images: CvImage[]) => ({
  type: 'DELETE_CV_IMAGE' as const,
  images
});

export const startDeleteCvImage = (
  fbImages: Record<string, unknown>,
  images: CvImage[],
  publicid: string
): CvThunk<Promise<void>> => {
  return async (dispatch) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/deleteImage');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(`publicid=${publicid}`);

    await database.ref().child('website/cvpage/cvimages').update(fbImages);
    dispatch(deleteCvImage(images));
  };
};
