import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB3ILUFcHTG0xTDU6KqW7jBLlsrnJpQpnI",
    authDomain: "task-app-942a2.firebaseapp.com",
    databaseURL: "https://task-app-942a2.firebaseio.com",
    projectId: "task-app-942a2",
    storageBucket: "task-app-942a2.appspot.com",
    messagingSenderId: "272839927744",
    appId: "1:272839927744:web:acf7a9fb6215e35f8c0a25",
    measurementId: "G-552XZL4X5M"
  };

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const tasksCollection = db.collection('Tasks');
export const firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export default firebase; 
