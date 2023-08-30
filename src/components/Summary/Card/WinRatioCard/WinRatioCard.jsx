import React, { useEffect, useState } from 'react'
import WinRatioChart from '../../Chart/WinRatioChart/WinRatioChart'

const WinRatioCard = () => {
    const [winRatio, setWinRatio] = useState(0);
    const [difference, setDifference] = useState(null);
    const [lastYearRatio, setLastYearRatio] = useState(null);
    const [hasTradeInfoLastYear, setHasTradeInfoLastYear] = useState(false);

    const handleUpdateRatio = (ratio, currentYearRatio, lastYearRatioValue, tradeInfoLastYear) => {
        setWinRatio(ratio);
        setLastYearRatio(lastYearRatioValue);
        setHasTradeInfoLastYear(tradeInfoLastYear);
    
        if (tradeInfoLastYear || lastYearRatioValue !== null) {
            const diff = currentYearRatio - lastYearRatioValue;
            setDifference(diff);
        }
    };

    return (
        <div className='chartCard chartCard--sm'>
            <div className="chartCard__head">WINS RATIO</div>
            <div className="chartCard__desc">
            <div className="chartCard__total">{winRatio ? winRatio.toFixed(2) : '0.00'}%</div>

            {difference !== null && (
                <span className={`chartCard__sub ${difference < 0 ? 'minus' : ''}`}>
                    {!hasTradeInfoLastYear ? '--' :
                    (difference === 0 ? '0' :
                    (difference > 0 ? `+${difference.toFixed(2)}%` : `${difference.toFixed(2)}%`))}
                </span>
            )}

           
                </div>
            <div className="chart">
                <WinRatioChart onUpdateRatio={handleUpdateRatio} />
            </div>
        </div>
    );
}


export default WinRatioCard
