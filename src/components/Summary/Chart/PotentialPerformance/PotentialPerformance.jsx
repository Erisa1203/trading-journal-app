import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TradesContext } from '../../../../contexts/TradesContext';
import RoundedBar from '../RoundBar';
import CustomBackground from '../CustomBackground';

const PotentialPerformance = () => {
    const { trades } = useContext(TradesContext);
    // ウィンドウの幅を取得するための state
    const [chartWidth, setChartWidth] = useState(0);
    const chartRef = useRef(null);

    const calculateDirectionalWinRate = (direction) => {
        const totalTrades = trades.filter(trade => trade.DIR === direction).length;
        const winningTrades = trades.filter(trade => trade.DIR === direction && trade.STATUS === 'WIN').length;

        return totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;
    }

    const calculateSetupWinRate = (setup) => {
        const totalTrades = trades.filter(trade => trade.SETUP === setup).length;
        const winningTrades = trades.filter(trade => trade.SETUP === setup && trade.STATUS === 'WIN').length;

        return totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;
    }

    // 全てのユニークなセットアップを取得
    const uniqueSetups = [...new Set(trades.map(trade => trade.SETUP))].filter(setup => setup !== '');
    uniqueSetups.sort();
    console.log('uniqueSetups', uniqueSetups)
    // 各セットアップの勝率を計算
    const setupData = uniqueSetups.map(setup => ({
        name: setup,
        value: calculateSetupWinRate(setup)
    }));

    // LONGとSHORTの勝率も計算
    const directionalData = [
        { name: 'LONG', value: calculateDirectionalWinRate('LONG') },
        { name: 'SHORT', value: calculateDirectionalWinRate('SHORT') },
    ];

    // 全てのデータを統合
    const data = [...directionalData, ...setupData];

    useEffect(() => {
        // ウィンドウの幅を設定する関数
        const updateWidth = () => {
            if (chartRef.current) {
                setChartWidth(chartRef.current.offsetWidth);
            }
        };

        // コンポーネントがマウントされた時に幅を設定
        updateWidth();
        // ウィンドウサイズが変更されたときにも幅を再設定
        window.addEventListener('resize', updateWidth);

        // クリーンアップ関数（コンポーネントがアンマウントされたときの処理）
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
                        {/* chartWidthが0より大きい場合のみBarChartをレンダリング */}
                        {chartWidth > 0 && (
                            <BarChart
                                width={chartWidth}
                                height={15}
                                data={[item]} 
                                layout="vertical"
                                margin={{ top: 30, right: 0, bottom: 0, left: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                                <XAxis type="number" tick={false} axisLine={false} tickLine={false} /> {/* メモリを非表示 */}
                                <YAxis type="category" dataKey="name" hide={true} /> {/* Y軸の名前を非表示 */}
                                <Tooltip 
                                    formatter={(value) => `${value.toFixed(2)}%`}
                                />
                                <Bar dataKey="value" fill="#8884d8" background={<CustomBackground fill="#E0E0E0" />} barSize={15} shape={<RoundedBar />} />
                            </BarChart>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
    
    
    
    
    
    
}

export default PotentialPerformance
