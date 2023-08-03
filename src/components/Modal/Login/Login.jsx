import React, { useState } from 'react'
import "./_login.styl"
import GoogleSignInBtn from '../../Button/GoogleSignInBtn'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Firestore, doc, setDoc } from 'firebase/firestore'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);

    const handleLogin = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error: ", errorCode, errorMessage);
        });
    };

    const handleSignup = async () => {
        const auth = getAuth();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          // ユーザーが正常に作成されたら、Firestoreに新規ドキュメントを作成
          const userDocRef = doc(Firestore, "users", user.uid);
          await setDoc(userDocRef, {
            customTags: ["USD/JPY", "USD/CAD", "EUR/USD", "EUR/GBP", "EUR/JPY", "EUR/CHF", "GBP/JPY", "GBP/USD", "GBP/CAD", "CAD/JPY"],
            email: user.email,
            username: user.displayName,
          });
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          // エラーメッセージを表示するなど、エラーハンドリングを行います
        }
      };

    return (
        <div className="userModal">
            <p className='userModal__desc'>{isNewUser ? "新規会員登録" : "ログイン"}</p>
            <div className="userModal__input">
                <div className="userModal__label">email</div>
                <input type="text" className="form-input" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="userModal__input">
                <div className="userModal__label">password</div>
                <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            <button className='btn btn--primary' onClick={isNewUser ? handleSignup : handleLogin}>{isNewUser ? "新規登録" : "ログイン"}</button>
            <div className="userModal__others">
                <p>その他の方法で{isNewUser ? "サインイン" : "ログイン"}</p>
                <GoogleSignInBtn />
            </div>
            <p className="userModal__newaccount" onClick={() => setIsNewUser(!isNewUser)}>{isNewUser ? "既にアカウントをお持ちの方はこちら" : "新規会員登録はこちら"}</p>
        </div>
    )
}

export default Login
