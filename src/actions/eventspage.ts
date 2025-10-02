// @ts-nocheck
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import 'firebase/database';

// Types
interface Category {
    id: string;
    name: string;
    seo?: SeoData;
    [key: string]: any;
}

interface Subcategory {
    id: string;
    name: string;
    visible: boolean;
    categories: { [categoryId: string]: boolean | number };
    seo?: SeoData;
    [key: string]: any;
}

interface EventItem {
    id: string;
    name: string;
    nameEng: string;
    text: string;
    textEng: string;
    image: string;
    visible: boolean;
    showLines?: boolean;
    categories: { [categoryId: string]: boolean | number };
    subcategories: { [subcategoryId: string]: boolean | number };
    images: EventImage[];
    seo?: SeoData;
}

interface EventImage {
    id: string;
    publicId: string;
    imageUrl: string;
    imageWidth: string;
    imageHeight: string;
    altText: string;
    eventsIds: { [eventId: string]: boolean | number };
}

interface SeoData {
    [key: string]: any;
}

type EventsActionTypes =
    | { type: 'SET_CATEGORIES'; categories: Category[] }
    | { type: 'SET_SUBCATEGORIES'; subcategories: Subcategory[]; categoryId: string }
    | { type: 'SET_ALL_SUBCATEGORIES'; subcategories: Subcategory[] }
    | { type: 'SET_ITEMS'; items: EventItem[]; categoryId: string }
    | { type: 'SET_ALL_EVENTS'; items: EventItem[] }
    | { type: 'SET_IMAGES'; images: EventImage[]; eventId: string; categoryId: string; itemLocation: number }
    | { type: 'ADD_CATEGORY'; category: Category }
    | { type: 'ADD_SUBCATEGORY'; subcategories: Subcategory[]; categoryId: string }
    | { type: 'ADD_ITEM'; items: EventItem[]; categoryId: string }
    | { type: 'ADD_IMAGE'; images: EventImage[]; eventId: string; categoryId: string }
    | { type: 'EDIT_EXPENSE'; id: string; updates: any } // Legacy action type
    | { type: 'SET_CATEGORY_ID'; id: string }
    | { type: 'SET_SUBCATEGORY_ID'; id: string }
    | { type: 'EDIT_SEO'; seo: SeoData; categoryId: string }
    | { type: 'EDIT_SUB_SEO'; seo: SeoData; categoryId: string }
    | { type: 'EDIT_EVENT_SEO'; seo: SeoData; categoryId: string; eventId: string }
    | { type: 'EDIT_CATEGORY'; category: Category }
    | { type: 'EDIT_SUBCATEGORIES'; subcategories: Subcategory[]; categoryId: string }
    | { type: 'EDIT_EVENT'; category: any } // Legacy
    | { type: 'TOGGLE_SHOW_EVENT'; categoryId: string; subcategoryId: string; eventId: string; visible: boolean }
    | { type: 'TOGGLE_ALL_SHOW_EVENT'; categoryId: string; subcategoryId: string; eventId: string; visible: boolean }
    | { type: 'TOGGLE_SHOW_SUBCATEGORY'; categoryId: string; subcategoryId: string; visible: boolean }
    | { type: 'TOGGLE_ALL_SHOW_SUBCATEGORY'; categoryId: string; subcategoryId: string; visible: boolean }
    | { type: 'EDIT_EVENTS'; events: EventItem[]; categoryId: string }
    | { type: 'EDIT_IMAGES'; images: EventImage[]; eventId: string; categoryId: string }
    | { type: 'DELETE_IMAGE'; images: EventImage[]; eventId: string; categoryId: string };

type RootState = any; // Define your full state type
type EventsThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, EventsActionTypes>;

// SET ACTIONS
export const setCategories = (categories: Category[]): EventsActionTypes => ({
    type: 'SET_CATEGORIES',
    categories
});

export const startSetCategories = (): EventsThunk<Promise<void>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        return firebase.database().ref('eventsCategories').once('value').then((snapshot) => {
            const categories: Category[] = [];
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key) {
                    dispatch(startSetSubcategories(childSnapshot.key));
                    categories.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                }
            });
            dispatch(setCategories(categories));
        });
    };
};

export const setSubcategories = (subcategories: Subcategory[], categoryId: string): EventsActionTypes => ({
    type: 'SET_SUBCATEGORIES',
    subcategories,
    categoryId
});

export const startSetSubcategories = (categoryId: string): EventsThunk<Promise<Subcategory[]>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        return firebase.database().ref('eventsSubcategories')
            .orderByChild(`categories/${categoryId}`)
            .equalTo(true)
            .once('value')
            .then((snapshot) => {
                const subcategories: Subcategory[] = [];
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key) {
                        subcategories.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    }
                });
                dispatch(setSubcategories(subcategories, categoryId));
                return subcategories;
            });
    };
};

export const setAllSubcategories = (subcategories: Subcategory[]): EventsActionTypes => ({
    type: 'SET_ALL_SUBCATEGORIES',
    subcategories
});

export const startSetAllSubcategories = (): EventsThunk<Promise<void>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        return firebase.database().ref('eventsSubcategories').once('value').then((snapshot) => {
            const subcategories: Subcategory[] = [];
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key) {
                    subcategories.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                }
            });
            dispatch(setAllSubcategories(subcategories));
        });
    };
};

export const setItems = (items: EventItem[], categoryId: string): EventsActionTypes => ({
    type: 'SET_ITEMS',
    items,
    categoryId
});

export const startSetItems = (categoryId: string): EventsThunk<Promise<EventItem[]>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        return firebase.database().ref('eventsItems')
            .orderByChild(`categories/${categoryId}`)
            .equalTo(true)
            .once('value')
            .then((snapshot) => {
                const items: EventItem[] = [];
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key) {
                        items.push({
                            id: childSnapshot.key,
                            images: [],
                            ...childSnapshot.val()
                        });
                    }
                });
                dispatch(setItems(items, categoryId));
                return items;
            });
    };
};

export const setAllEvents = (items: EventItem[]): EventsActionTypes => ({
    type: 'SET_ALL_EVENTS',
    items
});

export const startSetAllEvents = (): EventsThunk<Promise<void>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        return firebase.database().ref('eventsItems').once('value').then((snapshot) => {
            const events: EventItem[] = [];
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key) {
                    events.push({
                        id: childSnapshot.key,
                        images: [],
                        ...childSnapshot.val()
                    });
                }
            });
            dispatch(setAllEvents(events));
        });
    };
};

export const setImages = (
    images: EventImage[], 
    eventId: string, 
    categoryId: string, 
    itemLocation: number
): EventsActionTypes => ({
    type: 'SET_IMAGES',
    images,
    eventId,
    categoryId,
    itemLocation
});

export const startSetImages = (
    eventId: string, 
    categoryId: string, 
    itemLocation: number
): EventsThunk<Promise<EventImage[]>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        return firebase.database().ref('eventsImages')
            .orderByChild(`eventsIds/${eventId}`)
            .equalTo(true)
            .once('value')
            .then((snapshot) => {
                const images: EventImage[] = [];
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key) {
                        images.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    }
                });
                return images;
            });
    };
};

// ADD ACTIONS
export const addCategory = (category: Category): EventsActionTypes => ({
    type: 'ADD_CATEGORY',
    category
});

export const startAddCategory = (categoryData: Partial<Category> = {}): EventsThunk<Promise<void>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        const { name = '' } = categoryData;
        const category = { name };
        return firebase.database().ref('eventsCategories').push(category).then((ref) => {
            if (ref.key) {
                dispatch(addCategory({
                    id: ref.key,
                    ...category
                }));
            }
        });
    };
};

export const addSubcategory = (subcategories: Subcategory[], categoryId: string): EventsActionTypes => ({
    type: 'ADD_SUBCATEGORY',
    subcategories,
    categoryId
});

export const startAddSubcategory = (
    subcategoryData: Partial<Subcategory> = {}, 
    order: number
): EventsThunk<Promise<Subcategory[] | undefined>> => {
    return (dispatch: Dispatch<EventsActionTypes>, getState) => {
        const {
            name = '',
            visible = false,
            categories = {}
        } = subcategoryData;
        
        const categoryId = Object.keys(categories)[0];
        if (!categoryId) return Promise.resolve(undefined);
        
        const subcategories: Subcategory[] = getState().eventspage[categoryId] || [];
        const subcategory = {
            name,
            visible,
            categories: {
                [categoryId]: true,
                [`${categoryId}order`]: order
            }
        };
        
        return firebase.database().ref('eventsSubcategories').push(subcategory).then((ref) => {
            if (ref?.key) {
                const localSubcategory: Subcategory = {
                    id: ref.key,
                    ...subcategory
                };
                const updatedSubcategories = [...subcategories, localSubcategory];
                dispatch(addSubcategory(updatedSubcategories, categoryId));
                return updatedSubcategories;
            }
            return undefined;
        });
    };
};

// Modern fetch utility for image deletion
const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        const response = await fetch('/deleteImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `publicid=${encodeURIComponent(publicId)}`
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete image: ${response.status}`);
        }
        
        const result = await response.text();
        if (process.env.NODE_ENV === 'development') {
            console.log('Image deletion result:', result);
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error deleting image:', error);
        }
        throw error;
    }
};

// SEO ACTIONS
export const editSeo = (seo: SeoData, categoryId: string): EventsActionTypes => ({
    type: 'EDIT_SEO',
    seo,
    categoryId
});

export const startEditSeo = (
    seo: SeoData, 
    categoryId: string, 
    link: string
): EventsThunk<Promise<void>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        return firebase.database().ref(`serverSeo/${link}/seo`).update(seo).then(() => {
            return firebase.database().ref(`eventsCategories/${categoryId}/seo`).update(seo).then(() => {
                dispatch(editSeo(seo, categoryId));
            });
        });
    };
};

// TOGGLE ACTIONS
export const toggleShowEvent = (
    categoryId: string, 
    subcategoryId: string, 
    eventId: string, 
    visible: boolean
): EventsActionTypes => ({
    type: 'TOGGLE_SHOW_EVENT',
    categoryId,
    subcategoryId,
    eventId,
    visible
});

export const toggleAllShowEvent = (
    categoryId: string, 
    subcategoryId: string, 
    eventId: string, 
    visible: boolean
): EventsActionTypes => ({
    type: 'TOGGLE_ALL_SHOW_EVENT',
    categoryId,
    subcategoryId,
    eventId,
    visible
});

export const startToggleShowEvent = (
    categoryId: string, 
    subcategoryId: string, 
    eventId: string, 
    visible: boolean
): EventsThunk<Promise<string>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        const visibleObj = { visible };
        return firebase.database().ref().child(`eventsItems/${eventId}`).update(visibleObj).then(() => {
            dispatch(toggleShowEvent(categoryId, subcategoryId, eventId, visible));
            dispatch(toggleAllShowEvent(categoryId, subcategoryId, eventId, visible));
            return 'done';
        });
    };
};

export const toggleShowSubcategory = (
    categoryId: string, 
    subcategoryId: string, 
    visible: boolean
): EventsActionTypes => ({
    type: 'TOGGLE_SHOW_SUBCATEGORY',
    categoryId,
    subcategoryId,
    visible
});

export const toggleAllShowSubcategory = (
    categoryId: string, 
    subcategoryId: string, 
    visible: boolean
): EventsActionTypes => ({
    type: 'TOGGLE_ALL_SHOW_SUBCATEGORY',
    categoryId,
    subcategoryId,
    visible
});

export const startToggleShowSubcategory = (
    categoryId: string, 
    subcategoryId: string, 
    visible: boolean
): EventsThunk<Promise<string>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        const visibleObj = { visible };
        return firebase.database().ref().child(`eventsSubcategories/${subcategoryId}`).update(visibleObj).then(() => {
            dispatch(toggleShowSubcategory(categoryId, subcategoryId, visible));
            dispatch(toggleAllShowSubcategory(categoryId, subcategoryId, visible));
            return 'done';
        });
    };
};

// DELETE ACTIONS
export const deleteImage = (
    images: EventImage[], 
    eventId: string, 
    categoryId: string
): EventsActionTypes => ({
    type: 'DELETE_IMAGE',
    images,
    eventId,
    categoryId
});

export const startDeleteImage = (
    fbImages: any, 
    images: EventImage[], 
    eventId: string, 
    categoryId: string, 
    publicId: string
): EventsThunk<Promise<void>> => {
    return async (dispatch: Dispatch<EventsActionTypes>) => {
        try {
            // Delete from Cloudinary first
            await deleteImageFromCloudinary(publicId);
            
            // Then update Firebase
            return firebase.database().ref().child('eventsImages').update(fbImages).then(() => {
                dispatch(editImages(images, eventId, categoryId));
            });
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error in startDeleteImage:', error);
            }
            throw error;
        }
    };
};

// EDIT ACTIONS
export const editImages = (
    images: EventImage[], 
    eventId: string, 
    categoryId: string
): EventsActionTypes => ({
    type: 'EDIT_IMAGES',
    images,
    eventId,
    categoryId
});

export const startEditImages = (
    fbImages: any, 
    images: EventImage[], 
    eventId: string, 
    categoryId: string
): EventsThunk<Promise<void>> => {
    return (dispatch: Dispatch<EventsActionTypes>) => {
        return firebase.database().ref().child('eventsImages').update(fbImages).then(() => {
            dispatch(editImages(images, eventId, categoryId));
        });
    };
};

// ID SETTERS
export const setCategoryId = (id: string): EventsActionTypes => ({
    type: 'SET_CATEGORY_ID',
    id
});

export const setSubcategoryId = (id: string): EventsActionTypes => ({
    type: 'SET_SUBCATEGORY_ID',
    id
});

// Export types for use in other files
export type {
    Category,
    Subcategory,
    EventItem,
    EventImage,
    SeoData,
    EventsActionTypes
};
