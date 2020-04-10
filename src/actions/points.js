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



// ADD_POINT

export const addPoint = (point) => ({
    type: 'ADD_POINT',
    point
});

export const startAddPoint = (pointData={}) => {
    return (dispatch, getState) => {
        const {
            title = 'title',
            type = 'point',
            x = '0',
            y = '0',
            z = '0'
        } = pointData;
        const point = {
            title,
            type,
            x,
            y,
            z
        };
        console.log('in action');
        return firebase.database().ref('points').push(point).then((ref) => {
            console.log('ref', ref);
            if(ref) {
                const localPoint = {
                    id: ref.key,
                    ...point
                }
                //points.push(localPoint);
                dispatch(addPoint(point));
                return points;
            }
            
        });
    };
};