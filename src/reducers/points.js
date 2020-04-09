// Points Reducer

const pointsReducerDefaultState = {};

export default (state = pointsReducerDefaultState, action) => {
    let points = state;
    switch (action.type) {
        
        case 'GET_POINTS':
                points = action.points;
            return points;
    
        case 'ADD_POINT':
                points = points.push(action.point);
            return points;
        
        default:
            return state;
    }
};