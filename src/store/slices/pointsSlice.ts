import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import 'firebase/database';

export interface ExtendedContent {
  content: string;
  image: string;
  tableOptions: string;
  title: string;
  [key: string]: unknown;
}

export interface Point {
  id?: string;
  title: string;
  content: string;
  extendedContent: ExtendedContent;
  type: string;
  x: string;
  y: string;
  z: string;
  [key: string]: unknown;
}

const defaultExtendedContent: ExtendedContent = {
  content: '',
  image: '',
  tableOptions: '',
  title: ''
};

const pointsSlice = createSlice({
  name: 'points',
  initialState: [] as Point[],
  reducers: {
    setPoints: (_state: Point[], action: PayloadAction<Point[]>) => action.payload,
    addPoint: (state: Point[], action: PayloadAction<Point>) => {
      state.push(action.payload);
    },
    editProject: (state: Point[], action: PayloadAction<Point>) => {
      const index = state.findIndex((point) => point.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;
      }
    }
  }
});

export const { setPoints, addPoint, editProject } = pointsSlice.actions;

export const startGetPoints = () => async (dispatch: any) => {
  const snapshot = await firebase.database().ref('points').once('value');
  const points: Point[] = [];
  snapshot.forEach((childSnapshot: any) => {
    points.push({
      id: childSnapshot.key ?? undefined,
      ...childSnapshot.val()
    });
  });
  dispatch(setPoints(points));
};

export const startEditProject = (payload: { project: Point }) => async (dispatch: any) => {
  const { id, ...rest } = payload.project;
  if (!id) {
    return;
  }
  await firebase.database().ref(`points/${id}`).update(rest);
  dispatch(editProject(payload.project));
};

export const startAddPoint = (pointData: Partial<Point> = {}) => async (dispatch: any) => {
  const {
    title = 'title',
    content = 'content',
    extendedContent = defaultExtendedContent,
    type = 'point',
    x = '0',
    y = '0',
    z = '0'
  } = pointData;

  const point = {
    title,
    content,
    extendedContent,
    type,
    x,
    y,
    z
  };

  const ref = await firebase.database().ref('points').push(point);

  if (ref?.key) {
    const localPoint: Point = {
      id: ref.key,
      ...point
    };
    dispatch(addPoint(localPoint));
    return localPoint;
  }

  return undefined;
};

export default pointsSlice.reducer;
