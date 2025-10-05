import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/database';

import type { AppDispatch, AppThunk } from '../configureStore';

type DataSnapshot = firebase.database.DataSnapshot;

export interface Category {
  id: string;
  name: string;
  order: number;
  isVisible: boolean;
  type: string;
  color?: string;
}

export type CategoriesState = Category[];

const initialState: CategoriesState = [];

const normalizeCategory = (id: string, value: Partial<Category> | null | undefined): Category => {
  const name = typeof value?.name === 'string' ? value.name : '';
  const rawOrder = value?.order;
  const order = typeof rawOrder === 'number' ? rawOrder : Number(rawOrder ?? 0);
  const isVisible =
    typeof value?.isVisible === 'boolean' ? value.isVisible : Boolean(value?.isVisible);
  const type = typeof value?.type === 'string' ? value.type : 'category';
  const color = typeof value?.color === 'string' ? value.color : undefined;

  return {
    id,
    name,
    order,
    isVisible,
    type,
    color
  };
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (_state: CategoriesState, action: PayloadAction<CategoriesState>) =>
      action.payload,
    addCategory: (state: CategoriesState, action: PayloadAction<Category>) => {
      state.push(action.payload);
    },
    updateCategories: (_state: CategoriesState, action: PayloadAction<CategoriesState>) =>
      action.payload,
    toggleCategoryVisibility: (
      state: CategoriesState,
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

export const { setCategories, addCategory, updateCategories, toggleCategoryVisibility } =
  categoriesSlice.actions;

export const startGetCategories = (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  const snapshot = await firebase.database().ref('categories').once('value');
  const categories: CategoriesState = [];

  snapshot.forEach((childSnapshot: DataSnapshot) => {
    const categoryData = childSnapshot.val() as Partial<Category> | null;
    if (categoryData) {
      categories.push(normalizeCategory(childSnapshot.key ?? '', categoryData));
    }
    return false;
  });

  dispatch(setCategories(categories));
};

export const startAddCategory =
  (categoryData: Partial<Category> = {}): AppThunk<Promise<void>> =>
  async (dispatch: AppDispatch) => {
    const { name = '', order = 0, isVisible = false, type = 'category', color } = categoryData;
    const categoryPayload = { name, order, isVisible, type, color };
    const ref = await firebase.database().ref('categories').push(categoryPayload);
    dispatch(addCategory(normalizeCategory(ref.key ?? '', categoryPayload)));
  };

export const startEditCategories =
  (fbCategories: Record<string, unknown>, categories: CategoriesState): AppThunk<Promise<void>> =>
  async (dispatch: AppDispatch) => {
    await firebase.database().ref('categories').update(fbCategories);
    dispatch(updateCategories(categories));
  };

export const startToggleShowCategory =
  (categoryId: string, visible: boolean): AppThunk<Promise<void>> =>
  async (dispatch: AppDispatch) => {
    await firebase.database().ref(`categories/${categoryId}`).update({ isVisible: visible });
    dispatch(toggleCategoryVisibility({ categoryId, visible }));
  };

export default categoriesSlice.reducer;
