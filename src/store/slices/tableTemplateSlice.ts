import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/database';

import type { AppDispatch, AppThunk } from '../configureStore';

export interface TableOption {
  id?: string;
  name?: string;
  nameHebrew?: string;
  [key: string]: unknown;
}

export interface TableSubcategory {
  id?: string;
  name?: string;
  nameHebrew?: string;
  options?: TableOption[];
  [key: string]: unknown;
}

export interface TableCategory {
  id?: string;
  name?: string;
  nameHebrew?: string;
  color?: string;
  categories?: TableSubcategory[];
  [key: string]: unknown;
}

const tableTemplateSlice = createSlice({
  name: 'tableTemplate',
  initialState: [] as TableCategory[],
  reducers: {
    setTableTemplate: (_state: TableCategory[], action: PayloadAction<TableCategory[]>) => action.payload
  }
});

export const { setTableTemplate } = tableTemplateSlice.actions;

export const startGetTableTemplate = (): AppThunk<Promise<void>> => async (
  dispatch: AppDispatch
) => {
  const snapshot = await firebase.database().ref('tableTemplate').once('value');
  const tableTemplate: TableCategory[] = [];

  snapshot.forEach((childSnapshot: firebase.database.DataSnapshot) => {
    const categoryData = childSnapshot.val() as Partial<TableCategory> | null;
    if (!categoryData) {
      return false;
    }

    const categories: TableSubcategory[] = Object.entries(categoryData.categories ?? {}).map(
      ([subcategoryId, subcategoryValue]) => {
        const subcategoryData = subcategoryValue as Partial<TableSubcategory>;
        const options: TableOption[] = Object.entries(subcategoryData.options ?? {}).map(
          ([optionId, optionValue]) => ({ id: optionId, ...(optionValue as TableOption) })
        );

        return {
          id: subcategoryId,
          ...subcategoryData,
          options
        };
      }
    );

    tableTemplate.push({
      id: childSnapshot.key ?? undefined,
      ...categoryData,
      categories
    });

    return false;
  });

  dispatch(setTableTemplate(tableTemplate));
};

export default tableTemplateSlice.reducer;
