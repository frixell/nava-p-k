// Costumers Reducer

const costumersReducerDefaultState = {};

 export default (state = costumersReducerDefaultState, action) => {
    const events = state;
    switch (action.type) {   
        case 'SET_COSTUMERS':
            events.costumers = action.costumers.map((costumer) => costumer);
            return events;
        default:
            return state;
    }
};