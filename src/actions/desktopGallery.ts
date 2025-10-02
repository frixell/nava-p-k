import firebase from 'firebase/app';
import 'firebase/database';
import type { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

type RootState = any;
type GalleryThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

type DesktopGalleryImage = {
  id?: string;
  publicId?: string;
  src?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
  order?: number;
};

export const editDesktopGallery = (desktopImages: DesktopGalleryImage[]) => ({
  type: 'SET_DESKTOP_GALLERY' as const,
  desktopImages
});

export const setDesktopGallery = (desktopImages: DesktopGalleryImage[]) => ({
  type: 'SET_DESKTOP_GALLERY' as const,
  desktopImages
});

export const startAddDesktopGallery = (desktopImage: DesktopGalleryImage): GalleryThunk<Promise<void>> => {
  return async () => {
    await firebase.database().ref('website/desktopGallery').push(desktopImage);
  };
};

export const startEditDesktopGallery = (
  desktopImages: DesktopGalleryImage[],
  fbDesktopImages: Record<string, unknown>
): GalleryThunk<Promise<void>> => {
  return async (dispatch) => {
    await firebase.database().ref('website/desktopGallery').update({ ...fbDesktopImages });
    dispatch(editDesktopGallery(desktopImages));
  };
};

export const startSetDesktopGallery = (): GalleryThunk<Promise<DesktopGalleryImage[]>> => {
  return async (dispatch) => {
    const snapshot = await firebase.database().ref('website/desktopGallery/').once('value');
    const desktopImages: DesktopGalleryImage[] = [];

    snapshot.forEach((childSnapshot) => {
      desktopImages.push({
        id: childSnapshot.key ?? undefined,
        ...childSnapshot.val()
      });
    });

    desktopImages.sort((a, b) => (Number(a.order ?? 0) > Number(b.order ?? 0) ? 1 : -1));
    dispatch(setDesktopGallery(desktopImages));
    return desktopImages;
  };
};

export const startDeleteDesktopGallery = (
  fbDesktopImages: Record<string, unknown>,
  desktopImages: DesktopGalleryImage[],
  publicid: string
): GalleryThunk<Promise<void>> => {
  return async (dispatch) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/deleteImage');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(`publicid=${publicid}`);

    await firebase.database().ref('website/desktopGallery').update(fbDesktopImages);
    dispatch(setDesktopGallery(desktopImages));
  };
};
