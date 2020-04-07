// WorkshopPage Reducer

const workshoppageReducerDefaultState = [];

 export default (state = workshoppageReducerDefaultState, action) => {
    const workshoppage = state;
    switch (action.type) {
        case 'EDIT_WORKSHOPPAGE':
            return { ...action.updates };
        case 'EDIT_WORKSHOPPAGE_SEO':
            workshoppage.seo = action.seo;
            return workshoppage;
        case 'SET_WORKSHOPPAGE':
            return { ...action.workshoppage };
        case 'ADD_WORKSHOP_IMAGE':
            workshoppage.workshopimages = action.images;
            return workshoppage;
        default:
            return state;
    }
};