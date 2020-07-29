import database from '../firebase/firebase';

// edit about

export const editAboutPage = ( aboutpage ) => ({
    type: 'EDIT_ABOUTPAGE',
    aboutpage
});

export const startEditAboutPage = ( fbAboutpage, aboutpage ) => {
    return (dispatch) => {
        return database.ref(`website/aboutpage`).update({...fbAboutpage}).then(() => {
            dispatch(editAboutPage( aboutpage ));
        })
    };
};


// edit about seo

export const editAboutPageSeo = ( seo ) => ({
    type: 'EDIT_ABOUTPAGE_SEO',
    seo
});

export const startEditAboutPageSeo = ( seo ) => {
    return (dispatch) => {
        return database.ref(`serverSeo/about/seo`).update(seo).then(() => {
            return database.ref(`website/aboutpage/seo`).update(seo).then(() => {
                dispatch(editAboutPageSeo( seo ));
            })
        })
    };
};


// set aboutpage

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



export const showTeach = ( teach ) => ({
    type: 'UPDATE_TEACH',
    teach
});

export const startShowTeach = ( teach ) => {
    let id = teach.id;
    console.log('actions- teach- ', teach);
    return (dispatch) => {
        return database.ref(`website/teachingpage/teachings/${id}`).update(teach).then(() => {
            dispatch(showTeach( teach ));
        })
    };
};



export const editTeach = ( teach ) => ({
    type: 'EDIT_TEACH',
    teach
});

export const startEditTeach = ( teachObj ) => {
    //console.log('project', projectObj);
    let id = projectObj.project.id;
    let teach = teachObj.teach;
    //console.log(id);
    //console.log(project);
    return (dispatch) => {
        return database.ref(`website/teachingpage/teachings/${id}`).update(teach).then(() => {
            dispatch(editTeach( teach ));
        })
    };
};



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
        
        console.log('image:', image);
        var method = 'POST';
        var action = 'http://localhost:3000/deleteImage';
        //var action = '/deleteImage';
        var xhr = new XMLHttpRequest();
        var data = '';
        data += 'publicid=' + image.publicId;
        // xhr.open(method, action);
        // xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        // xhr.send(data);
        // xhr.addEventListener('load', function (e) {
        //     var data = e.target.responseText;
        //     console.log('xhr data', data);
        // });
        
        
        fetch('http://localhost:3000/deleteImage', {
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

            // console.log(teachings);
            if (!teachings) {
                teachings = {};
            }

            teachings[ref.key] = localTeach;

            // console.log(teachings);

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


// DELETE_ABOUT_IMAGE

export const deleteAboutImage = ( images ) => ({
    type: 'DELETE_ABOUT_IMAGE',
    images
});

export const startDeleteAboutImage = ( fbImages, images, publicid ) => {
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
            // console.log(data);
        });
        return database.ref().child(`website/aboutpage/aboutimages`).update(fbImages).then(() => {
            //dispatch(editImages( images, eventId, categoryId ));
        })
    };
};