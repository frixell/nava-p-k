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

export const setAboutPage = (aboutpage) => ({
    type: "SET_ABOUTPAGE",
    aboutpage
});

export const startSetAboutPage = () => {
    return (dispatch) => {
        return database.ref(`website/aboutpage/`).once('value').then((snapshot) => {
            //console.log('in set homepage ============');
            const aboutpage = snapshot.val();
            dispatch(setAboutPage(aboutpage));
            return aboutpage;
        });
    };
};





// SAVE_ABOUT_IMAGE

export const saveAboutImage = (image) => ({
    type: 'SAVE_ABOUT_IMAGE',
    image
});

export const startSaveAboutImage = (imageData = {}, publicid) => {
    return (dispatch, getState) => {
        const {
            publicId = '',
            src = '',
            width = '',
            height = '',
            alt = ''
        } = imageData;
        
        const image = {
            publicId,
            src,
            width,
            height,
            alt,
            order: 0
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
        
        return database.ref('website/aboutpage/image').update(image).then((ref) => {
             dispatch(saveAboutImage(image));
             return image;
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
            console.log(data);
        });
        return database.ref().child(`website/aboutpage/aboutimages`).update(fbImages).then(() => {
            //dispatch(editImages( images, eventId, categoryId ));
        })
    };
};