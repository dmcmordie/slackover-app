import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyAOSai2kBa_K7aiH3ODuXipM-URvMIUsWs",
    authDomain: "slackover-5e335.firebaseapp.com",
    databaseURL: "https://slackover-5e335.firebaseio.com",
    projectId: "slackover-5e335",
    storageBucket: "slackover-5e335.appspot.com",
    messagingSenderId: "175691899703",
    appId: "1:175691899703:web:8dac4140dd42644c5070b2"
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;