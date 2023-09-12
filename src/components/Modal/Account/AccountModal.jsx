import React, { useContext, useState, useEffect } from 'react';
import "./AccountModal.styl";
import { UserContext } from '../../../contexts/UserContext';
import { db } from '../../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore'; // onSnapshotをインポート

const AccountModal = ({onSettingClick}) => {
    const [username, setUsername] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const { user, logout, photoURL, initial, displayName } = useContext(UserContext);

    if (!user) return null;

    const googleProviderInfo = user.providerData.find(data => data.providerId === 'google.com');

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
