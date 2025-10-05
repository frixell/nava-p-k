import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import database from '../../firebase/firebase';
import type { ImageAsset } from '../../types/content';
import type { SeoPayload } from '../../types/seo';
import { deleteImage } from '../../services/imageService';
import type { AppDispatch, AppThunk, RootState } from '../configureStore';

export type CvSeo = SeoPayload;

export interface CvImage extends ImageAsset {
  id?: string;
}

export type CvImagesMap = Record<string, CvImage>;

export interface CvPageState {
  content: string;
  contentHebrew: string;
  seo: CvSeo | null;
  cvimages: CvImagesMap;
  [key: string]: unknown;
}

const initialState: CvPageState = {
  content: '',
  contentHebrew: '',
  seo: null,
  cvimages: {}
};

const toSeo = (seo: unknown): CvSeo | null => {
  if (typeof seo !== 'object' || seo === null) {
    return null;
  }
  const { title = '', description = '', keyWords = '' } = seo as Partial<CvSeo>;
  return {
    title: typeof title === 'string' ? title : '',
    description: typeof description === 'string' ? description : '',
    keyWords: typeof keyWords === 'string' ? keyWords : ''
  };
};

const toCvImage = (id: string, image: Partial<ImageAsset> | null | undefined): CvImage => ({
  id: id || undefined,
  publicId: typeof image?.publicId === 'string' ? image.publicId : '',
  src: typeof image?.src === 'string' ? image.src : '',
  width: image?.width,
  height: image?.height,
  alt: typeof image?.alt === 'string' ? image.alt : '',
  order: typeof image?.order === 'number' ? image.order : Number(image?.order ?? 0) || 0
});

type CvImagesInput =
  | CvImagesMap
  | Array<Partial<ImageAsset> | null | undefined>
  | Record<string, Partial<ImageAsset> | null | undefined>
  | null
  | undefined;

const mergeEntries = (entries: Array<[string, CvImage]>, seed: CvImagesMap): CvImagesMap =>
  entries.reduce<CvImagesMap>(
    (accumulator, [key, image]) => ({
      ...accumulator,
      [key]: image
    }),
    seed
  );

const toCvImagesMap = (source: CvImagesInput, fallback: CvImagesMap = {}): CvImagesMap => {
  const seed = { ...fallback };
  if (!source) {
    return seed;
  }

  if (Array.isArray(source)) {
    const entries = source.reduce<Array<[string, CvImage]>>((accumulator, entry, index) => {
      if (!entry) {
        return accumulator;
      }
      const key = typeof entry.id === 'string' && entry.id.length > 0 ? entry.id : String(index);
      accumulator.push([key, toCvImage(key, entry)]);
      return accumulator;
    }, []);

    return mergeEntries(entries, seed);
  }

  const entries = Object.entries(source).map<[string, CvImage]>(([key, entry]) => [
    key,
    toCvImage(key, entry ?? {})
  ]);

  return mergeEntries(entries, seed);
};

const ensureCvPageState = (
  payload?: Partial<CvPageState> | null,
  fallback: CvPageState = initialState
): CvPageState => ({
  ...fallback,
  ...(payload ?? {}),
  content: typeof payload?.content === 'string' ? payload.content : fallback.content,
  contentHebrew:
    typeof payload?.contentHebrew === 'string' ? payload.contentHebrew : fallback.contentHebrew,
  seo: toSeo(payload?.seo ?? fallback.seo),
  cvimages: toCvImagesMap(payload?.cvimages ?? fallback.cvimages, fallback.cvimages)
});

const cvSlice = createSlice({
  name: 'cvpage',
  initialState,
  reducers: {
    setCvPage: (_state: CvPageState, action: PayloadAction<Partial<CvPageState> | null>) =>
      ensureCvPageState(action.payload),
    updateCvPage: (state: CvPageState, action: PayloadAction<Partial<CvPageState>>) =>
      ensureCvPageState(action.payload, state),
    updateCvSeo: (state: CvPageState, action: PayloadAction<CvSeo>) => {
      state.seo = { ...action.payload };
    },
    setCvImages: (state: CvPageState, action: PayloadAction<CvImagesMap>) => {
      state.cvimages = { ...action.payload };
    }
  }
});

export const { setCvPage, updateCvPage, updateCvSeo, setCvImages } = cvSlice.actions;

export const startSetCvPage =
  (): AppThunk<Promise<CvPageState>> => async (dispatch: AppDispatch) => {
    const snapshot = await database.ref('website/cvpage/').once('value');
    const value = snapshot.val() as Partial<CvPageState> | null;
    const cvpage = ensureCvPageState(value);
    dispatch(setCvPage(cvpage));
    return cvpage;
  };

export const startEditCvPage =
  (fbCvpage: Record<string, unknown>, cvpage: Partial<CvPageState>): AppThunk<Promise<void>> =>
  async (dispatch: AppDispatch) => {
    await database.ref('website/cvpage').update({ ...fbCvpage });
    dispatch(updateCvPage(cvpage));
  };

export const startEditCvPageSeo =
  (seo: CvSeo): AppThunk<Promise<CvSeo>> =>
  async (dispatch: AppDispatch) => {
    await database.ref('serverSeo/cv/seo').update(seo);
    await database.ref('website/cvpage/seo').update(seo);
    dispatch(updateCvSeo(seo));
    return seo;
  };

export const startAddCvImage =
  (imageData: Partial<ImageAsset> = {}, order: number): AppThunk<Promise<CvImagesMap>> =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { publicId = '', src = '', width = '', height = '', alt = '' } = imageData;

    const image: ImageAsset = {
      publicId,
      src,
      width,
      height,
      alt,
      order
    };

    const ref = await database.ref('website/cvpage/cvimages').push(image);
    const imageId = ref.key ?? '';
    const localImage = toCvImage(imageId, image);

    const state = getState();
    const existingImages = state.cvpage?.cvimages ?? {};
    const mergedImages: CvImagesMap = {
      ...existingImages,
      [imageId]: localImage
    };

    dispatch(setCvImages(mergedImages));
    return mergedImages;
  };

export const startDeleteCvImage =
  (
    fbImages: Record<string, unknown>,
    images: CvImagesMap,
    publicid: string
  ): AppThunk<Promise<void>> =>
  async (dispatch: AppDispatch) => {
    if (publicid) {
      await deleteImage(publicid);
    }

    await database.ref('website/cvpage/cvimages').update(fbImages);
    dispatch(setCvImages(images));
  };

export const createEmptyCvPage = (): CvPageState => ensureCvPageState(null);

export { initialState as initialCvPageState, ensureCvPageState };

export default cvSlice.reducer;
