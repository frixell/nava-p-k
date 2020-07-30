// TeachingPage Reducer

const teachingpageReducerDefaultState = {};

 export default (state = teachingpageReducerDefaultState, action) => {
    const teachingpage = state;
    switch (action.type) {
        case 'EDIT_TEACHINGPAGE_SEO':
            teachingpage.seo = action.seo;
            return teachingpage;
        case 'SET_TEACHINGPAGE':
            teachingpage.teachings = action.teachings;
            teachingpage.seo = action.seo;
            return teachingpage;
        case 'UPDATE_TEACHINGS':
            teachingpage.teachings = action.teachings;
            return teachingpage;
        case 'ADD_TEACH':
            teachingpage.teachings.push(action.teach);
            return teachingpage;
        case 'UPDATE_TEACH':
            const teachIndex = teachingpage.teachings.findIndex(t => t.id === action.teach.id);
            teachingpage.teachings[teachIndex] = action.teach;
            return teachingpage;
        case 'DELETE_TEACH':
            const updatedTeachings = teachingpage.teachings.filter(t => t.id !== action.teach.id);
            teachingpage.teachings = updatedTeachings;
            return teachingpage;
        default:
            return state;
    }
};