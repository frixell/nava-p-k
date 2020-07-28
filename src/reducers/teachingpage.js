// TeachingPage Reducer

const teachingpageReducerDefaultState = {};

 export default (state = teachingpageReducerDefaultState, action) => {
    const teachingpage = state;
    switch (action.type) {
        case 'EDIT_TEACHINGPAGE':
            return { ...action.updates };
        case 'EDIT_TEACHINGPAGE_SEO':
            teachingpage.seo = action.seo;
            return teachingpage;
        case 'SET_TEACHINGPAGE':
            teachingpage.teachings = action.teachingpage;
            return teachingpage;
        case 'SHOW_TEACH':
            console.log('reducer- action', action);
            const teachIndex = teachingpage.teachings.findIndex(t => t.id === action.teach.id);
            const teachings = teachingpage.teachings
            teachingpage.teachings[teachIndex] = action.teach;
            return teachingpage;
        case 'ADD_TEACH':
            teachingpage.teachings.push(action.teach);
            return teachingpage;
        default:
            return state;
    }
};