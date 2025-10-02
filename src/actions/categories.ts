// @ts-nocheck
var firebase = require("firebase/app");
require("firebase/database");


// GET_CATEGORIES

export const getCategories = (categories) => ({
    type: "GET_CATEGORIES",
    categories
});

export const startGetCategories = () => {
    return (dispatch) => {
        return firebase.database().ref('categories').once('value').then((snapshot) => {
            const categories = [];
            snapshot.forEach((childSnapshot) => {
                //console.log('childSnapshot', childSnapshot);
                categories.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            //console.log('categories', categories);
            dispatch(getCategories(categories));
        });
    };
};

// ADD_CATEGORY

export const addCategory = (category) => ({
    type: 'ADD_CATEGORY',
    category
});

export const startAddCategory = (categoryData = {}) => {
    return (dispatch) => {
        const {
            name = '',
            order,
            isVisible = false,
            type = 'category'
        } = categoryData;
        const category = {name, order, isVisible, type};
        return firebase.database().ref('categories').push(category).then((ref) => {
            dispatch(addCategory({
                id: ref.key,
                ...category
            }));
        });
    };
};


// EDIT_CATEGORIES

export const editCategories = ( categories ) => ({
    type: 'EDIT_CATEGORIES',
    categories
});

export const startEditCategories = ( fbCategories, categories ) => {
    return (dispatch) => {
        return firebase.database().ref().child(`categories`).update(fbCategories).then(() => {
            dispatch(editCategories( categories ));
        })
    };
};



// Toggle Show Category

export const toggleShowCategory = ( categoryId, visible ) => ({
    type: 'TOGGLE_SHOW_CATEGORY',
    categoryId,
    visible
});

// export const toggleAllShowCategory = ( categoryId, visible ) => ({
//     type: 'TOGGLE_ALL_SHOW_CATEGORY',
//     categoryId,
//     visible
// });

export const startToggleShowCategory = ( categoryId, visible ) => {
    const visibleObj = {
        isVisible: visible
    };
    //console.log('in actions', visibleObj);
    return (dispatch) => {
        return firebase.database().ref().child(`categories/${categoryId}`).update(visibleObj).then(() => {
            //console.log('from actions:', categoryId, visible);
            dispatch(toggleShowCategory( categoryId, visible ));
            //dispatch(toggleAllShowCategory( categoryId, visible ));
            return 'done';
        })
    };
};
