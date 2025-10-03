import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import database from '../../firebase/firebase';
import type { SeoPayload } from '../../types/seo';
import type { ImageAsset } from '../../types/content';
import { deleteImage } from '../../services/imageService';
import type { AppDispatch, AppThunk } from '../configureStore';

type AboutPageState = Record<string, unknown> | null;

const aboutSlice = createSlice({
  name: 'aboutpage',
  initialState: null as AboutPageState,
  reducers: {
    setAboutPage: (_state: AboutPageState, action: PayloadAction<AboutPageState>) => action.payload,
    updateAboutPage: (_state: AboutPageState, action: PayloadAction<AboutPageState>) => action.payload,
    updateAboutSeo: (state: AboutPageState, action: PayloadAction<SeoPayload>) => {
      if (state) {
        state.seo = action.payload;
      }
    },
    saveAboutImage: (state: AboutPageState, action: PayloadAction<ImageAsset>) => {
      if (state) {
        state.image = action.payload;
      }
    }
  }
});

export const {
  setAboutPage,
  updateAboutPage,
  updateAboutSeo,
  saveAboutImage
} = aboutSlice.actions;

export const startSetAboutPage = (): AppThunk<Promise<AboutPageState>> => async (
  dispatch: AppDispatch
) => {
  const snapshot = await database.ref('website/aboutpage/').once('value');
  const value = snapshot.val() ?? null;
  dispatch(setAboutPage(value));
  return value as AboutPageState;
};

export const startEditAboutPage = (
  fbAboutpage: Record<string, unknown>,
  aboutpage: AboutPageState
): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  await database.ref('website/aboutpage').update({ ...fbAboutpage });
  dispatch(updateAboutPage(aboutpage));
};

export const startEditAboutPageSeo = (seo: SeoPayload): AppThunk<Promise<void>> => async (
  dispatch: AppDispatch
) => {
  await database.ref('serverSeo/about/seo').update(seo);
  await database.ref('website/aboutpage/seo').update(seo);
  dispatch(updateAboutSeo(seo));
};

export const startSaveAboutImage = (
  imageData: Partial<ImageAsset> = {},
  publicIdToDelete?: string
): AppThunk<Promise<ImageAsset>> => async (dispatch: AppDispatch) => {
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
    order: 0
  };

  if (publicIdToDelete) {
    await deleteImage(publicIdToDelete);
  }

  await database.ref('website/aboutpage/image').update(image);
  dispatch(saveAboutImage(image));
  return image;
};

export default aboutSlice.reducer;
