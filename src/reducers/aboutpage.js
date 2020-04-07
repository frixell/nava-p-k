// AboutPage Reducer

const aboutpageReducerDefaultState = [];

 export default (state = aboutpageReducerDefaultState, action) => {
    const aboutpage = state;
    switch (action.type) {
        case 'EDIT_ABOUTPAGE':
            return { ...action.updates };
        case 'EDIT_ABOUTPAGE_SEO':
            aboutpage.seo = action.seo;
            return aboutpage;
        case 'SET_ABOUTPAGE':
            return { ...action.aboutpage };
        case 'ADD_ABOUT_IMAGE':
            aboutpage.aboutimages = action.images;
            return aboutpage;
        default:
            return state;
    }
};