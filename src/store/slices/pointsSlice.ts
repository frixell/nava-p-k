import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/database';

import type { AppDispatch, AppThunk } from '../configureStore';

export interface ExtendedContent {
  content: string;
  image: string;
  tableOptions: string;
  title: string;
  [key: string]: unknown;
}

export interface PointBase {
  title: string;
  content: string;
  extendedContent: ExtendedContent;
  type: string;
  x: string;
  y: string;
  z: string;
}

export interface Point extends PointBase {
  id: string;
  [key: string]: unknown;
}

export type PointsState = Point[];

const defaultExtendedContent: ExtendedContent = {
  content: '',
  image: '',
  tableOptions: '',
  title: ''
};

const initialState: PointsState = [];

const normalizeExtendedContent = (
  payload?: Partial<ExtendedContent> | null
): ExtendedContent => {
  const { content, image, tableOptions, title, ...rest } = payload ?? {};
  return {
    content: typeof content === 'string' ? content : '',
    image: typeof image === 'string' ? image : '',
    tableOptions: typeof tableOptions === 'string' ? tableOptions : '',
    title: typeof title === 'string' ? title : '',
    ...rest
  };
};

const normalizePoint = (id: string, payload: Partial<Point> | null | undefined): Point => {
  const { id: _ignored, extendedContent: rawExtendedContent, ...rest } = payload ?? {};
  return {
    id,
    title: typeof payload?.title === 'string' ? payload.title : '',
    content: typeof payload?.content === 'string' ? payload.content : '',
    extendedContent: normalizeExtendedContent(rawExtendedContent as Partial<ExtendedContent>),
    type: typeof payload?.type === 'string' ? payload.type : 'point',
    x: typeof payload?.x === 'string' ? payload.x : String(payload?.x ?? '0'),
    y: typeof payload?.y === 'string' ? payload.y : String(payload?.y ?? '0'),
    z: typeof payload?.z === 'string' ? payload.z : String(payload?.z ?? '0'),
    ...rest
  };
};

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    setPoints: (_state: PointsState, action: PayloadAction<PointsState>) => action.payload,
    addPoint: (state: PointsState, action: PayloadAction<Point>) => {
      state.push(action.payload);
    },
    editProject: (state: PointsState, action: PayloadAction<Point>) => {
      const index = state.findIndex((point) => point.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;
      }
    }
  }
});

export const { setPoints, addPoint, editProject } = pointsSlice.actions;

export const startGetPoints = (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  const snapshot = await firebase.database().ref('points').once('value');
  const points: PointsState = [];

  snapshot.forEach((childSnapshot: firebase.database.DataSnapshot) => {
    const pointData = childSnapshot.val() as Partial<Point> | null;
    if (pointData) {
      points.push(normalizePoint(childSnapshot.key ?? '', pointData));
    }
    return false;
  });

  dispatch(setPoints(points));
};

export const startEditProject = (
  payload: { project: Point }
): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  const { id, ...rest } = payload.project;
  if (!id) {
    return;
  }

  await firebase.database().ref(`points/${id}`).update(rest);
  dispatch(editProject(payload.project));
};

export const startAddPoint = (
  pointData: Partial<Point> = {}
): AppThunk<Promise<Point | undefined>> => async (dispatch: AppDispatch) => {
  const {
    title = 'title',
    content = 'content',
    extendedContent = defaultExtendedContent,
    type = 'point',
    x = '0',
    y = '0',
    z = '0'
  } = pointData;

  const pointPayload: Partial<Point> = {
    title,
    content,
    extendedContent,
    type,
    x,
    y,
    z
  };

  const ref = await firebase.database().ref('points').push(pointPayload);

  if (ref?.key) {
    const localPoint = normalizePoint(ref.key, pointPayload);
    dispatch(addPoint(localPoint));
    return localPoint;
  }

  return undefined;
};

export default pointsSlice.reducer;
