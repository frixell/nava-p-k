import type { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import database from '../firebase/firebase';

type RootState = any;

type AboutThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export type AboutPagePayload = Record<string, unknown> | null;

export const editAboutPage = (aboutpage: AboutPagePayload) => ({
  type: 'EDIT_ABOUTPAGE' as const,
  aboutpage
});

export const startEditAboutPage = (
  fbAboutpage: Record<string, unknown>,
  aboutpage: AboutPagePayload
): AboutThunk<Promise<void>> => {
  return async (dispatch) => {
    await database.ref('website/aboutpage').update({ ...fbAboutpage });
    dispatch(editAboutPage(aboutpage));
  };
};

export const editAboutPageSeo = (seo: any) => ({
  type: 'EDIT_ABOUTPAGE_SEO' as const,
  seo
});

export const startEditAboutPageSeo = (seo: any): AboutThunk<Promise<void>> => {
  return async (dispatch) => {
    await database.ref('serverSeo/about/seo').update(seo);
    await database.ref('website/aboutpage/seo').update(seo);
    dispatch(editAboutPageSeo(seo));
  };
};

export const setAboutPage = (aboutpage: AboutPagePayload) => ({
  type: 'SET_ABOUTPAGE' as const,
  aboutpage
});

export const startSetAboutPage = (): AboutThunk<Promise<AboutPagePayload>> => {
  return async (dispatch) => {
    const snapshot = await database.ref('website/aboutpage/').once('value');
    const aboutpage = snapshot.val() ?? null;
    dispatch(setAboutPage(aboutpage));
    return aboutpage;
  };
};

type AboutImage = {
  publicId?: string;
  src?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  order?: number;
};

export const saveAboutImage = (image: AboutImage) => ({
  type: 'SAVE_ABOUT_IMAGE' as const,
  image
});

export const startSaveAboutImage = (
  imageData: Partial<AboutImage> = {},
  publicIdToDelete?: string
): AboutThunk<Promise<AboutImage>> => {
  return async (dispatch) => {
    const {
      publicId = '',
      src = '',
      width = '',
      height = '',
      alt = ''
    } = imageData;

    const image: AboutImage = {
      publicId,
      src,
      width,
      height,
      alt,
      order: 0
    };

    if (publicIdToDelete) {
      await fetch('/deleteImage', {
        method: 'POST',
        body: `publicid=${publicIdToDelete}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }

    await database.ref('website/aboutpage/image').update(image);
    dispatch(saveAboutImage(image));
    return image;
  };
};

export const deleteAboutImage = (images: Record<string, unknown>) => ({
  type: 'DELETE_ABOUT_IMAGE' as const,
  images
});

export const startDeleteAboutImage = (
  fbImages: Record<string, unknown>,
  images: Record<string, unknown>,
  publicid: string
): AboutThunk<Promise<void>> => {
  return async (dispatch) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/deleteImage');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(`publicid=${publicid}`);

    await database.ref().child('website/aboutpage/aboutimages').update(fbImages);
    dispatch(deleteAboutImage(images));
  };
};
