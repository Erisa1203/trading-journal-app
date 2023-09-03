import React, { useContext, useEffect, useMemo, useState } from 'react'
import { TradesContext } from '../../../../contexts/TradesContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CaretDown } from 'phosphor-react';
// import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, query, orderBy, limit, getDoc, setDoc, getDocs, addDoc, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { UserContext } from '../../../../contexts/UserContext';

const AccountChart = ({ onBalanceChange }) => {
    const { trades, loading } = useContext(TradesContext);
    const [selectedYear, setSelectedYear] = useState('this year');
    const [chartWidth, setChartWidth] = useState(window.innerWidth);
    const [initialBalance, setInitialBalance] = useState(500000);
    const { user } = useContext(UserContext);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            let balance = 500000; // default value
            if (selectedYear === 'this year') {
                const lastYear = new Date().getFullYear() - 1;
                const lastYearBalance = await getYearlyBalanceFromFirestore(lastYear);
                balance = lastYearBalance || balance;
            } else if (selectedYear === 'last year') {
                const yearBeforeLast = new Date().getFullYear() - 2;
                const balanceYearBeforeLast = await getYearlyBalanceFromFirestore(yearBeforeLast);
                balance = balanceYearBeforeLast || balance;
            }
            if (isMounted) {
                setInitialBalance(balance);
            }
        })();

        return () => { isMounted = false; };
    }, [selectedYear]);

    const getYearlyBalanceFromFirestore = async (year) => {
        const summaryRef = collection(db, 'summary');
        const yearQuery = query(summaryRef, where("year", "==", year));
        const querySnapshot = await getDocs(yearQuery);
    
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return doc.data().balance;
        }
        return null;
    };

    const filteredTrades = useMemo(() => {
        const currentYear = new Date().getFullYear();
        switch (selectedYear) {
            case 'this year':
                return trades.filter((trade) => {
                    const year = new Date(trade.EXIT_DATE).getFullYear();
                    return year === currentYear;
                });
            case 'last year':
                return trades.filter((trade) => {
                    const year = new Date(trade.EXIT_DATE).getFullYear();
                    return year === currentYear - 1;
                });
            case 'all time':
                return trades;
            default:
                return trades;
        }
    }, [trades, selectedYear]);
    
    const data = useMemo(() => {
            // 初期のバランスの設定
        let balance = initialBalance;

        if (selectedYear === 'this year') {
            (async () => {
                const lastYear = new Date().getFullYear() - 1;
                const lastYearBalance = await getYearlyBalanceFromFirestore(lastYear);
                balance = lastYearBalance || balance;
            })();
        } else if (selectedYear === 'last year') {
            (async () => {
                const yearBeforeLast = new Date().getFullYear() - 2;
                const balanceYearBeforeLast = await getYearlyBalanceFromFirestore(yearBeforeLast);
                balance = balanceYearBeforeLast || balance;
            })();
        }

        const monthlyProfits = Array(12).fill(0);

        filteredTrades.forEach((trade) => {
            if (!trade.EXIT_DATE) return;

            const date = new Date(trade.EXIT_DATE);
            const month = date.getMonth(); // 0から11の値を返す
            
            if (isNaN(month)) return;

            const profit = trade.PROFIT ? parseFloat(trade.PROFIT) : 0;

            monthlyProfits[month] += profit;
        });
        
        const chartData = monthlyProfits.map((profit, index) => {
            balance += profit;
            return {
                name: `${index + 1}月`,
                balance
            };
        });

        return chartData;
    }, [filteredTrades, initialBalance]);

    useEffect(() => {
        if(data.length > 0) {
            const lastBalance = data[data.length - 1].balance;
            onBalanceChange(lastBalance);
        }
    }, [data, onBalanceChange]);

    useEffect(() => {
        const updateWidth = () => {
            setChartWidth(document.querySelector('.chartContainer').offsetWidth + 34);
        };
        updateWidth(); // 初回レンダリング時にも実行
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    const updateSummaryInFirestore = async (year, calculatedBalance) => {
        // 当該ユーザーのドキュメントの参照を取得
        const userDocRef = doc(db, 'users', user.uid);
    
        const userDocSnapshot = await getDoc(userDocRef);
    
        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
    
            // 既存のsummaryを取得または新しい空の配列を作成
            let summaryArray = userData.summary ? [...userData.summary] : [];
    
            // 同じ年のオブジェクトを検索
            const existingIndex = summaryArray.findIndex(item => item.year === year);
    
            if (existingIndex !== -1) {
                // 既存の年のバランスを更新
                summaryArray[existingIndex].balance = calculatedBalance;
            } else {
                // 新しい年のオブジェクトを追加
                summaryArray.push({ year, balance: calculatedBalance });
            }
    
            // ドキュメントを更新
            await updateDoc(userDocRef, { summary: summaryArray });
    
        } else {
            console.error('ユーザーが存在しません。');
        }
    };

    useEffect(() => {
        const calculateYearlyBalance = (year, trades) => {
            let balance = 500000;  // 初期値
            trades.forEach((trade) => {
                const tradeYear = new Date(trade.EXIT_DATE).getFullYear();
                if (tradeYear !== year) return;
                const profit = trade.PROFIT ? parseFloat(trade.PROFIT) : 0;
                balance += profit;
            });
            return balance;
        };
    
        const updateFirestore = async () => {
            // ユーザーのドキュメントに紐づくsummaryサブコレクションの参照を取得
            if(user) {
                const summaryCollectionRef = collection(db, 'users', user.uid, 'summary');
                
                // 全ての年のバランスを計算する
                const yearsSet = new Set(trades.map(trade => new Date(trade.EXIT_DATE).getFullYear()));
                const years = [...yearsSet];
                
                for (const year of years) {
                    const calculatedBalance = calculateYearlyBalance(year, trades);
                    
                    // 各年のドキュメントのIDを年として設定
                    const yearDocRef = doc(summaryCollectionRef, year.toString());
                    
                    const yearDocSnapshot = await getDoc(yearDocRef);
                    
                    if (yearDocSnapshot.exists()) {
                        // その年のドキュメントが存在する場合、更新
                        await updateSummaryInFirestore(year, calculatedBalance);
                    } else {
                        // その年のドキュメントが存在しない場合、新しいドキュメントを作成
                        await updateSummaryInFirestore(year, calculatedBalance);
                    }
                }
            }
        };
    
        if (!loading) {
            updateFirestore();
        }
    }, [trades, loading]);
    

    return (
        <div className="chartContainer">
            <div className="chartCard__select">
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="this year">This year</option>
                    <option value="last year">Last year</option>
                    <option value="all time">All time</option>
                </select>

                <CaretDown className='chartCard__select__arrow'/>
            </div>

            <AreaChart
                width={chartWidth}
                height={300}
                data={data}
                margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="balance" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </div>
    )
}

export default AccountChart;
