import React, { useState } from 'react'
import "./_login.styl"
import GoogleSignInBtn from '../../Button/GoogleSignInBtn'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Firestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../services/firebase'
import { getPairColorBg } from '../../../constants/colors'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const tags = ["USD/JPY", "USD/CAD", "EUR/USD", "EUR/GBP", "EUR/JPY", "EUR/CHF", "GBP/JPY", "GBP/USD", "GBP/CAD", "CAD/JPY"];
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const customTags = tags.map(tag => {
        return {
          color: getPairColorBg(tag),
          label: tag,
          value: tag
        };
    });

      
    const handleLogin = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
    
                // ログイン後に isFirstLogin を確認するロジックを削除しました。
            })
            .catch((error) => {
                const errorCode = error.code;
            
                switch(errorCode) {
                    case "auth/user-not-found":
                        setEmailError("ユーザーが存在しません");
                        break;
                    case "auth/wrong-password":
                        setPasswordError("パスワードが間違っています");
                        break;
                    case "auth/invalid-email":
                        setEmailError("無効なメールアドレスです");
                        break;
                    default:
                        setEmailError("ログインに失敗しました"); 
                        break;
                }
            }); 
    };
    

    const handleSignup = async () => {
        const auth = getAuth();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          // ユーザーが正常に作成されたら、Firestoreに新規ドキュメントを作成
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, {
            customTags: customTags,
            email: user.email,
            username: user.displayName || '',
            isFirstLogin: true
          });
        } catch (error) {
            const errorCode = error.code;
        
            switch(errorCode) {
                case "auth/weak-password":
                    setPasswordError("パスワードは6文字以上で設定してください");
                    break;
                case "auth/email-already-in-use":
                    setEmailError("このメールアドレスは既に使用されています");
                    break;
                case "auth/invalid-email":
                    setEmailError("無効なメールアドレスです");
                    break;
                default:
                    setEmailError("登録に失敗しました"); 
                    break;
            }
        }
      };
      
    const ErrorMessage = ({ message }) => {
        if (!message) return null;
        return <div className="error-message">{message}</div>;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        isNewUser ? handleSignup() : handleLogin();
    };
    return (
        <div className="userModal">
            <p className='userModal__desc'>{isNewUser ? "新規会員登録" : "ログイン"}</p>
            <form onSubmit={handleSubmit}> {/* form要素とonSubmitイベントを追加 */}
                <div className="userModal__input">
                    <div className="userModal__label">email</div>
                    <input type="text" className="form-input" value={email} onChange={e => setEmail(e.target.value)}/>
                    <ErrorMessage message={emailError} />
                </div>
                <div className="userModal__input">
                    <div className="userModal__label">password</div>
                    <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)}/>
                    <ErrorMessage message={passwordError} />
                </div>
                <button type="submit" className='btn btn--primary'>{isNewUser ? "新規登録" : "ログイン"}</button>
            </form>
            <div className="userModal__others">
                <p>その他の方法で{isNewUser ? "サインイン" : "ログイン"}</p>
                <GoogleSignInBtn />
            </div>
            <p className="userModal__newaccount" onClick={() => setIsNewUser(!isNewUser)}>{isNewUser ? "既にアカウントをお持ちの方はこちら" : "新規会員登録はこちら"}</p>
        </div>
    )
}

export default Login
