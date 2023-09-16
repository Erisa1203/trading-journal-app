import React, { useContext, useEffect, useState } from 'react'
import AccountChart from '../../Chart/AccountChart/AccountChart'
import { db } from '../../../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserContext } from '../../../../contexts/UserContext';

const AccountCard = () => {
    const [currentBalance, setCurrentBalance] = useState("---");
    const [currency, setCurrency] = useState('yen');
    const { user, loading } = useContext(UserContext);

    useEffect(() => {
        if (loading || !user) return;

        const settingsRef = doc(db, 'setting', user.uid);

        const unsubscribe = onSnapshot(settingsRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                if (data.accountValue) {
                    setCurrentBalance(parseFloat(data.accountValue));
                } else {
                    setCurrentBalance("---");
                }

                if (data.currency) {
                    setCurrency(data.currency);
                }
            }
        });

        return () => unsubscribe();
    }, [user, loading]);
    
    // 通貨の記号を取得するためのヘルパー関数
    const getCurrencySymbol = () => {
        switch(currency) {
            case 'dollor': return '$';
            case 'yen': return '¥';
            case 'euro': return '€';
            default: return '';
        }
    };

    return (
        <div className='chartCard chartCard--sm'>
            <div className="chartCard__head">ACCOUNT</div>
            <div className="chartCard__desc">
                <div className="chartCard__total">{getCurrencySymbol()}{currentBalance}</div>
                <span className='chartCard__sub'>+12%</span>
            </div>
            <div className="chart">
                <AccountChart currentBalance={currentBalance !== '---' ? currentBalance : undefined} setCurrentBalance={setCurrentBalance} onBalanceChange={setCurrentBalance} />
            </div>
        </div>
    )
}

export default AccountCard
