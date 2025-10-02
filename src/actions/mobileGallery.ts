import firebase from 'firebase/app';
import 'firebase/database';
import type { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import type { RootState } from '../types/store';
import type { ImageAsset } from '../types/content';

type GalleryThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

type MobileGalleryImage = ImageAsset;

export const editMobileGallery = (mobileImages: MobileGalleryImage[]) => ({
  type: 'SET_MOBILE_GALLERY' as const,
  mobileImages
});

export const setMobileGallery = (mobileImages: MobileGalleryImage[]) => ({
  type: 'SET_MOBILE_GALLERY' as const,
  mobileImages
});

export const startAddMobileGallery = (mobileImage: MobileGalleryImage): GalleryThunk<Promise<void>> => {
  return async () => {
    await firebase.database().ref('website/mobileGallery').push(mobileImage);
  };
};

export const startEditMobileGallery = (
  mobileImages: MobileGalleryImage[],
  fbMobileImages: Record<string, unknown>
): GalleryThunk<Promise<void>> => {
  return async (dispatch) => {
    await firebase.database().ref('website/mobileGallery').update({ ...fbMobileImages });
    dispatch(editMobileGallery(mobileImages));
  };
};

export const startSetMobileGallery = (): GalleryThunk<Promise<MobileGalleryImage[]>> => {
  return async (dispatch) => {
    const snapshot = await firebase.database().ref('website/mobileGallery/').once('value');
    const mobileImages: MobileGalleryImage[] = [];

    snapshot.forEach((childSnapshot) => {
      mobileImages.push({
        id: childSnapshot.key ?? undefined,
        ...childSnapshot.val()
      });
    });

    mobileImages.sort((a, b) => (Number(a.order ?? 0) > Number(b.order ?? 0) ? 1 : -1));
    dispatch(setMobileGallery(mobileImages));
    return mobileImages;
  };
};

export const startDeleteMobileGallery = (
  fbMobileImages: Record<string, unknown>,
  mobileImages: MobileGalleryImage[],
  publicid: string
): GalleryThunk<Promise<void>> => {
  return async (dispatch) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/deleteImage');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(`publicid=${publicid}`);

    await firebase.database().ref('website/mobileGallery').update(fbMobileImages);
    dispatch(setMobileGallery(mobileImages));
  };
};
