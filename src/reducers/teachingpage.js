// TeachingPage Reducer

const defaultSeo = { title: '', description: '', keyWords: '' };

const initialState = {
    teachings: [],
    seo: defaultSeo
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'EDIT_TEACHINGPAGE_SEO':
            return {
                ...state,
                seo: action.seo || defaultSeo
            };
        case 'SET_TEACHINGPAGE':
            return {
                ...state,
                teachings: Array.isArray(action.teachings) ? [...action.teachings] : [],
                seo: action.seo || defaultSeo
            };
        case 'UPDATE_TEACHINGS':
            return {
                ...state,
                teachings: Array.isArray(action.teachings) ? [...action.teachings] : []
            };
        case 'ADD_TEACH':
            return {
                ...state,
                teachings: [...state.teachings, action.teach]
            };
        case 'UPDATE_TEACH':
            return {
                ...state,
                teachings: state.teachings.map((teach) =>
                    teach.id === action.teach.id ? { ...teach, ...action.teach } : teach
                )
            };
        case 'DELETE_TEACH':
            return {
                ...state,
                teachings: state.teachings.filter((teach) => teach.id !== action.teach.id)
            };
        default:
            return state;
    }
};
