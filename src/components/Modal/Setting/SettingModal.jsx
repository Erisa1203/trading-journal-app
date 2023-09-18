import React, { useContext, useEffect, useState } from 'react'
import "./SettingModal.styl"
import { UserContext } from '../../../contexts/UserContext';
import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, getStorage } from '@firebase/storage';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail } from 'firebase/auth';

const SettingModal = ({setIsSettingModalVisible}) => {
    const [accountValue, setAccountValue] = useState("");
    const { user, isFirstLogin } = useContext(UserContext);
    const [currency, setCurrency] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);
    const [currentContent, setCurrentContent] = useState("user"); // "user" or "account"
    const [userName, setUserName] = useState(user.displayName || "");
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageName, setProfileImageName] = useState("画像を選択してください");
    const Storage = getStorage();
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [email, setEmail] = useState(user.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [startDate, setStartDate] = useState("");

    useEffect(() => {
        if (user) {
            const settingsRef = doc(db, 'setting', user.uid);
            getDoc(settingsRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    if (data.username) {
                        setUserName(data.username);
                    }
                    if (data.accountValue) {
                        setAccountValue(data.accountValue);
                    }
                    if (data.profileImageUrl) {
                        setProfileImageUrl(data.profileImageUrl);
                    }
                    if (data.email) {
                        setEmail(data.email);
                    }
                    if (data.startDate) {
                        setStartDate(data.startDate);
                    }
                }
            });
        }
    }, [user]);
    
    // emailの更新処理
    const updateEmailInAuth = async (newEmail, currentPassword) => {
        try {
          const isAuthenticated = await reauthenticateUser(currentPassword);
      
          if (!isAuthenticated) {
            console.error("Failed to reauthenticate user.");
            return false;
          }
      
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser) {
            await updateEmail(currentUser, newEmail);
            return true;
          } else {
            console.error("No authenticated user found.");
            return false;
          }
        } catch (error) {
          console.error("Error updating email in Firebase Auth:", error);
          return false;
        }
    };
      
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0]);
            setProfileImageName(e.target.files[0].name);
    
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileImageUrl(event.target.result); // これで画像をすぐに表示できます
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const uploadProfileImage = async () => {
        // パスを`user/`から`profileImages/`に変更します
        const storageRef = ref(Storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, profileImage);
        const imageUrl = await getDownloadURL(storageRef);
        return imageUrl;
    };

    // isFirstLoginがtrueの場合、Firestoreのデータベースを更新する関数
    const updateIsFirstLogin = async () => {
        if (isFirstLogin) {
            const userDocRef = doc(db, "users", user.uid);
            try {
                await updateDoc(userDocRef, { isFirstLogin: false });
            } catch (error) {
                console.error("Error updating isFirstLogin:", error);
            }
        }
    };

    const closeModal = () => {
        updateIsFirstLogin();
        setIsSettingModalVisible(false);
    };

    const handleUpdate = async () => {
        if (user) {
            try {
                let imageUrl;
                if (profileImage) {
                    imageUrl = await uploadProfileImage();
                }
    
                const settingsRef = doc(db, 'setting', user.uid);
                await setDoc(settingsRef, {
                    accountValue,
                    user_id: user.uid,
                    currency,
                    username: userName,
                    profileImageUrl: imageUrl || null,
                    email,
                    startDate
                });
    
                // ここでユーザーの現在のメールアドレスと新しいメールアドレスが異なる場合のみ、
                // updateEmailInAuth 関数を呼び出します
                if (user.email !== email) {
                    const isEmailUpdated = await updateEmailInAuth(email, currentPassword);
                    if (!isEmailUpdated) {
                        throw new Error("Failed to update email in Firebase Auth.");
                    }
                }
                
                setIsUpdated(true);
                updateIsFirstLogin();
            } catch (error) {
                console.error("Error updating document:", error);
            }
        }
    };
    

    const reauthenticateUser = async (currentPassword) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);

        try {
        await reauthenticateWithCredential(currentUser, credential);
        return true;
        } catch (error) {
        console.error("Error during reauthentication:", error);
        return false;
        }
    }
    return false;
    };

    
  return (
    <>
        <div 
            className='modal_wrapper'
            onClick={closeModal}
        ></div>
        <div className="modal">
            <div 
                className="modal__close"
                onClick={closeModal}
            >
            </div>
            <div className="modal__title">設定</div>
            <div className="modal__content">
                <div className="modal__sidebar">
                <div 
                    className={`modal__sidebar__list ${currentContent === "user" ? "active" : ""}`}
                    onClick={() => {
                        setCurrentContent("user");
                        setIsUpdated(false);
                    }}
                >
                    ユーザー設定
                </div>
                <div 
                    className={`modal__sidebar__list ${currentContent === "account" ? "active" : ""}`}
                    onClick={() => {
                        setCurrentContent("account");
                        setIsUpdated(false);
                    }}
                >
                    アカウント設定
                </div>

                </div>
                <div className="modal__main">
                    {currentContent === "user" && (
                        <div className="modal__userContent">
                            <div className="modal__block">
                                <div className="modal__sub">プロフィール画像</div>
                                <div className='profBlock'>
                                    {profileImageUrl && (
                                        <div className='profImg'>
                                            <img src={profileImageUrl} alt="プロフィール画像" />
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        id="fileInput" 
                                        style={{ display: 'none' }} 
                                        onChange={handleImageChange} 
                                    />
                                    <label 
                                        htmlFor="fileInput" 
                                        style={{ cursor: 'pointer' }}
                                        className={profileImageUrl ? "modal__label__onedit" : ""}
                                    >
                                        {profileImageUrl ? "画像を変更" : profileImageName}
                                    </label>
                                </div>
                            </div>

                            <div className="modal__block">
                                <div className="modal__sub">ユーザー名</div>
                                <input 
                                    type="text" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="modal__block">
                                <div className="modal__sub">Email</div>
                                <input 
                                    type="text" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="modal__block">
                                <div className="modal__sub">現在のパスワード</div>
                                <input 
                                    type="password" 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="現在のパスワードを入力"
                                />
                            </div>

                        </div>
                    )}
                    {currentContent === "account" && (
                        <div className="modal__accountContent">
                            <div className="modal__block">
                                <div className="modal__sub">アカウント初期値</div>
                                <input 
                                    type="text" 
                                    value={accountValue} 
                                    onChange={(e) => setAccountValue(e.target.value)}
                                />
                            </div>
                            <div className="modal__block">
                                <div className="modal__sub">通貨</div>
                                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                    <option value="yen">¥ 円</option>
                                    <option value="dollor">$ ドル</option>
                                    <option value="euro">€ ユーロ</option>
                                </select>
                            </div>
                            <div className="modal__block">
                                <div className="modal__sub">トレード開始日</div>
                                <input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                />
                            </div>
                        </div>
                    )}
                    <div className='modal__side'>
                        {isUpdated && <div className="modal__update">更新されました。</div>}
                        <button className='btn btn--primary' onClick={handleUpdate}>更新</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default SettingModal
