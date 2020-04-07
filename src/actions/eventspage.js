//import database from '../firebase/firebase';
var firebase = require("firebase/app");
require("firebase/database");

/////////////////////////////////////////// .   set     . ///////////////////////////////////////////////////



// SET_CATEGORIES

export const setCategories = (categories) => ({
    type: "SET_CATEGORIES",
    categories
});

export const startSetCategories = () => {
    return (dispatch) => {
        return firebase.database().ref('eventsCategories').once('value').then((snapshot) => {
            const categories = [];
            snapshot.forEach((childSnapshot) => {
                dispatch(startSetSubcategories(childSnapshot.key));
                categories.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            dispatch(setCategories(categories));
        });
    };
};


// SET_SUBCATEGORIES

export const setSubcategories = (subcategories, categoryId) => ({
    type: "SET_SUBCATEGORIES",
    subcategories,
    categoryId
});

export const startSetSubcategories = (categoryId) => {
    return (dispatch) => {
        return firebase.database().ref('eventsSubcategories').orderByChild(`categories/${categoryId}`).equalTo(true).once('value').then((snapshot) => {
            const subcategories = [];
            snapshot.forEach((childSnapshot) => {
                subcategories.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            dispatch(setSubcategories(subcategories, categoryId ));
            return subcategories;
        });
    };
};



// SET_ALL_SUBCATEGORIES


export const setAllSubcategories = (subcategories) => ({
    type: "SET_ALL_SUBCATEGORIES",
    subcategories
});

export const startSetAllSubcategories = () => {
    return (dispatch) => {
        return firebase.database().ref('eventsSubcategories').once('value').then((snapshot) => {
            const subcategories = [];
            snapshot.forEach((childSnapshot) => {
                subcategories.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            dispatch(setAllSubcategories(subcategories));
        });
    };
};





// SET_ITEMS

export const setItems = (items, categoryId) => ({
    type: "SET_ITEMS",
    items,
    categoryId
});

export const startSetItems = (categoryId) => {
    return (dispatch) => {
        return firebase.database().ref('eventsItems').orderByChild(`categories/${categoryId}`).equalTo(true).once('value').then((snapshot) => {
            const items = [];
            snapshot.forEach((childSnapshot) => {
                items.push({
                    id: childSnapshot.key,
                    images: [],
                    ...childSnapshot.val()
                });
            });
            dispatch(setItems(items, categoryId ));
            return items;
        });
    };
};



// SET_ALL_EVENTS


export const setAllEvents = (items) => ({
    type: "SET_ALL_EVENTS",
    items
});

export const startSetAllEvents = () => {
    return (dispatch) => {
        return firebase.database().ref('eventsItems').once('value').then((snapshot) => {
            const events = [];
            snapshot.forEach((childSnapshot) => {
                events.push({
                    id: childSnapshot.key,
                    images: [],
                    ...childSnapshot.val()
                });
            });
            dispatch(setAllEvents(events));
        });
    };
};





// SET_IMAGES

export const setImages = ( images, eventId, categoryId, itemLocation ) => ({
    type: "SET_IMAGES",
    images,
    eventId,
    categoryId,
    itemLocation
});

export const startSetImages = ( eventId, categoryId, itemLocation ) => {
    return (dispatch) => {
        return firebase.database().ref('eventsImages').orderByChild(`eventsIds/${eventId}`).equalTo(true).once('value').then((snapshot) => {
            const images = [];
            snapshot.forEach((childSnapshot) => {
                images.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            //dispatch(setImages( images, eventId, categoryId, itemLocation ));
            return images;
        });
    };
};












//////////////////////////////////////////////// .   add    . ///////////////////////////////////////////





// ADD_CATEGORY

export const addCategory = (category) => ({
    type: 'ADD_CATEGORY',
    category
});

export const startAddCategory = (categoryData = {}) => {
    return (dispatch) => {
        const {
            name = ''
        } = categoryData;
        const category = {name};
        return firebase.database().ref('eventsCategories').push(category).then((ref) => {
            dispatch(addCategory({
                id: ref.key,
                ...category
            }));
        });
    };
};








// ADD_SUBCATEGORY

export const addSubcategory = (subcategories, categoryId) => ({
    type: 'ADD_SUBCATEGORY',
    subcategories,
    categoryId
});

export const startAddSubcategory = (subcategoryData = {}, order) => {
    return (dispatch, getState) => {
        const {
            name = '',
            visible = false,
            categories = {}
        } = subcategoryData;
        const categoryId = Object.keys(categories)[0];
        const subcategories = getState().eventspage[categoryId];
        const subcategory = {
            name,
            visible,
            categories: {
                [categoryId]: true,
                [categoryId+'order']: order
            }
        };
        return firebase.database().ref('eventsSubcategories').push(subcategory).then((ref) => {
            if(ref) {
                const localSubcategory = {
                    id: ref.key,
                    ...subcategory
                }
                subcategories.push(localSubcategory);
                dispatch(addSubcategory(subcategories, categoryId));
                return subcategories;
            }
            
        });
    };
};


// ADD_ITEM

export const addItem = (items, categoryId) => ({
    type: 'ADD_ITEM',
    items,
    categoryId
});

export const startAddItem = (itemData = {}, categoryId, catOrder, subcategoryId, order) => {
    return (dispatch, getState) => {
        const {
            name = '',
            nameEng = '',
            text = '',
            textEng = '',
            image = '',
            visible = false,
            categories = {},
            subcategories = {}
        } = itemData;
        const items = getState().eventspage[categoryId+'items'];
        const item = {
            name,
            nameEng,
            text,
            textEng,
            image,
            visible,
            categories,
            subcategories
        };
        return firebase.database().ref('eventsItems').push(item).then((ref) => {
            if(ref) {
                const localItem = {
                    id: ref.key,
                    ...item
                }
                items.push(localItem);
                dispatch(addItem(items, categoryId));
                return items;
            }
            
        });
    };
};



// ADD_IMAGE

export const addImage = (images, eventId, categoryId) => ({
    type: 'ADD_IMAGE',
    images,
    eventId,
    categoryId
});

export const startAddImage = (imageData = {}, categoryId, order) => {
    return (dispatch, getState) => {
        const {
            publicId = '',
            imageUrl = '',
            imageWidth = '',
            imageHeight = '',
            altText = '',
            events = {}
        } = imageData;
        const eventId = Object.keys(events)[0];
        const image = {
            publicId,
            imageUrl,
            imageWidth,
            imageHeight,
            altText,
            eventsIds: {
                [eventId]: true,
                [eventId+'order']: order
            }
        };
        return firebase.database().ref('eventsImages').push(image).then((ref) => {
            
            const localImage = {
                id: ref.key,
                ...image
            }

            const catItems = getState().eventspage[categoryId+'items'];
            let itemLocation = 0;
            catItems.map((item, index) => {
                if (item.id === eventId) {
                    itemLocation = index;
                }
            });
            let images = [];
            if ( catItems[itemLocation].images ) {
                images = catItems[itemLocation].images;
            }
            images.push({
                id: ref.key,
                ...image
            });
             dispatch(addImage(images, eventId, categoryId));
             return images;
        });
    };
};








////////////////////////////////////////// . update . ////////////////////////////////////////////



//UPDATE_EVENT_IMAGE

export const updateEventImage = ( id, image ) => ({
    type: 'EDIT_EXPENSE',
    id,
    updates
});

export const startUpdateEventImage = ( id, image ) => {
    return (dispatch, getState) => {
        return firebase.database().ref(`eventsItems/${id}`).update(image).then((res) => {
            //dispatch(updateEventImage( id, updates ));
        })
    };
};



//SET_CATEGORY_ID

export const setCategoryId = ( id ) => ({
    type: 'SET_CATEGORY_ID',
    id
});

//SET_SUBCATEGORY_ID

export const setSubcategoryId = ( id ) => ({
    type: 'SET_SUBCATEGORY_ID',
    id
});






// EDIT_SEO

export const editSeo = ( seo, categoryId ) => ({
    type: 'EDIT_SEO',
    seo,
    categoryId
});

export const startEditSeo = ( seo, categoryId, link ) => {
    return (dispatch) => {
        console.log('in seo update');
        console.log(link);
        return firebase.database().ref(`serverSeo/${link}/seo`).update(seo).then(() => {
            return firebase.database().ref(`eventsCategories/${categoryId}/seo`).update(seo).then(() => {
                dispatch(editSeo( seo, categoryId ));
            })
        })
    };
};


// EDIT__SUB_SEO

export const editSubSeo = ( seo, categoryId, subcategoryId ) => ({
    type: 'EDIT_SUB_SEO',
    seo,
    categoryId
});

export const startEditSubSeo = ( seo, categoryId, subcategoryId, link ) => {
    return (dispatch, getState) => {
        console.log('in sub seo update');
        console.log(link);
        return firebase.database().ref(`serverSeo/${link}/seo`).update(seo).then(() => {
            return firebase.database().ref(`eventsSubcategories/${subcategoryId}/seo`).update(seo).then(() => {
                const eventspage = getState().eventspage;
                eventspage[categoryId].map((subcategory, index) => {
                    if (subcategory.id === subcategoryId) {
                        eventspage[categoryId][index].seo = seo;
                    }
                })
                dispatch(editSubCategories( eventspage[categoryId], categoryId ));
            })
        })
    };
};



// EDIT_EVENT_SEO

export const editEventSeo = ( seo, categoryId, eventId ) => ({
    type: 'EDIT_EVENT_SEO',
    seo,
    categoryId,
    eventId
});

export const startEditEventSeo = ( seo, categoryId, eventId, link) => {
    return (dispatch) => {
        return firebase.database().ref(`serverSeo/${link}/seo`).update(seo).then(() => {
            return firebase.database().ref(`eventsItems/${eventId}/seo`).update(seo).then(() => {
                dispatch(editEventSeo( seo, categoryId, eventId ));
            })
        })
    };
};




// EDIT_CATEGORY

export const editCategory = ( category ) => ({
    type: 'EDIT_CATEGORY',
    category
});

export const startEditCategory = ( category ) => {
    return (dispatch) => {
        return firebase.database().ref(`eventsCategories/${category.id}`).update(category).then(() => {
            dispatch(editCategory( category ));
        })
    };
};


// EDIT_SUBCATEGORIES

export const editSubCategories = ( subcategories, categoryId ) => ({
    type: 'EDIT_SUBCATEGORIES',
    subcategories,
    categoryId
});

export const startEditSubCategories = ( fbSubcategories, subcategories, categoryId ) => {
    return (dispatch) => {
        return firebase.database().ref().child(`eventsSubcategories`).update(fbSubcategories).then(() => {
            dispatch(editSubCategories( subcategories, categoryId ));
        })
    };
};



// EDIT_EVENT

export const editEvent = ( eventName, eventText, eventShowLines, eventId ) => ({
    type: 'EDIT_EVENT',
    category
});

export const startEditEvent = ( eventName, eventNameEng, eventText, eventTextEng, eventShowLines, eventId ) => {
    const event = {
        name: eventName,
        text: eventText,
        nameEng: eventNameEng,
        textEng: eventTextEng,
        showLines: eventShowLines
    }
    return (dispatch) => {
        return firebase.database().ref(`eventsItems/${eventId}`).update(event).then(() => {
            //dispatch(editCategory( eventName, eventText, eventShowLines, eventId ));
        })
    };
};



// startHookSubcategory

export const startHookSubcategory = (  fbSubcategoriesToUpdate, fbEventsToUpdate  ) => {
    return (dispatch) => {
        return firebase.database().ref().child(`eventsSubcategories`).update(fbSubcategoriesToUpdate).then(() => {
                firebase.database().ref().child(`eventsItems`).update(fbEventsToUpdate).then(() => {
                    //dispatch(startSetAllSubcategories());
                    //dispatch(startSetAllEvents());
                    return 'done';
                })
        })
    };
};


// startHookEvent

export const startHookEvent = ( fbEventsToUpdate ) => {
    return (dispatch) => {
        return firebase.database().ref().child(`eventsItems`).update(fbEventsToUpdate).then(() => {
            //dispatch(startSetAllSubcategories());
            //dispatch(startSetAllEvents());
            return 'done';
        })
    };
};


// TOGGLE_SHOW_EVENT
// TOGGLE_ALL_SHOW_EVENT
// startToggleShowEvent

export const toggleShowEvent = ( categoryId, subcategoryId, eventId, visible ) => ({
    type: 'TOGGLE_SHOW_EVENT',
    categoryId,
    subcategoryId,
    eventId,
    visible
});

export const toggleAllShowEvent = ( categoryId, subcategoryId, eventId, visible ) => ({
    type: 'TOGGLE_ALL_SHOW_EVENT',
    categoryId,
    subcategoryId,
    eventId,
    visible
});

export const startToggleShowEvent = ( categoryId, subcategoryId, eventId, visible ) => {
    const visibleObj = {
        visible: visible
    };
    return (dispatch) => {
        return firebase.database().ref().child(`eventsItems/${eventId}`).update(visibleObj).then(() => {
            dispatch(toggleShowEvent( categoryId, subcategoryId, eventId, visible ));
            dispatch(toggleAllShowEvent( categoryId, subcategoryId, eventId, visible ));
            return 'done';
        })
    };
};

// TOGGLE_SHOW_SUBCATEGORY
// TOGGLE_ALL_SHOW_SUBCATEGORY
// startToggleShowSubcategory

export const toggleShowSubcategory = ( categoryId, subcategoryId, visible ) => ({
    type: 'TOGGLE_SHOW_SUBCATEGORY',
    categoryId,
    subcategoryId,
    visible
});

export const toggleAllShowSubcategory = ( categoryId, subcategoryId, visible ) => ({
    type: 'TOGGLE_ALL_SHOW_SUBCATEGORY',
    categoryId,
    subcategoryId,
    visible
});


export const startToggleShowSubcategory = ( categoryId, subcategoryId, visible ) => {
    const visibleObj = {
        visible: visible
    };
    return (dispatch) => {
        return firebase.database().ref().child(`eventsSubcategories/${subcategoryId}`).update(visibleObj).then(() => {
            dispatch(toggleShowSubcategory( categoryId, subcategoryId, visible ));
            dispatch(toggleAllShowSubcategory( categoryId, subcategoryId, visible ));
            return 'done';
        })
    };
};




// EDIT_EVENTS


export const editEvents = ( events, categoryId ) => ({
    type: 'EDIT_EVENTS',
    events,
    categoryId
});

export const startEditEvents = ( fbEvents, events, categoryId ) => {
    return (dispatch) => {
        return firebase.database().ref().child(`eventsItems`).update(fbEvents).then(() => {
            dispatch(editEvents( events, categoryId ));
        })
    };
};




// EDIT_IMAGES


export const editImages = ( images, eventId, categoryId ) => ({
    type: 'EDIT_IMAGES',
    images,
    eventId,
    categoryId
});

export const startEditImages = ( fbImages, images, eventId, categoryId ) => {
    return (dispatch) => {
        return firebase.database().ref().child(`eventsImages`).update(fbImages).then(() => {
            dispatch(editImages( images, eventId, categoryId ));
        })
    };
};



// DELETE_IMAGE

export const deleteImage = ( images, eventId, categoryId ) => ({
    type: 'DELETE_IMAGE',
    images,
    eventId,
    categoryId
});

export const startDeleteImage = ( fbImages, images, eventId, categoryId, publicid ) => {
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
        });
        return firebase.database().ref().child(`eventsImages`).update(fbImages).then(() => {
            dispatch(editImages( images, eventId, categoryId ));
        })
    };
};