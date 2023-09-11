import React, { useContext, useEffect, useState } from 'react'
import "./SettingModal.styl"
import { UserContext } from '../../../contexts/UserContext';
import { db } from '../../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SettingModal = ({setIsSettingModalVisible}) => {
    const [accountValue, setAccountValue] = useState("");
    const { user } = useContext(UserContext);
    const [currency, setCurrency] = useState("");

    useEffect(() => {
        if (user) {
            const settingsRef = doc(db, 'setting', user.uid);
            getDoc(settingsRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    setAccountValue(docSnapshot.data().accountValue);
                }
            });
        }
    }, [user]);

    const handleUpdate = async () => {
        if (user) {
            try {
                const settingsRef = doc(db, 'setting', user.uid);
                await setDoc(settingsRef, {
                    accountValue,
                    user_id: user.uid,
                    currency
                });
            } catch (error) {
                console.error("Error updating document:", error);
            }
        }
    };
    
  return (
    <>
        <div 
            className='modal_wrapper'
            onClick={() => setIsSettingModalVisible(false)}
        ></div>
        <div className="modal">
            <div className="modal__title">設定</div>
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
            <button className='btn btn--primary' onClick={handleUpdate}>更新</button>
        </div>
    </>
  )
}

export default SettingModal
