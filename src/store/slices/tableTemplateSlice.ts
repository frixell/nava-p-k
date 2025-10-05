import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/database';

import type { AppDispatch, AppThunk } from '../configureStore';

export interface TableOption {
  id: string;
  name: string;
  nameHebrew: string;
}

export interface TableSubcategory {
  id: string;
  name: string;
  nameHebrew: string;
  options: TableOption[];
}

export interface TableCategory {
  id: string;
  name: string;
  nameHebrew: string;
  color: string;
  categories: TableSubcategory[];
}

export type TableTemplateState = TableCategory[];

const initialState: TableTemplateState = [];

type TableOptionsSource =
  | Record<string, Partial<TableOption> | null | undefined>
  | Array<Partial<TableOption> | null | undefined>
  | null
  | undefined;

type TableSubcategoriesSource =
  | Record<string, Partial<TableSubcategory> | null | undefined>
  | Array<Partial<TableSubcategory> | null | undefined>
  | null
  | undefined;

const normalizeTableOption = (
  id: string,
  value: Partial<TableOption> | null | undefined
): TableOption => ({
  id,
  name: typeof value?.name === 'string' ? value.name : '',
  nameHebrew: typeof value?.nameHebrew === 'string' ? value.nameHebrew : ''
});

const normalizeOptions = (source: TableOptionsSource): TableOption[] => {
  if (!source) {
    return [];
  }
  if (Array.isArray(source)) {
    return source
      .map((entry, index) => {
        if (!entry) {
          return null;
        }
        const optionId = typeof entry.id === 'string' ? entry.id : String(index);
        return normalizeTableOption(optionId, entry);
      })
      .filter((option): option is TableOption => Boolean(option));
  }
  return Object.entries(source).map(([optionId, optionValue]) =>
    normalizeTableOption(optionId, optionValue)
  );
};

const normalizeTableSubcategory = (
  id: string,
  value: Partial<TableSubcategory> | null | undefined
): TableSubcategory => ({
  id,
  name: typeof value?.name === 'string' ? value.name : '',
  nameHebrew: typeof value?.nameHebrew === 'string' ? value.nameHebrew : '',
  options: normalizeOptions(value?.options as TableOptionsSource)
});

const normalizeSubcategories = (source: TableSubcategoriesSource): TableSubcategory[] => {
  if (!source) {
    return [];
  }
  if (Array.isArray(source)) {
    return source
      .map((entry, index) => {
        if (!entry) {
          return null;
        }
        const subcategoryId = typeof entry.id === 'string' ? entry.id : String(index);
        return normalizeTableSubcategory(subcategoryId, entry);
      })
      .filter((subcategory): subcategory is TableSubcategory => Boolean(subcategory));
  }
  return Object.entries(source).map(([subcategoryId, subcategoryValue]) =>
    normalizeTableSubcategory(subcategoryId, subcategoryValue)
  );
};

const normalizeTableCategory = (
  id: string,
  value: Partial<TableCategory> | null | undefined
): TableCategory => ({
  id,
  name: typeof value?.name === 'string' ? value.name : '',
  nameHebrew: typeof value?.nameHebrew === 'string' ? value.nameHebrew : '',
  color: typeof value?.color === 'string' ? value.color : '',
  categories: normalizeSubcategories(value?.categories as TableSubcategoriesSource)
});

const tableTemplateSlice = createSlice({
  name: 'tableTemplate',
  initialState,
  reducers: {
    setTableTemplate: (_state: TableTemplateState, action: PayloadAction<TableTemplateState>) =>
      action.payload
  }
});

export const { setTableTemplate } = tableTemplateSlice.actions;

export const startGetTableTemplate =
  (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    const snapshot = await firebase.database().ref('tableTemplate').once('value');
    const tableTemplate: TableTemplateState = [];

    snapshot.forEach((childSnapshot: firebase.database.DataSnapshot) => {
      const categoryData = childSnapshot.val() as Partial<TableCategory> | null;
      if (!categoryData) {
        return false;
      }

      tableTemplate.push(normalizeTableCategory(childSnapshot.key ?? '', categoryData));

      return false;
    });

    dispatch(setTableTemplate(tableTemplate));
  };

export default tableTemplateSlice.reducer;
