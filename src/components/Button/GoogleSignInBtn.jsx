import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../services/firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { backgrounds, colors } from "../../constants/colors";

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User name: ", user.displayName);
      console.log("User email: ", user.email);
      // Firestoreの操作を追加
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", user.uid);
      return setDoc(userDocRef, {
        customTags: [
            { value: "USD/JPY", label: "USD/JPY", color: backgrounds.red },
            { value: "USD/CAD", label: "USD/CAD", color: backgrounds.red },
            { value: "EUR/USD", label: "EUR/USD", color: backgrounds.purple },
            { value: "EUR/GBP", label: "EUR/GBP", color: backgrounds.purple },
            { value: "EUR/JPY", label: "EUR/JPY", color: backgrounds.purple },
            { value: "EUR/CHF", label: "EUR/CHF", color: backgrounds.purple },
            { value: "GBP/JPY", label: "GBP/JPY", color: backgrounds.yellow },
            { value: "GBP/USD", label: "GBP/USD", color: backgrounds.yellow },
            { value: "GBP/CAD", label: "GBP/CAD", color: backgrounds.yellow },
            { value: "CAD/JPY", label: "CAD/JPY", color: backgrounds.pink },
        ],
        
        email: user.email,
        username: user.displayName,
      });
    })
    .catch((error) => {
      console.error("Error during sign in: ", error);
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
};

const GoogleSignInBtn = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    // <div className="">
    //     {user? <p>User is logged in</p> : <p>User is not logged in</p>}
    // </div>
    <img
      className="googleBtn"
      src="/img/btn_google.png"
      alt="Googleでサインイン"
      onClick={signInWithGoogle}
    />
  );
};
{
  /* <img className='googleBtn' src="/img/btn_google.png" alt="Googleでサインイン" onClick={signInWithGoogle} /> */
}
export default GoogleSignInBtn;
