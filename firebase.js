// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import "firebase/auth"
import "firebase/firestore";
import "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx6odQc22mx5iJ0NNXiUdnFRRMVrud12I",
  authDomain: "fir-auth-54d34.firebaseapp.com",
  projectId: "fir-auth-54d34",
  storageBucket: "fir-auth-54d34.appspot.com",
  messagingSenderId: "359548524898",
  appId: "1:359548524898:web:8cc7008e929addff7df43b",
  databaseURL: "https://fir-auth-54d34-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth()
const db = firebase.database();

export { auth, db };
