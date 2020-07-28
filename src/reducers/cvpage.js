// CvPage Reducer

const cvpageReducerDefaultState = [];

 export default (state = cvpageReducerDefaultState, action) => {
    const cvpage = state;
    switch (action.type) {
        case 'EDIT_CVPAGE':
            return { ...action.updates };
        case 'EDIT_CVPAGE_SEO':
            cvpage.seo = action.seo;
            return cvpage;
        case 'SET_CVPAGE':
            return { ...action.cvpage };
        case 'ADD_CV_IMAGE':
            cvpage.cvimages = action.images;
            return cvpage;
        default:
            return state;
    }
};