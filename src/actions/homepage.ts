// @ts-nocheck
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as firebase from 'firebase/app';
import 'firebase/database';

// Types
interface Homepage {
    [key: string]: any;
    tell?: { [key: string]: TellData };
    seo?: SeoData;
}

interface SeoData {
    [key: string]: any;
}

interface TellData {
    name: string;
    position: string;
    company: number;
    createdAt: number;
    text: string;
    order: number;
}

type HomepageActionTypes = 
    | { type: 'EDIT_HOMEPAGE'; homepage: Homepage }
    | { type: 'EDIT_HOMEPAGE_SEO'; seo: SeoData }
    | { type: 'SET_HOMEPAGE'; homepage: Homepage };

type RootState = any; // Define your full state type
type HomepageThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, HomepageActionTypes>;

// Action Creators
export const editHomePage = (homepage: Homepage): HomepageActionTypes => ({
    type: 'EDIT_HOMEPAGE',
    homepage
});

export const startEditHomePage = (homepage: Homepage): HomepageThunk<Promise<void>> => {
    return (dispatch: Dispatch<HomepageActionTypes>) => {
        return firebase.database().ref('website/').update(homepage).then(() => {
            dispatch(editHomePage(homepage));
        });
    };
};

// Edit homepage SEO
export const editHomePageSeo = (seo: SeoData): HomepageActionTypes => ({
    type: 'EDIT_HOMEPAGE_SEO',
    seo
});

export const startEditHomePageSeo = (seo: SeoData): HomepageThunk<Promise<void>> => {
    return (dispatch: Dispatch<HomepageActionTypes>) => {
        return firebase.database().ref('serverSeo/seo').update(seo).then(() => {
            return firebase.database().ref('website/homepage/seo').update(seo).then(() => {
                dispatch(editHomePage(seo));
            });
        });
    };
};

// Modern fetch utility
const fetchData = async (url: string): Promise<any> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Set homepage
export const setHomePage = (homepage: Homepage): HomepageActionTypes => ({
    type: 'SET_HOMEPAGE',
    homepage
});

export const startSetHomePage = (done: (error: Error | null, data?: Homepage) => void): HomepageThunk => {
    return async (dispatch: Dispatch<HomepageActionTypes>) => {
        try {
            const firebaseUrl = process.env.FIREBASE_DATABASE_URL || 'https://nava-p-k.firebaseio.com';
            const data = await fetchData(`${firebaseUrl}/website/homepage.json`);
            done(null, data);
            dispatch(setHomePage(data));
        } catch (error) {
            done(error as Error);
        }
    };
};

// Add homepage tell
export const startAddHomePageTell = (
    homepage: Homepage, 
    tellData: Partial<TellData>
): HomepageThunk<Promise<Homepage>> => {
    return (dispatch: Dispatch<HomepageActionTypes>, getState) => {
        const {
            name = '',
            position = '',
            company = 0,
            createdAt = 0,
            text = '',
            order = 0
        } = tellData;
        
        const tell: TellData = { company, createdAt, name, position, text, order };
        
        return firebase.database().ref('website/homepage/tell').push(tell).then((ref) => {
            if (!ref.key) throw new Error('Failed to create tell entry');
            
            const updatedHomepage = { ...homepage };
            if (!updatedHomepage.tell) updatedHomepage.tell = {};
            updatedHomepage.tell[ref.key] = tell;
            
            dispatch(editHomePage(updatedHomepage));
            return updatedHomepage;
        });
    };
};

// Delete homepage image with modern fetch
export const startDeleteHomePageImage = (
    homepage: Homepage, 
    publicid: string
): HomepageThunk<Promise<void>> => {
    return async (dispatch: Dispatch<HomepageActionTypes>) => {
        try {
            const response = await fetch('/deleteImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `publicid=${encodeURIComponent(publicid)}`
            });
            
            if (!response.ok) {
                throw new Error(`Failed to delete image: ${response.status}`);
            }
            
            const result = await response.text();
            if (process.env.NODE_ENV === 'development') {
                console.log('Image deletion result:', result);
            }
            
            return firebase.database().ref('website/').update(homepage).then(() => {
                dispatch(editHomePage(homepage));
            });
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error deleting image:', error);
            }
            throw error;
        }
    };
};

export type { Homepage, SeoData, TellData, HomepageActionTypes };
