//import database from '../firebase/firebase';
//import * as firebase from 'firebase/app';
//import 'firebase/database';
var firebase = require("firebase/app");
require("firebase/database");

// edit homepage

export const editHomePage = ( homepage ) => ({
    type: 'EDIT_HOMEPAGE',
    homepage
});

export const startEditHomePage = ( homepage ) => {
    return (dispatch) => {
        
        return firebase.database().ref(`website/`).update(homepage).then(() => {
            dispatch(editHomePage( homepage ));
        })
    };
};


// edit homepage seo

export const editHomePageSeo = ( seo ) => ({
    type: 'EDIT_HOMEPAGE_SEO',
    seo
});

export const startEditHomePageSeo = ( seo ) => {
    return (dispatch) => {
        return firebase.database().ref(`serverSeo/seo`).update(seo).then(() => {
            return firebase.database().ref(`website/homepage/seo`).update(seo).then(() => {
                dispatch(editHomePage( seo ));
            })
        })
    };
};


// set homepage

function makeRequest (method, url, done) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(null, xhr.response);
    };
    xhr.onerror = function () {
        done(xhr.response);
    };
    xhr.send();
}



export const setHomePage = (homepage) => ({
    type: "SET_HOMEPAGE",
    homepage
});

export const startSetHomePage = (done) => {

    return (dispatch) => {
        var method = 'GET';
        var action = 'https://ziva-art.firebaseio.com/website/homepage.json';
        var xhr = new XMLHttpRequest();
        var data = '';
        xhr.open(method, action);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            done(null, JSON.parse(xhr.response));
            dispatch(setHomePage(JSON.parse(xhr.response)));
        };
        xhr.send(data);
    };
};


// ADD_HOMEPAGE_TELL

export const startAddHomePageTell = (homepage, tellData) => {
    return (dispatch, getState) => {
        const {
            name = '',
            position = '',
            company = 0,
            createdAt = 0,
            text = '',
            order = 0
        } = tellData;
        const tell = {company, createdAt, name, position, text, order};
        return firebase.database().ref(`website/homepage/tell`).push(tell).then((ref) => {
            const id = ref.key;
            homepage.tell[ref.key] = tell;
            dispatch(editHomePage(homepage));
            return(homepage);
        });
    };
};


// delete homepage image

export const startDeleteHomePageImage = ( homepage, publicid ) => {
    return (dispatch) => {
        var method = 'POST';
        //var action = 'http://localhost:3000/deleteImage';
        var action = '/deleteImage';
        var xhr = new XMLHttpRequest();
        var data = '';
        console.log(publicid);
        data += 'publicid=' + publicid;
        xhr.open(method, action);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
        xhr.send(data);
        xhr.addEventListener('load', function (e) {
            var data = e.target.responseText;
            console.log(data);
        });
        return firebase.database().ref(`website/`).update(homepage).then(() => {
            dispatch(editHomePage( homepage ));
        })
    };
};