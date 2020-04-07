// Newsletter Reducer

const subscribersReducerDefaultState = [];

 export default (state = subscribersReducerDefaultState, action) => {
    switch (action.type) {
        case 'ADD_SUBSCRIBER':
        // push changes the array, concat returns a new array
            return [
                ...state,
                action.subscriber
            ];
        default:
            return state;
    }
};