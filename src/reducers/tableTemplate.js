// Points Reducer

const tableTemplateReducerDefaultState = [];

export default (state = tableTemplateReducerDefaultState, action) => {
    let tableTemplate = state;
    switch (action.type) {
        
        case 'GET_TABLETEMPLATE':
                tableTemplate = action.tableTemplate;
            return tableTemplate;
        
        default:
            return state;
    }
};