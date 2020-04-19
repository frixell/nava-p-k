// Points Reducer

const categoriesReducerDefaultState = [];

export default (state = categoriesReducerDefaultState, action) => {
    let categories = JSON.parse(JSON.stringify(state));
    //console.log('points in reducer:', categories);
    switch (action.type) {
        
        case 'GET_CATEGORIES':
                categories = action.categories;
            return categories;
    
        case 'ADD_CATEGORY':
                //console.log('points in reducer ADD_POINT:', points);
                //console.log('point to add in reducer ADD_POINT:', action.point);
                //let newPoints = points.push(action.point);
                // console.log('points returned in reducer ADD_POINT:', [
                //     ...categories,
                //     action.category
                // ]);
            return [
                ...categories,
                action.category
            ];
            
        case 'TOGGLE_SHOW_CATEGORY':
            // console.log('from reducer:', action);
            // console.log('from reducer - categories:', categories);
            // console.log('from reducer - action.categoryId:', action.categoryId);
            //console.log('from reducer - categories[action.categoryId].isVisible:', categories[action.categoryId].isVisible);
            let categoryIndex = null;
            categories.map((category, index) => {
                if (category.id === action.categoryId) {
                    categoryIndex = index;
                }
            });
            //console.log('from reducer - categoryIndex:', categoryIndex);
            categories[categoryIndex].isVisible = action.visible;
            return categories;

        
        default:
            return state;
    }
};