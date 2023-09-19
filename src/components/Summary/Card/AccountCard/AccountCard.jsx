import React, { useContext, useEffect, useState } from 'react'
import AccountChart from '../../Chart/AccountChart/AccountChart'
import { db } from '../../../../services/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { UserContext } from '../../../../contexts/UserContext';
import { TradesContext } from '../../../../contexts/TradesContext';

const AccountCard = () => {
    const [currentBalance, setCurrentBalance] = useState("");
    const [currency, setCurrency] = useState('yen');
    const { user, loading } = useContext(UserContext);
    const { trades } = useContext(TradesContext);
    const [currentYearBalance, setCurrentYearBalance] = useState(0);
    const [lastYearBalance, setLastYearBalance] = useState(0);
    
    const getPercentageChange = () => {
        if (lastYearBalance === 0) return 0; // 昨年のバランスが0の場合、0%の変化として扱います
        const difference = currentYearBalance - lastYearBalance;
        return ((difference / lastYearBalance) * 100).toFixed(2);  // 小数点以下2桁までのパーセンテージを返す
    };
    
    useEffect(() => {
        if (loading || !user) return;
    
        const currentYear = new Date().getFullYear();
        const userDocRef = doc(db, 'users', user.uid);
    
        // onSnapshotを使用してドキュメントの変更をリアルタイムで監視
        const unsubscribe = onSnapshot(userDocRef, (userDocSnapshot) => {
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
        
                if (userData && userData.summary) {
                    const currentYearSummary = userData.summary.find(item => item.year === currentYear);
                    const lastYearSummary = userData.summary.find(item => item.year === currentYear - 1);
                    
                    if (currentYearSummary) {
                        setCurrentBalance(currentYearSummary.balance);
                        setCurrentYearBalance(currentYearSummary.balance);
                    }
                    
                    if (lastYearSummary) {
                        setLastYearBalance(lastYearSummary.balance);
                    }
                }
                
            }
            
        });
    
        // コンポーネントがアンマウントされるときに監視を終了する
        return () => unsubscribe();
    
    }, [user, loading, trades]);
    
    useEffect(() => {
        if (loading || !user) return;
    
        const settingDocRef = doc(db, 'setting', user.uid);
    
        // onSnapshotを使用してドキュメントの変更をリアルタイムで監視
        const unsubscribe = onSnapshot(settingDocRef, (settingDocSnapshot) => {
            if (settingDocSnapshot.exists()) {
                const settingData = settingDocSnapshot.data();
    
                if (settingData && settingData.currency) {
                    setCurrency(settingData.currency);
                }
            }
        });
    
        // コンポーネントがアンマウントされるときに監視を終了する
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
                <span className='chartCard__sub'>{getPercentageChange()}%</span>
            </div>
            <div className="chart">
                <AccountChart currentBalance={currentBalance} setCurrentBalance={setCurrentBalance} onBalanceChange={setCurrentBalance} />
            </div>
        </div>
    )
}

export default AccountCard
