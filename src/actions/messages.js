//import database from '../firebase/firebase';
var firebase = require("firebase/app");
require("firebase/database");
import bodyParser from 'body-parser';

export const startSendMessage = (messageData = {}) => {
    return (dispatch) => {
        const {
            name = '',
            phone = '',
            email = '',
            message = '',
            createdAt = 0
        } = messageData;
        const userMessage = {name, phone, email, message, createdAt};
        return firebase.database().ref(`messages`).push(userMessage).then((ref) => {
            dispatch(sendMessage({
                id: ref.key,
                ...userMessage
            }));
        });
    };
};

export const sendMessage = ({ name, email, message }) => {
    return (dispatch) => {
        var method = 'POST';
        //var action = 'http://localhost:3000/sendEmail';
        var action = '/sendEmail';
        var xhr = new XMLHttpRequest();
        var data = '';
        data += 'name=' + name;
        data += '&email=' + email;
        data += '&message=' + message;
        xhr.open(method, action);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
        xhr.send(data);
        xhr.addEventListener('load', function (e) {
            var data = e.target.responseText;
            console.log('in send mail');
            console.log(data);
        });
        return ("done");
    };
};