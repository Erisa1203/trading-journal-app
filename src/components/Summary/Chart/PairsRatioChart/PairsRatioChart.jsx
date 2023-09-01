import React, { useContext, useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TradesContext } from '../../../../contexts/TradesContext';
import RoundedBar from '../RoundBar';
import CustomBackground from '../CustomBackground';

const PairsRatioChart = () => {
    const { trades } = useContext(TradesContext);

    const [chartWidth, setChartWidth] = useState(0);
    const chartRef = useRef(null);

    const calculatePairsWinRate = (pair) => {
        const filteredTrades = trades.filter(trade => trade.PAIRS === pair);
        const totalTrades = filteredTrades.length;
        const winningTrades = filteredTrades.filter(trade => trade.STATUS === 'WIN').length;

        return totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;
    }

    const uniquePairs = [...new Set(trades.map(trade => trade.PAIRS))].filter(pair => pair !== '');
    uniquePairs.sort();

    const data = uniquePairs.map(pair => ({
        name: pair,
        value: calculatePairsWinRate(pair)
    }));

    useEffect(() => {
        const updateWidth = () => {
            if (chartRef.current) {
                setChartWidth(chartRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    return (
        <div className='performance' ref={chartRef}>
            {data.map((item, index) => (
                <div key={index} className="performance__item">
                    <div className="performance__desc">
                        <div className="performance__name">{item.name}</div>
                        <div className="performance__value">{item.value.toFixed(2)}%</div>
                    </div>
                    <div className="performance__chart">
                        {chartWidth > 0 && (
                            <BarChart
                                width={chartWidth}
                                height={30}
                                data={[item]} 
                                layout="vertical"
                                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                                <XAxis type="number" tick={false} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" hide={true} padding={{ top: 30}} />
                                <Bar dataKey="value" fill="#8884d8" background={<CustomBackground fill="#E0E0E0" />} barSize={15} shape={<RoundedBar />} />
                            </BarChart>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PairsRatioChart;
