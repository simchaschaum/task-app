import app from 'firebase/app';

var config = {
    apiKey: "AIzaSyB3ILUFcHTG0xTDU6KqW7jBLlsrnJpQpnI",
    authDomain: "task-app-942a2.firebaseapp.com",
    databaseURL: "https://task-app-942a2.firebaseio.com",
    projectId: "task-app-942a2",
    storageBucket: "task-app-942a2.appspot.com",
    messagingSenderId: "272839927744",
    appId: "1:272839927744:web:acf7a9fb6215e35f8c0a25",
    measurementId: "G-552XZL4X5M"
  };

  class Firebase {
    constructor(){
      app.initializeApp(config);
    }
  }

  export default Firebase;