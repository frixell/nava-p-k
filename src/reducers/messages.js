// Messages Reducer

const messagesReducerDefaultState = [];

 export default (state = messagesReducerDefaultState, action) => {
    switch (action.type) {
        case 'SEND_MESSAGE':
        // push changes the array, concat returns a new array
            return [
                ...state,
                action.message
            ];
        default:
            return state;
    }
};