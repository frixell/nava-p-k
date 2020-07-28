import database from '../firebase/firebase';

// edit cv

export const editCvPage = ( cvpage ) => ({
    type: 'EDIT_CVPAGE',
    cvpage
});

export const startEditCvPage = ( fbCvpage, cvpage ) => {
    return (dispatch) => {
        return database.ref(`website/cvpage`).update({...fbCvpage}).then(() => {
            dispatch(editCvPage( cvpage ));
        })
    };
};


// edit cv seo

export const editCvPageSeo = ( seo ) => ({
    type: 'EDIT_CVPAGE_SEO',
    seo
});

export const startEditCvPageSeo = ( seo ) => {
    return (dispatch) => {
        return database.ref(`serverSeo/cv/seo`).update(seo).then(() => {
            return database.ref(`website/cvpage/seo`).update(seo).then(() => {
                dispatch(editCvPageSeo( seo ));
            })
        })
    };
};


// set cvpage

export const setCvPage = (cvpage) => ({
    type: "SET_CVPAGE",
    cvpage
});

export const startSetCvPage = () => {
    return (dispatch) => {
        return database.ref(`website/cvpage/`).once('value').then((snapshot) => {
            //console.log('in set homepage ============');
            const cvpage = snapshot.val();
            dispatch(setCvPage(cvpage));
            //dispatch(check());
        });
    };
};





// ADD_CV_IMAGE

export const addCvImage = (images) => ({
    type: 'ADD_CV_IMAGE',
    images
});

export const startAddCvImage = (imageData = {}, order) => {
    return (dispatch, getState) => {
        const {
            publicId = '',
            src = '',
            width = '',
            height = '',
            alt = ''
        } = imageData;
        const eventId = "cv";
        const image = {
            publicId,
            src,
            width,
            height,
            alt,
            order: order
        };
        return database.ref('website/cvpage/cvimages').push(image).then((ref) => {
            
            const localImage = {
                id: ref.key,
                ...image
            }

            let cvImages = getState().cvpage.cvimages;

            console.log(cvImages);
            if (!cvImages) {
                cvImages = {};
            }

            cvImages[ref.key] = localImage;

            console.log(cvImages);

            const images = [];
            Object.keys(cvImages).map((key) => {
                const keyedImg = {id: String(key), ...cvImages[key]};
                images.push(keyedImg);
            });

            console.log(images);

             dispatch(addCvImage(images));
             return images;
        });
    };
};


// DELETE_CV_IMAGE

export const deleteCvImage = ( images ) => ({
    type: 'DELETE_CV_IMAGE',
    images
});

export const startDeleteCvImage = ( fbImages, images, publicid ) => {
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
        return database.ref().child(`website/cvpage/cvimages`).update(fbImages).then(() => {
            //dispatch(editImages( images, eventId, categoryId ));
        })
    };
};