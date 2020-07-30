import database from '../firebase/firebase';



// EDIT_TEACHINGPAGE_SEO

export const editTeachingPageSeo = ( seo ) => ({
    type: 'EDIT_TEACHINGPAGE_SEO',
    seo
});

export const startEditTeachingPageSeo = ( seo ) => {
    return (dispatch) => {
        return database.ref(`serverSeo/teaching/seo`).update(seo).then(() => {
            return database.ref(`website/teachingpage/seo`).update(seo).then(() => {
                dispatch(editTeachingPageSeo( seo ));
            })
        })
    };
};




// SET_TEACHINGPAGE

export const setTeachingPage = (teachings, seo) => ({
    type: "SET_TEACHINGPAGE",
    teachings,
    seo
});

export const startSetTeachingPage = () => {
    return (dispatch) => {
        return database.ref(`website/teachingpage`).once('value').then((snapshot) => {
            const teachingpage = snapshot.val();
            const teachingsArray = [];
            Object.keys(teachingpage.teachings).map((key) => {
                const keyedTeach = {id: String(key), ...teachingpage.teachings[key]};
                teachingsArray.push(keyedTeach);
            });

            // console.log(teachingsArray);
            dispatch(setTeachingPage(teachingsArray, teachingpage.seo));
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

            teachings.push(localTeach);
            
            const teachingsArray = [];
            Object.keys(teachings).map((key) => {
                const keyedTeach = {id: String(key), ...teachings[key]};
                teachingsArray.push(keyedTeach);
            });

             dispatch(addTeach(localTeach));
             return teachingsArray;
        });
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
        
        if (publicid) {
            // 'http://localhost:3000/deleteImage'
            fetch('/deleteImage', {
                method: 'POST',
                body: 'publicid=' + publicid,
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }
        
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
