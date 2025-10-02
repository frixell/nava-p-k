// @ts-nocheck
var firebase = require("firebase/app");
require("firebase/database");


export const getTableTemplate = (tableTemplate) => ({
    type: "GET_TABLETEMPLATE",
    tableTemplate
});

export const startGetTableTemplate = () => {
    return (dispatch) => {
        return firebase.database().ref('tableTemplate').once('value').then((snapshot) => {
            const tableTemplate = [];
            snapshot.forEach((childSnapshot) => {
                let category = childSnapshot.val();
                let categories = [];
                for (let [key, value] of Object.entries(category.categories)) {
                    let subcategory = value;
                    let options = [];
                    for (let [key, value] of Object.entries(subcategory.options)) {
                        let option = value;
                        options.push({
                            id: key,
                            ...option
                        });
                    }
                    subcategory.options = options;
                    categories.push({
                        id: key,
                        ...subcategory
                    });
                }
                category.categories = categories;
                tableTemplate.push({
                    id: childSnapshot.key,
                    ...category
                });
            });
            dispatch(getTableTemplate(tableTemplate));
        });
    };
};
