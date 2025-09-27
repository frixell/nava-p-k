import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import 'firebase/database';

// Types
interface ExtendedContent {
    content: string;
    image: string;
    tableOptions: string;
    title: string;
}

interface Point {
    id: string;
    title: string;
    content: string;
    extendedContent: ExtendedContent;
    type: string;
    x: string;
    y: string;
    z: string;
}

interface Project {
    id: string;
    [key: string]: any;
}

interface ProjectObj {
    project: Project;
}

type PointsActionTypes =
    | { type: 'GET_POINTS'; points: Point[] }
    | { type: 'EDIT_PROJECT'; project: Project }
    | { type: 'ADD_POINT'; point: Point };

type RootState = any; // Define your full state type
type PointsThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, PointsActionTypes>;

// Action Creators
export const getPoints = (points: Point[]): PointsActionTypes => ({
    type: 'GET_POINTS',
    points
});

export const startGetPoints = (): PointsThunk<Promise<void>> => {
    return (dispatch: Dispatch<PointsActionTypes>) => {
        return firebase.database().ref('points').once('value').then((snapshot) => {
            const points: Point[] = [];
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key) {
                    points.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                }
            });
            dispatch(getPoints(points));
        });
    };
};

export const editProject = (project: Project): PointsActionTypes => ({
    type: 'EDIT_PROJECT',
    project
});

export const startEditProject = (projectObj: ProjectObj): PointsThunk<Promise<void>> => {
    return (dispatch: Dispatch<PointsActionTypes>) => {
        const { id, ...project } = projectObj.project;
        
        return firebase.database().ref(`points/${id}`).update(project).then(() => {
            dispatch(editProject(projectObj.project));
        });
    };
};

// ADD_POINT
export const addPoint = (point: Point): PointsActionTypes => ({
    type: 'ADD_POINT',
    point
});

export const startAddPoint = (pointData: Partial<Point> = {}): PointsThunk<Promise<Point | undefined>> => {
    return (dispatch: Dispatch<PointsActionTypes>, getState) => {
        const defaultExtendedContent: ExtendedContent = {
            content: '',
            image: '',
            tableOptions: '',
            title: ''
        };
        
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
        
        return firebase.database().ref('points').push(point).then((ref) => {
            if (ref?.key) {
                const localPoint: Point = {
                    id: ref.key,
                    ...point
                };
                dispatch(addPoint(localPoint));
                return localPoint;
            }
            return undefined;
        });
    };
};

// Export types for use in other files
export type {
    Point,
    Project,
    ProjectObj,
    ExtendedContent,
    PointsActionTypes
};
