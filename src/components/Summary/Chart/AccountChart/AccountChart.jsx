import React, { useContext, useEffect, useMemo, useState } from 'react'
import { TradesContext } from '../../../../contexts/TradesContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CaretDown } from 'phosphor-react';
import {  getDoc,  updateDoc, doc, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { UserContext } from '../../../../contexts/UserContext';

const AccountChart = ({ onBalanceChange, currentBalance, setCurrentBalance }) => {
    const { trades, loading } = useContext(TradesContext);
    const [selectedYear, setSelectedYear] = useState('this year');
    const [chartWidth, setChartWidth] = useState(window.innerWidth);
    const { user } = useContext(UserContext);
    const [initialBalance, setInitialBalance] = useState(currentBalance);
    const [startingBalance, setStartingBalance] = useState(null);
    const [fetched, setFetched] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [hasLastYearData, setHasLastYearData] = useState(false);

    const getInitialBalanceFromFirestore = async () => {
        const initialBalanceDoc = await getDoc(doc(db, 'setting', user.uid));
        if (initialBalanceDoc.exists()) {
            return initialBalanceDoc.data().accountValue;
        }
        return 0;  // デフォルト値
    };

    const getAccountValueFromSetting = async (userId) => {
        const settingRef = doc(db, 'setting', userId); // ユーザーIDを使用してドキュメントを参照
        const settingDoc = await getDoc(settingRef);
    
        if (settingDoc.exists() && settingDoc.data().accountValue) {
            return parseFloat(settingDoc.data().accountValue);
        }
        return null;
    };

    const getYearlyBalanceFromFirestore = async ( year) => {
        // usersコレクション内の特定のユーザーのドキュメントを参照
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
    
        // ユーザードキュメントを取得
        const userDoc = await getDoc(userRef);
    
        if (userDoc.exists() && userDoc.data().summary) {
            const userData = userDoc.data();
            
            // summaryの中で指定されたyearとマッチするデータを探す
            const matchedSummary = userData.summary.find(item => item.year == String(year));
            
            if (matchedSummary) {
                return matchedSummary.balance;
            }
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
    
    const getStartingBalanceForYear = async (targetYear) => {
        if (targetYear === 'all time') {
            const balanceData = await getInitialBalanceFromFirestore();
            const numericBalance = parseFloat(balanceData);
    
            if (isNaN(numericBalance)) return
    
            return numericBalance;
        }
        
        const currentYear = new Date().getFullYear();
        let yearToFetch;
        
        if (targetYear === 'this year') {
            yearToFetch = currentYear - 1;
        } else if (targetYear === 'last year') {
            yearToFetch = currentYear - 2;
        } else {
            yearToFetch = targetYear - 1;
        }
        
        const balance = await getYearlyBalanceFromFirestore(yearToFetch);
        if (balance !== null) {
            return balance;
        }
        return await getAccountValueFromSetting(user.uid); // balance が null の場合、accountValue を返す
    };

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

    const getStartDateFromFirestore = async (userId) => {
        const settingRef = doc(db, 'setting', userId); 
        const settingDoc = await getDoc(settingRef);
    
        if (settingDoc.exists() && settingDoc.data().startDate) {
            return settingDoc.data().startDate;
        }
        return null;
    };

    useEffect(() => {
        if(!user) return 
        const fetchInitialBalance = async () => {
            const fetchedInitialBalance = await getInitialBalanceFromFirestore();
            setInitialBalance(fetchedInitialBalance);
        };
        const fetchStartDate = async () => {
            const date = await getStartDateFromFirestore(user.uid);
            setStartDate(date);
        };
    
        fetchStartDate();
        fetchInitialBalance(); // 非同期関数を呼び出す
    }, [user]); 

    useEffect(() => {
        const fetchStartingBalance = async () => {
            const balance = await getStartingBalanceForYear(selectedYear);
            setStartingBalance(balance);
            setFetched(true); // データが取得されたことを示す
        };
        fetchStartingBalance();
    }, [selectedYear, user]);
    
    useEffect(() => {
        if (!user) return; 
        const getYearlyBalance = async (targetYear) => {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
                    
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                // summaryが存在するか確認
                const summaryData = userData.summary || [];
                const yearSummary = summaryData.find(item => item.year === targetYear);
                        
                if (yearSummary) {
                    return yearSummary.balance;
                }
            }
            return null;
        };
        
    
        const updateBalance = async () => {
            let balance = currentBalance;
            const currentYear = new Date().getFullYear();
    
            if (selectedYear === 'this year') {
                balance = await getYearlyBalance(currentYear);
            } else if (selectedYear === 'last year') {
                balance = await getYearlyBalance(currentYear - 1);
            }
            if (balance !== null) {
                setInitialBalance(balance);

            }
        };

        const fetchDataAndUpdateBalance = async () => {
            let balance = 0;

            switch (selectedYear) {
                case 'this year':
                    balance = await getYearlyBalance(new Date().getFullYear());
                    break;
                case 'last year':
                    balance = await getYearlyBalance(new Date().getFullYear() - 1);
                    break;
                case 'all time':
                    const balanceData = await getInitialBalanceFromFirestore();
                    const initialBalance = parseFloat(balanceData);
                    // 全てのトレードの利益を加える
                    const totalProfit = trades.reduce((acc, trade) => acc + (trade.PROFIT ? parseFloat(trade.PROFIT) : 0), 0);
                    balance = initialBalance + totalProfit;
                    break;
                default:
                    break;
            }

            setCurrentBalance(balance);
        };
    
        const fetchStartingBalance = async () => {
            const balance = await getStartingBalanceForYear(selectedYear);
            setStartingBalance(balance);
        };
        fetchDataAndUpdateBalance();
        updateBalance();
        fetchStartingBalance();
    }, [selectedYear]);

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

    useEffect(() => {
        const earliestYear = Math.min(...trades.map(trade => new Date(trade.EXIT_DATE).getFullYear()));
        const currentYear = new Date().getFullYear();

        const getPreviousYearBalance = (year, summaryArray) => {
            const previousYearIndex = summaryArray.findIndex(item => item.year === (year - 1));
            if (previousYearIndex !== -1) {
                return summaryArray[previousYearIndex].balance;
            }
            return 0; // これは前年のデータが見つからなかった場合のデフォルトのバランスです
        };
        
        const calculateYearlyBalance = async (year, trades, previousBalance) => {        
            // 前年のバランスがない場合はaccountValueを取得
            if (previousBalance === null) {
                previousBalance = await getAccountValueFromSetting(user.uid);
            }
        
            let balance = previousBalance;  // 前年のバランスまたはaccountValueから開始
            trades.forEach((trade) => {
                const tradeYear = new Date(trade.EXIT_DATE).getFullYear();
                if (tradeYear !== year) return;
                const profit = trade.PROFIT ? parseFloat(trade.PROFIT) : 0;
                balance += profit;
            });
            return balance;
        };
    
        const updateFirestore = async () => {
            if (user) {
                // Step 1: Firestoreからsummaryを取得
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (!userDocSnapshot.exists()) {
                    return;
                }
                const existingSummaries = userDocSnapshot.data().summary || [];
    
                // Step 2: 年毎のバランスを計算
                const yearsSet = new Set(trades.map(trade => new Date(trade.EXIT_DATE).getFullYear()));
                const years = [...yearsSet].sort();
                let localSummaries = [];
                for (const year of years) {
                    const previousYear = year - 1;
                    const previousYearData = existingSummaries.find(item => item.year === previousYear);
                    const previousYearBalance = previousYearData ? previousYearData.balance : null;
                    const calculatedBalance = await calculateYearlyBalance(year, trades, previousYearBalance);
                    localSummaries.push({ year, balance: calculatedBalance });
                }
    
                // Step 3: Firestoreのデータとローカルのデータを比較
                for (const existingSummary of existingSummaries) {
                    const matchingLocalSummary = localSummaries.find(item => item.year === existingSummary.year);
                    if (!matchingLocalSummary) {
                        // この年のデータをFirestoreから削除
                        await updateDoc(userDocRef, {
                            summary: arrayRemove(existingSummary)
                        });
                    }
                }
                for (const localSummary of localSummaries) {
                    const matchingExistingSummary = existingSummaries.find(item => item.year === localSummary.year);
                    if (!matchingExistingSummary) {
                        // 新しいデータをFirestoreに追加
                        await updateSummaryInFirestore(localSummary.year, localSummary.balance);
                    } else if (matchingExistingSummary.balance !== localSummary.balance) {
                        // 既存のデータをFirestoreで更新
                        await updateSummaryInFirestore(localSummary.year, localSummary.balance);
                    }
                }
            }
        };
    
        if (!loading) {
            updateFirestore();
        }
    }, [trades, loading]);
    
    const data = useMemo(() => {
        const currentYear = new Date().getFullYear();
    
        let year;
        switch (selectedYear) {
            case 'this year':
                year = currentYear;
                break;
            case 'last year':
                year = currentYear - 1;
                break;
            case 'all time':
                year = null;
                break;
            default:
                year = parseInt(selectedYear, 10);
                break;
        }
    
        if (!fetched || !startingBalance || !startDate) {
            return [];
        }
    
        let balance = startingBalance;
    
        if (year === null) {  // all timeの場合
            const tradesSortedByDate = [...filteredTrades].sort((a, b) => new Date(a.EXIT_DATE) - new Date(b.EXIT_DATE));
            const latestTradeDate = new Date(tradesSortedByDate[tradesSortedByDate.length - 1].EXIT_DATE);
            const monthsDiff = (latestTradeDate.getFullYear() - new Date(startDate).getFullYear()) * 12 + latestTradeDate.getMonth() - new Date(startDate).getMonth() + 1;
            const profits = Array(monthsDiff).fill(0);
    
            tradesSortedByDate.forEach((trade) => {
                const date = new Date(trade.EXIT_DATE);
                const monthsSinceStart = (date.getFullYear() - new Date(startDate).getFullYear()) * 12 + date.getMonth() - new Date(startDate).getMonth();
                const profit = trade.PROFIT ? parseFloat(trade.PROFIT) : 0;
                profits[monthsSinceStart] += profit;
            });
    
            return profits.map((profit, index) => {
                const date = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + index, 1);
                balance += profit;
                return {
                    name: `${date.getFullYear()}年${date.getMonth() + 1}月`,
                    balance: parseFloat(balance.toFixed(2))
                };
            });
        }
    
        const monthlyProfits = Array(12).fill(0);
        const startYear = new Date(startDate).getFullYear();
        const startMonth = new Date(startDate).getMonth();
    
        filteredTrades.forEach((trade) => {
            const date = new Date(trade.EXIT_DATE);
            const month = date.getMonth();
            const tradeYear = date.getFullYear();
            if (year === tradeYear || year === null) {
                const profit = trade.PROFIT ? parseFloat(trade.PROFIT) : 0;
                monthlyProfits[month] += profit;
            }
        });
    
        return monthlyProfits.map((profit, index) => {
            if (year === startYear && index < startMonth) {
                return {
                    name: `${index + 1}月`,
                    balance: 0.00
                };
            }
            balance += profit;
            return {
                name: `${index + 1}月`,
                balance: parseFloat(balance.toFixed(2))
            };
        });
    }, [filteredTrades, startingBalance, fetched, startDate, selectedYear]);


    // 最大値を見つける
    const maxBalance = Math.max(...data.map(item => parseFloat(item.balance)));

    // 最大値を元にY軸の最大値を設定する
    let yAxisMax;
    if (maxBalance <= 500) {
        yAxisMax = 500;
    } else if (maxBalance <= 750) {
        yAxisMax = 750;
    } else {
        yAxisMax = Math.ceil(maxBalance / 500) * 500;  // 500の倍数になるように調整
    }

    useEffect(() => {
        if(!user) return
        const fetchSummaryData = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const lastYear = new Date().getFullYear() - 1;
                const lastYearData = userData.summary?.find(item => item.year === lastYear);
                setHasLastYearData(!!lastYearData);
            }
        };
    
        fetchSummaryData();
    }, [user, db]);  // 依存変数を適切に設定
    
    return (
        <div className="chartContainer">
            <div className="chartCard__select">
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="this year">This year</option>
                    {hasLastYearData && <option value="last year">Last year</option>}
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
                <YAxis domain={[0, yAxisMax]}/>
                <Tooltip />
                <Area type="monotone" dataKey="balance" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </div>
    )
}

export default AccountChart;
