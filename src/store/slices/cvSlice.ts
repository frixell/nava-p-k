import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import database from '../../firebase/firebase';
import type { ImageAsset } from '../../types/content';
import type { SeoPayload } from '../../types/seo';

export type CvPageState = Record<string, unknown> | null;

const cvSlice = createSlice({
  name: 'cvpage',
  initialState: null as CvPageState,
  reducers: {
    setCvPage: (_state: CvPageState, action: PayloadAction<CvPageState>) => action.payload,
    updateCvPage: (_state: CvPageState, action: PayloadAction<CvPageState>) => action.payload,
    updateCvSeo: (state: CvPageState, action: PayloadAction<SeoPayload>) => {
      if (state) {
        state.seo = action.payload;
      }
    },
    setCvImages: (state: CvPageState, action: PayloadAction<ImageAsset[]>) => {
      if (state) {
        state.cvimages = action.payload;
      }
    }
  }
});

export const { setCvPage, updateCvPage, updateCvSeo, setCvImages } = cvSlice.actions;

export const startSetCvPage = () => async (dispatch: any) => {
  const snapshot = await database.ref('website/cvpage/').once('value');
  const cvpage = snapshot.val() ?? null;
  dispatch(setCvPage(cvpage));
  return cvpage;
};

export const startEditCvPage = (fbCvpage: Record<string, unknown>, cvpage: CvPageState) => async (dispatch: any) => {
  await database.ref('website/cvpage').update({ ...fbCvpage });
  dispatch(updateCvPage(cvpage));
};

export const startEditCvPageSeo = (seo: SeoPayload) => async (dispatch: any) => {
  await database.ref('serverSeo/cv/seo').update(seo as any);
  await database.ref('website/cvpage/seo').update(seo as any);
  dispatch(updateCvSeo(seo));
};

export const startAddCvImage = (imageData: Partial<ImageAsset> = {}, order: number) => async (dispatch: any, getState: any) => {
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
    order
  };

  const ref = await database.ref('website/cvpage/cvimages').push(image);
  const localImage: ImageAsset = {
    id: ref.key ?? undefined,
    ...image
  };

  const state = getState();
  const existingImages: Record<string, ImageAsset> = state?.cvpage?.cvimages ?? {};
  const nextImages: ImageAsset[] = Object.keys({ ...existingImages, [ref.key as string]: localImage }).map((key) => ({
    id: key,
    ...(existingImages[key] ?? localImage)
  }));

  dispatch(setCvImages(nextImages));
  return nextImages;
};

export const startDeleteCvImage = (
  fbImages: Record<string, unknown>,
  images: ImageAsset[],
  publicid: string
) => async (dispatch: any) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/deleteImage');
  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
  xhr.send(`publicid=${publicid}`);

  await database.ref().child('website/cvpage/cvimages').update(fbImages);
  dispatch(setCvImages(images));
};

export default cvSlice.reducer;
