import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCzGm3Em2oWl6eNq9yuRDTfOf_jUKkfnZ4",
  authDomain: "react-native-94b5f.firebaseapp.com",
  databaseURL: "https://react-native-94b5f-default-rtdb.firebaseio.com",
  projectId: "react-native-94b5f",
  storageBucket: "react-native-94b5f.appspot.com",
  messagingSenderId: "856017831453",
  appId: "1:856017831453:android:c95c6ac57c8f094f4b68f4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };