import React, { useContext, useEffect, useState } from 'react'
import "./SettingModal.styl"
import { UserContext } from '../../../contexts/UserContext';
import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, getStorage } from '@firebase/storage';

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

    useEffect(() => {
        if (user) {
            // ユーザーのdisplayNameを設定、もしない場合はFirestoreから取得
            if (user.displayName) {
                setUserName(user.displayName);
            } else {
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
                    }
                });
            }
        }
    }, [user]);
    


    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0]);
            setProfileImageName(e.target.files[0].name);
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
                    profileImageUrl: imageUrl || null  // imageUrlが存在しない場合はnullを保存します
                });
                setIsUpdated(true);
                updateIsFirstLogin();
            } catch (error) {
                console.error("Error updating document:", error);
            }
        }
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
                                <input 
                                    type="file" 
                                    id="fileInput" 
                                    style={{ display: 'none' }} 
                                    onChange={handleImageChange} 
                                />
                                <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                                    {profileImageName} 
                                </label>
                            </div>

                            <div className="modal__block">
                                <div className="modal__sub">ユーザー名</div>
                                <input 
                                    type="text" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)}
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
