'use strict';
// TODO: Replace the following with your app's Firebase project configuration
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey:"AIzaSyDKETY-aByR9HQtf81ksO95kTns7QmBhe4",
        authDomain:"freeopengym-69dae.firebaseapp.com",
        projectId:"freeopengym-69dae"
    });
}
else {
// if already initialized
    firebase.app();
}

// create shortcut for accessing the apps's Firestore database
const
    db = firebase.firestore();