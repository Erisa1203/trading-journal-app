import React, { useContext, useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { TradesContext } from '../../../../contexts/TradesContext';
import { CaretDown } from 'phosphor-react';
import { FilterCardsContext } from '../../../../contexts/FilterCardsContext';

const hasTradeData = (data) => {
    return data && data.length > 0;
};

const WinRatioChart = ({ onUpdateRatio }) => {
    const { selectedFilters, setSelectedFilters } = useContext(FilterCardsContext);

    const { trades } = useContext(TradesContext);
    const [chartData, setChartData] = useState([]);
    const [timeframe, setTimeframe] = useState('this year');
    const [winRatios, setWinRatios] = useState({
        "this year": [],
        "last year": [],
        "this month": [],
        "two years ago": []
    });

    const calculateLastMonthWinRatio = () => {
        const now = new Date();
        const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
        let winCount = 0;
        let totalCount = 0;
    
        trades.forEach(trade => {
            const tradeDate = new Date(trade.ENTRY_DATE);
            if (tradeDate >= firstDayOfLastMonth && tradeDate <= lastDayOfLastMonth) {
                if (trade.STATUS === "WIN") {
                    winCount++;
                }
                totalCount++;
            }
        });
    
        return totalCount === 0 ? 0 : (winCount / totalCount) * 100;
    };
    
    const calculateWinRatio = (specificTimeframe, filteredTrades) => {
        const monthlyWins = {};
        const monthlyTrades = {};
        const dailyWins = {};
        const dailyTrades = {};
        const now = new Date();
        let targetYear = now.getFullYear();
    
        if (specificTimeframe === 'last year') {
            targetYear -= 1;
        }
        
        if (specificTimeframe === 'two years ago') {
            targetYear -= 2;
        }
        
        filteredTrades.forEach(trade => {
            const tradeDate = new Date(trade.ENTRY_DATE);
            const month = tradeDate.getMonth();
            const year = tradeDate.getFullYear();
            const day = tradeDate.getDate();
            
            
            if (specificTimeframe === 'this month' && (month !== now.getMonth() || year !== now.getFullYear())) {
                return;
            }
            
            if (year !== targetYear && (specificTimeframe === 'this year' || specificTimeframe === 'last year' || specificTimeframe === 'two years ago')) {
                return;
            }
         
            if (specificTimeframe === 'this month') {
                if (!dailyWins[day]) dailyWins[day] = 0;
                if (!dailyTrades[day]) dailyTrades[day] = 0;
                
                if (trade.STATUS === "WIN") {
                    dailyWins[day]++;
                }
                
                dailyTrades[day]++;
            } else {
                if (!monthlyWins[month]) monthlyWins[month] = 0;
                if (!monthlyTrades[month]) monthlyTrades[month] = 0;
                
                if (trade.STATUS === "WIN") {
                    monthlyWins[month]++;
                }
                
                monthlyTrades[month]++;
            }
        });
    
        let data = [];
        let totalWins = 0;
        let totalTrades = 0;
    
        if (specificTimeframe === 'this month') {
            data = Object.keys(dailyTrades).map(day => {
                const winRate = (dailyWins[day] / dailyTrades[day]) * 100;
                return {
                    name: `${day}日`,
                    uv: winRate
                };
            });
            totalWins = Object.values(dailyWins).reduce((acc, val) => acc + val, 0);
            totalTrades = Object.values(dailyTrades).reduce((acc, val) => acc + val, 0);
        } else {
            data = Object.keys(monthlyTrades).map(month => {
                const winRate = (monthlyWins[month] / monthlyTrades[month]) * 100;
                return {
                    name: new Date(targetYear, month).toLocaleString('ja-JP', { month: 'short' }),
                    uv: winRate
                };
            });
            totalWins = Object.values(monthlyWins).reduce((acc, val) => acc + val, 0);
            totalTrades = Object.values(monthlyTrades).reduce((acc, val) => acc + val, 0);
        }
    
        const overallWinRatio = totalTrades !== 0 ? (totalWins / totalTrades) * 100 : 0;
        return {
            data,
            overallWinRatio
        };
    };
    
    
    useEffect(() => {
        const allTimeframes = ["this year", "last year", "this month", "two years ago"];
        const allRatios = {};

        let filteredTrades;

        if (selectedFilters.length === 1 && selectedFilters.includes('SUMMARY')) {
            filteredTrades = trades;
        } else {
            filteredTrades = trades.filter(trade => selectedFilters.includes(trade.PAIRS));
        }

        allTimeframes.forEach(tf => {
            allRatios[tf] = calculateWinRatio(tf, filteredTrades);
        });
    
        setWinRatios(allRatios);
        const currentData = allRatios['this year'];
    
        setChartData(currentData);
        onUpdateRatio(currentData.overallWinRatio);
    
    }, [trades, selectedFilters]);
    
        
    useEffect(() => {
        const currentData = winRatios[timeframe];
        setChartData(currentData);
    
        if (currentData) {
            switch (timeframe) {
                case 'this year':
                    onUpdateRatio(
                        currentData.overallWinRatio,
                        winRatios["this year"].overallWinRatio,
                        winRatios["last year"] ? winRatios["last year"].overallWinRatio : null,
                        hasTradeData(winRatios["last year"]?.data)
                    );
                    break;
    
                case 'last year':
                    onUpdateRatio(
                        currentData.overallWinRatio,
                        winRatios["last year"].overallWinRatio,
                        winRatios["two years ago"] ? winRatios["two years ago"].overallWinRatio : null,
                        hasTradeData(winRatios["two years ago"]?.data)
                    );
                    break;
    
                case 'this month':
                    onUpdateRatio(
                        currentData.overallWinRatio,
                        winRatios["this month"].overallWinRatio,
                        calculateLastMonthWinRatio(),
                        hasTradeData(winRatios["this month"]?.data) // ここでは直近の月のデータの有無を確認
                    );
                    break;

                default:
                    break;
            }
        }
    }, [timeframe, winRatios]);
    
    

    const [chartWidth, setChartWidth] = useState(window.innerWidth);

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


    return (
        <div className="chartContainer">
            <div className="chartCard__select">
                <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                    <option value="this year">This Year</option>
                    <option value="last year">Last Year</option>
                    <option value="this month">This Month</option>
                </select>
                <CaretDown className='chartCard__select__arrow'/>
            </div>
            <LineChart width={chartWidth} height={300} data={chartData.data}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
            </LineChart>
        </div>
    );
}

export default WinRatioChart;
