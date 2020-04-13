// Points Reducer

const pointsReducerDefaultState = [];

export default (state = pointsReducerDefaultState, action) => {
    let points = state;
    console.log('points in reducer:', points);
    switch (action.type) {
        
        case 'GET_POINTS':
                points = action.points;
            return points;
    
        case 'ADD_POINT':
                //console.log('points in reducer ADD_POINT:', points);
                //console.log('point to add in reducer ADD_POINT:', action.point);
                //let newPoints = points.push(action.point);
                console.log('points returned in reducer ADD_POINT:', [
                    ...state,
                    action.point
                ]);
            return [
                ...state,
                action.point
            ];
        
        default:
            return state;
    }
};