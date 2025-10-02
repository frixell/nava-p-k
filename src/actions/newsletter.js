//import database from '../firebase/firebase';
var firebase = require("firebase/app");
require("firebase/database");
const axios = require('axios');

export const subscribeToNewsletter = (newsletterData = {}) => {
    return () => {
        const {
            name = '',
            email = ''
        } = newsletterData;
        const subscriber = {name, email};

        axios.post('https://ssl-vp.com/rest/v1/Contacts?updateIfExists=true&restoreIfDeleted=true&restoreIfUnsubscribed=true&api_key=68701475-bf12-46b4-8854-8bd40b8d09ad', {
            "firstName": name,
            "email": email,
            "lists_ToSubscribe": ["476816"]
        })
        .then(function (response) {
            console.log("response");
            console.log(response);
        })
        .catch(function (error) {
            console.log('error');
            console.log(error);
        });

        return firebase.database().ref(`newsletter`).push(subscriber);
    };
};