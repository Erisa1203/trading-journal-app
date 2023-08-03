import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth" 
import { getFirestore } from "firebase/firestore" 

const firebaseConfig = {
    apiKey: "AIzaSyCVhio-jXM3IfXL9b40guv1DudTt9h-F_Y",
    authDomain: "trading-journal-app-c4fa8.firebaseapp.com",
    projectId: "trading-journal-app-c4fa8",
    storageBucket: "trading-journal-app-c4fa8.appspot.com",
    messagingSenderId: "138168057879",
    appId: "1:138168057879:web:fbd2a4644cda0aa2141c52",
    measurementId: "G-93DWN0QT79"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export { auth, provider, db }

