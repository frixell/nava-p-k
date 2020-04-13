var firebase = require("firebase/app");
require("firebase/database");


export const getPoints = (points) => ({
    type: "GET_POINTS",
    points
});

export const startGetPoints = () => {
    return (dispatch) => {
        return firebase.database().ref('points').once('value').then((snapshot) => {
            const points = [];
            snapshot.forEach((childSnapshot) => {
                points.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            dispatch(getPoints(points));
        });
    };
};

export const editProject = ( project ) => ({
    type: 'EDIT_PROJECT',
    project
});

export const startEditProject = ( projectObj ) => {
    console.log('project', projectObj);
    let id = projectObj.project.id;
    let project = projectObj.project;
    console.log(id);
    console.log(project);
    return (dispatch) => {
        return firebase.database().ref(`points/${id}`).update(project).then(() => {
            dispatch(editProject( project ));
        })
    };
};

// ADD_POINT

export const addPoint = (point) => ({
    type: 'ADD_POINT',
    point
});

export const startAddPoint = (pointData={}) => {
    return (dispatch, getState) => {
        const defaultExtendedContent = {
            content: '',
            image: '',
            tableOptions: '',
            title: ''
        }
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
        //let points = [];
        return firebase.database().ref('points').push(point).then((ref) => {
            if(ref) {
                const localPoint = {
                    id: ref.key,
                    ...point
                }
                dispatch(addPoint(localPoint));
                return localPoint;
            }
            
        });
    };
};