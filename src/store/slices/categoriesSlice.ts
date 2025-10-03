import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/database';

import type { AppDispatch, AppThunk } from '../configureStore';

type DataSnapshot = firebase.database.DataSnapshot;

export interface Category {
  id?: string;
  name?: string;
  order?: number;
  isVisible?: boolean;
  type?: string;
  [key: string]: unknown;
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: [] as Category[],
  reducers: {
    setCategories: (_state: Category[], action: PayloadAction<Category[]>) => action.payload,
    addCategory: (state: Category[], action: PayloadAction<Category>) => {
      state.push(action.payload);
    },
    updateCategories: (_state: Category[], action: PayloadAction<Category[]>) => action.payload,
    toggleCategoryVisibility: (
      state: Category[],
      action: PayloadAction<{ categoryId: string; visible: boolean }>
    ) => {
      const { categoryId, visible } = action.payload;
      const target = state.find((category) => category.id === categoryId);
      if (target) {
        target.isVisible = visible;
      }
    }
  }
});

export const { setCategories, addCategory, updateCategories, toggleCategoryVisibility } = categoriesSlice.actions;

export const startGetCategories = (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  const snapshot = await firebase.database().ref('categories').once('value');
  const categories: Category[] = [];

  snapshot.forEach((childSnapshot: DataSnapshot) => {
    const categoryData = childSnapshot.val() as Partial<Category> | null;
    if (categoryData) {
      categories.push({ id: childSnapshot.key ?? undefined, ...categoryData });
    }
    return false;
  });

  dispatch(setCategories(categories));
};

export const startAddCategory = (
  categoryData: Partial<Category> = {}
): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  const { name = '', order, isVisible = false, type = 'category' } = categoryData;
  const category = { name, order, isVisible, type };
  const ref = await firebase.database().ref('categories').push(category);
  dispatch(addCategory({ id: ref.key ?? undefined, ...category }));
};

export const startEditCategories = (
  fbCategories: Record<string, unknown>,
  categories: Category[]
): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  await firebase.database().ref('categories').update(fbCategories);
  dispatch(updateCategories(categories));
};

export const startToggleShowCategory = (
  categoryId: string,
  visible: boolean
): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  await firebase.database().ref(`categories/${categoryId}`).update({ isVisible: visible });
  dispatch(toggleCategoryVisibility({ categoryId, visible }));
};

export default categoriesSlice.reducer;
