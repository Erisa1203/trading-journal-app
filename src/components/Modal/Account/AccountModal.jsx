import React, { useContext, useState, useEffect } from 'react';
import "./AccountModal.styl";
import { UserContext } from '../../../contexts/UserContext';
import { db } from '../../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore'; // onSnapshotをインポート

const AccountModal = ({onSettingClick}) => {
    const { user, logout } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState(null);

    useEffect(() => {
        if (user) {
            const settingsRef = doc(db, 'setting', user.uid);
            
            // onSnapshotを使用して、データの変更をリアルタイムで監視
            const unsubscribe = onSnapshot(settingsRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    if (data.username) {
                        setUsername(data.username);
                    }
                    if (data.profileImageUrl) {
                        setProfileImageUrl(data.profileImageUrl);
                    }
                }
            });

            // コンポーネントのクリーンアップ時に監視を停止
            return () => unsubscribe();
        }
    }, [user]);

    if (!user) return null;

    const googleProviderInfo = user.providerData.find(data => data.providerId === 'google.com');
    const photoURL = googleProviderInfo?.photoURL || profileImageUrl;
    const displayName = username || user.displayName; 
    const initial = displayName?.[0];

    return (
        <div className='menuModal'>
            <div className="menuModal__name">
                { photoURL 
                    ? <div className='menuModal__img'><img src={photoURL} alt="" /></div>
                    : <span className="initial">{initial}</span>
                }
                <span>{displayName}</span>
            </div>
            <ul className="menuModal__menu">
                <li className="menuModal__item" onClick={onSettingClick}>設定</li>
                <li className="menuModal__item" onClick={logout}>ログアウト</li>
            </ul>
        </div>
    )
}

export default AccountModal;
