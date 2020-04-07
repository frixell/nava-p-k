//import database from '../firebase/firebase';
var firebase = require("firebase/app");
require("firebase/database");

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
        var method = 'POST';
        //var action = 'http://localhost:3000/deleteImage';
        var action = '/deleteImage';
        var xhr = new XMLHttpRequest();
        var data = '';
        data += 'publicid=' + publicid;
        xhr.open(method, action);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
        xhr.send(data);
        xhr.addEventListener('load', function (e) {
            var data = e.target.responseText;
            console.log(data);
        });
        return firebase.database().ref('website/costumers').update(fbCostumers).then(() => {
            //dispatch(editCostumers( costumers ));
        })
    };
};