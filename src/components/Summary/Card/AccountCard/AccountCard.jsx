import React, { useContext, useEffect, useState } from 'react'
import AccountChart from '../../Chart/AccountChart/AccountChart'
import { db } from '../../../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserContext } from '../../../../contexts/UserContext';

const AccountCard = () => {
    const [currentBalance, setCurrentBalance] = useState("---");
    const { user, loading } = useContext(UserContext);

    useEffect(() => {
        if (loading || !user) return; 
    
        const settingsRef = doc(db, 'setting', user.uid);
    
        // onSnapshotを使用してaccountValueの変更をリアルタイムで監視
        const unsubscribe = onSnapshot(settingsRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                if (data.accountValue) {
                    // 文字列を数値に変換
                    setCurrentBalance(parseFloat(data.accountValue));
                } else {
                    setCurrentBalance("---");
                }
            }
        });
    
        // クリーンアップ時に監視を停止
        return () => unsubscribe();
    }, [user, loading]);
    

    return (
        <div className='chartCard chartCard--sm'>
            <div className="chartCard__head">ACCOUNT</div>
            <div className="chartCard__desc">
                <div className="chartCard__total">¥{currentBalance}</div>
                <span className='chartCard__sub'>+12%</span> {/* この部分もFirestoreのデータに基づいて動的に変更することができます */}
            </div>
            <div className="chart">
                <AccountChart currentBalance={currentBalance !== '---' ? currentBalance : undefined} setCurrentBalance={setCurrentBalance} onBalanceChange={setCurrentBalance} />
            </div>
        </div>
    )
}

export default AccountCard
