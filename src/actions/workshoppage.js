import database from '../firebase/firebase';

// edit workshop

export const editWorkshopPage = ( workshoppage ) => ({
    type: 'EDIT_WORKSHOPPAGE',
    workshoppage
});

export const startEditWorkshopPage = ( fbWorkshoppage, workshoppage ) => {
    return (dispatch) => {
        return database.ref(`website/workshoppage`).update({...fbWorkshoppage}).then(() => {
            dispatch(editWorkshopPage( workshoppage ));
        })
    };
};


// edit workshop seo

export const editWorkshopPageSeo = ( seo ) => ({
    type: 'EDIT_WORKSHOPPAGE_SEO',
    seo
});

export const startEditWorkshopPageSeo = ( seo ) => {
    return (dispatch) => {
        return database.ref(`serverSeo/workshop/seo`).update(seo).then(() => {
            return database.ref(`website/workshoppage/seo`).update(seo).then(() => {
                dispatch(editWorkshopPageSeo( seo ));
            })
        })
    };
};


// set workshoppage

export const setWorkshopPage = (workshoppage) => ({
    type: "SET_WORKSHOPPAGE",
    workshoppage
});

export const startSetWorkshopPage = () => {
    return (dispatch) => {
        return database.ref(`website/workshoppage/`).once('value').then((snapshot) => {
            //console.log('in set homepage ============');
            const workshoppage = snapshot.val();
            dispatch(setWorkshopPage(workshoppage));
            //dispatch(check());
        });
    };
};





// ADD_WORKSHOP_IMAGE

export const addWorkshopImage = (images) => ({
    type: 'ADD_WORKSHOP_IMAGE',
    images
});

export const startAddWorkshopImage = (imageData = {}, order) => {
    return (dispatch, getState) => {
        const {
            publicId = '',
            src = '',
            width = '',
            height = '',
            alt = ''
        } = imageData;
        const eventId = "workshop";
        const image = {
            publicId,
            src,
            width,
            height,
            alt,
            order: order
        };
        return database.ref('website/workshoppage/workshopimages').push(image).then((ref) => {
            
            const localImage = {
                id: ref.key,
                ...image
            }

            let workshopImages = getState().workshoppage.workshopimages;

            console.log(workshopImages);
            if (!workshopImages) {
                workshopImages = {};
            }

            workshopImages[ref.key] = localImage;

            console.log(workshopImages);

            const images = [];
            Object.keys(workshopImages).map((key) => {
                const keyedImg = {id: String(key), ...workshopImages[key]};
                images.push(keyedImg);
            });

            console.log(images);

             dispatch(addWorkshopImage(images));
             return images;
        });
    };
};


// DELETE_WORKSHOP_IMAGE

export const deleteWorkshopImage = ( images ) => ({
    type: 'DELETE_WORKSHOP_IMAGE',
    images
});

export const startDeleteWorkshopImage = ( fbImages, images, publicid ) => {
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
        return database.ref().child(`website/workshoppage/workshopimages`).update(fbImages).then(() => {
            //dispatch(editImages( images, eventId, categoryId ));
        })
    };
};