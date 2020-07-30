// AboutPage Reducer

const aboutpageReducerDefaultState = [];

 export default (state = aboutpageReducerDefaultState, action) => {
    const aboutpage = state;
    switch (action.type) {
        case 'EDIT_ABOUTPAGE':
            return { ...action.aboutpage };
        case 'EDIT_ABOUTPAGE_SEO':
            aboutpage.seo = action.seo;
            return aboutpage;
        case 'SET_ABOUTPAGE':
            return { ...action.aboutpage };
        case 'SAVE_ABOUT_IMAGE':
            aboutpage.image = action.image;
            return aboutpage;
        default:
            return state;
    }
};