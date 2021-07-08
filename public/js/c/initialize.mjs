//'use strict';
// TODO: Replace the following with your app's Firebase project configuration
if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyDKETY-aByR9HQtf81ksO95kTns7QmBhe4",
      authDomain: "freeopengym-69dae.firebaseapp.com",
      projectId: "freeopengym-69dae",
      storageBucket: "freeopengym-69dae.appspot.com",
      messagingSenderId: "252705101391",
      appId: "1:252705101391:web:a6f164f7cb435eee927c3a"
    });
} else {
// if already initialized
  console.log("WARN: already initialized");
    firebase.app();
}

// create shortcut for accessing the apps's Firestore database
const db = firebase.firestore();

//initialize Firebase user authentication interface
const auth = firebase.auth();
