import database from '../firebase/firebase';



// SET_TEACHINGPAGE

export const setTeachingPage = (teachingpage) => ({
    type: "SET_TEACHINGPAGE",
    teachingpage
});

export const startSetTeachingPage = () => {
    return (dispatch) => {
        return database.ref(`website/teachingpage/teachings`).once('value').then((snapshot) => {
            const teachingpage = snapshot.val();
            const teachingsArray = [];
            Object.keys(teachingpage).map((key) => {
                const keyedTeach = {id: String(key), ...teachingpage[key]};
                teachingsArray.push(keyedTeach);
            });

            // console.log(teachingsArray);
            dispatch(setTeachingPage(teachingsArray));
        });
    };
};




// UPDATE_TEACHINGS

export const updateTeachings = (teachings) => ({
    type: 'UPDATE_TEACHINGS',
    teachings
});

export const startUpdateTeachings = (fbTeachings, teachings) => {
    return (dispatch, getState) => {
        console.log('fbTeachings', fbTeachings);
        return database.ref(`website/teachingpage/`).child(`teachings`).update(fbTeachings).then(() => {
            dispatch(updateTeachings(teachings));
            return teachings;
        })

    };
};





// UPDATE_TEACH

export const updateTeach = (teach) => ({
    type: 'UPDATE_TEACH',
    teach
});

export const startUpdateTeach = (teachData = {}) => {
    return (dispatch, getState) => {
        const {
            id = '',
            publicId = '',
            image = '',
            details = '',
            description = '',
            detailsHebrew = '',
            descriptionHebrew = '',
            order = ''
        } = teachData;
        
        const teach = {
            id,
            publicId,
            image,
            details,
            description,
            detailsHebrew,
            descriptionHebrew,
            order
        };
        return database.ref(`website/teachingpage/teachings/${id}`).update(teach).then((ref) => {
            console.log(ref);
            dispatch(updateTeach(teach));
            return id;
        });
    };
};


// UPDATE_TEACH - image

export const updateTeachImage = (teach) => ({
    type: 'UPDATE_TEACH',
    teach
});

export const startUpdateTeachImage = (teachData = {}, publicid) => {
    return (dispatch, getState) => {
        const {
            id = '',
            publicId = '',
            image = '',
            details = '',
            description = '',
            detailsHebrew = '',
            descriptionHebrew = '',
            order = ''
        } = teachData;
        
        const teach = {
            id,
            publicId,
            image,
            details,
            description,
            detailsHebrew,
            descriptionHebrew,
            order
        };
        
        var data = '';
        console.log('before fetch publicid', publicid);
        data += 'publicid=' + publicid;
        // 'http://localhost:3000/deleteImage'
        fetch('/deleteImage', {
            method: 'POST',
            body: 'publicid=' + image.publicId,
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        return database.ref(`website/teachingpage/teachings/${id}`).update(teach).then((ref) => {
            console.log(ref);
            dispatch(updateTeachImage(teach));
            return id;
        });
    };
};


// UPDATE_TEACH - update "show" state

export const showTeach = ( teach ) => ({
    type: 'UPDATE_TEACH',
    teach
});

export const startShowTeach = ( teach ) => {
    let id = teach.id;
    return (dispatch) => {
        return database.ref(`website/teachingpage/teachings/${id}`).update(teach).then(() => {
            dispatch(showTeach( teach ));
        })
    };
};





// ADD_TEACH

export const addTeach = (teach) => ({
    type: 'ADD_TEACH',
    teach
});

export const startAddTeach = (teachData = {}, order) => {
    return (dispatch, getState) => {
        const {
            publicId = '',
            image = '',
            details = '',
            description = '',
            detailsHebrew = '',
            descriptionHebrew = ''
        } = teachData;
        const eventId = "teach";
        const teach = {
            publicId,
            image,
            details,
            description,
            detailsHebrew,
            descriptionHebrew,
            order: order
        };
        return database.ref('website/teachingpage/teachings').push(teach).then((ref) => {
            
            const localTeach = {
                id: ref.key,
                ...teach
            }

            let teachings = getState().teachingpage.teachings;
            
            if (!teachings) {
                teachings = {};
            }

            teachings[ref.key] = localTeach;
            
            const teachingsArray = [];
            Object.keys(teachings).map((key) => {
                const keyedTeach = {id: String(key), ...teachings[key]};
                teachingsArray.push(keyedTeach);
            });

            // console.log(teachingsArray);

             dispatch(addTeach(teachingsArray));
             return teachingsArray;
        });
    };
};




// DELETE_TEACH

export const deleteTeach = (teach) => ({
    type: 'DELETE_TEACH',
    teach
});

export const startDeleteTeach = (teachData = {}) => {
    return (dispatch, getState) => {
        const {
            id = '',
            publicId = '',
            image = '',
            details = '',
            description = '',
            detailsHebrew = '',
            descriptionHebrew = '',
            order = ''
        } = teachData;
        
        const teach = {
            id,
            publicId,
            image,
            details,
            description,
            detailsHebrew,
            descriptionHebrew,
            order
        };

        var data = '';
        data += 'publicid=' + image.publicId;
        // 'http://localhost:3000/deleteImage'
        fetch('/deleteImage', {
            method: 'POST',
            body: 'publicid=' + image.publicId,
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        return database.ref(`website/teachingpage/teachings/${id}`).remove().then((ref) => {
            console.log(ref);
            dispatch(deleteTeach(teach));
            return id;
        });
    };
};


