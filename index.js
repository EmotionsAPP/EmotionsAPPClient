import { registerRootComponent } from 'expo';

import App from './App';

import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBeeoAgMBWUa9c8vp62SnUchrTxKjU0f8U',
  authDomain: 'emotionsapp-dc143.firebaseapp.com',
  databaseURL: 'https://emotionsapp-dc143.firebaseio.com',
  projectId: 'emotionsapp-dc143',
  storageBucket: 'emotionsapp-dc143.appspot.com',
  messagingSenderId: '121774737355',
  appId: '1:121774737355:android:bbb1b69a6682d560da984e',
  measurementId: 'G-measurement-id',
};

console.log('firebase');


const app = initializeApp(firebaseConfig);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
