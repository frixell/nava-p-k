// HomePage Reducer

const homepageReducerDefaultState = [];

 export default (state = homepageReducerDefaultState, action) => {
    const homepage = state;
    switch (action.type) {
        case 'ADD_HOMEPAGE_TELL':
            return { ...action.homepage };
        case 'EDIT_HOMEPAGE':
            return { ...action.updates };
        case 'EDIT_HOMEPAGE_SEO':
            homepage.seo = action.seo;
            return homepage;
        case 'SET_HOMEPAGE':
            return { ...action.homepage };
        default:
            return state;
    }
};