import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/database';

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

export const startGetTableTemplate = () => async (dispatch: any) => {
  const snapshot = await firebase.database().ref('tableTemplate').once('value');
  const tableTemplate: TableCategory[] = [];

  snapshot.forEach((childSnapshot: any) => {
    const category = childSnapshot.val();
    const categories: TableSubcategory[] = [];

    Object.entries(category.categories ?? {}).forEach(([key, value]) => {
      const subcategory = value as TableSubcategory;
      const options: TableOption[] = [];

      Object.entries(subcategory.options ?? {}).forEach(([optionKey, optionValue]) => {
        options.push({ id: optionKey, ...(optionValue as TableOption) });
      });

      categories.push({ id: key, ...subcategory, options });
    });

    tableTemplate.push({ id: childSnapshot.key ?? undefined, ...category, categories });
  });

  dispatch(setTableTemplate(tableTemplate));
};

export default tableTemplateSlice.reducer;
