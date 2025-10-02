// @ts-nocheck
//import database from '../firebase/firebase';
var firebase = require("firebase/app");
require("firebase/database");
const { deleteImage } = require('../services/imageService');

// add costumer

export const addCostumers = ( costumers ) => ({
    type: 'ADD_COSTUMERS',
    costumers
});

export const startAddCostumers = ( costumer ) => {
    return (dispatch) => {
        return firebase.database().ref(`website/costumers`).push(costumer).then(() => {
            //dispatch(addCostumers( costumers ));
        })
    };
};




// edit costumers

export const editCostumers = ( costumers ) => ({
    type: 'SET_COSTUMERS',
    costumers
});

export const startEditCostumers = ( costumers, fbCostumers ) => {
    return (dispatch) => {
        return firebase.database().ref(`website/costumers`).update({...fbCostumers}).then(() => {
            dispatch(editCostumers( costumers ));
        })
    };
};



// set costumers

export const setCostumers = (costumers) => ({
    type: "SET_COSTUMERS",
    costumers
});

export const startSetCostumers = () => {
    return (dispatch) => {
        return firebase.database().ref(`website/costumers/`).once('value').then((snapshot) => {
            //console.log('in set homepage ============');
            const costumers = [];
            snapshot.forEach((childSnapshot) => {
                //console.log(childSnapshot.val());
                costumers.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            costumers.sort((a, b) => {
                return a.order > b.order ? 1 : -1;
            });
            dispatch(setCostumers(costumers));
            //dispatch(check());
        });
    };
};


// delete costumers

export const startDeleteCostumer = ( fbCostumers, costumers, publicid ) => {
    return (dispatch) => {
        return deleteImage(publicid).finally(() => {
            return firebase.database().ref('website/costumers').update(fbCostumers).then(() => {
                //dispatch(editCostumers( costumers ));
            })
        });
    };
};
