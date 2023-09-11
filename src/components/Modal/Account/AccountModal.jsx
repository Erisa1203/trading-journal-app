import React, { useContext } from 'react'
import "./AccountModal.styl"
import { UserContext } from '../../../contexts/UserContext';

const AccountModal = ({onSettingClick}) => {
    const { user, logout } = useContext(UserContext);

    if (!user) return null; // userがnullの場合、何も表示しない

    const googleProviderInfo = user.providerData.find(data => data.providerId === 'google.com');
    const photoURL = googleProviderInfo?.photoURL;
    const initial = user.displayName?.[0];

    return (
        <div className='menuModal'>
            <div className="menuModal__name">
                { photoURL 
                    ? <div className='menuModal__img'><img src={photoURL} alt="" /></div>
                    : <span className="initial">{initial}</span>
                }
                <span>{user.displayName}</span>
            </div>
            <ul className="menuModal__menu">
                <li className="menuModal__item" onClick={onSettingClick}>設定</li>
                <li className="menuModal__item" onClick={logout}>ログアウト</li>
            </ul>
        </div>
    )
}

export default AccountModal
