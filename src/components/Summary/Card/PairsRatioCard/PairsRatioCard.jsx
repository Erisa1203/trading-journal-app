import React from 'react'
import PairsRatioChart from '../../Chart/PairsRatioChart/PairsRatioChart'

const PairsRatioCard = () => {
    return (
        <div className='chartCard chartCard--performance chartCard--flex'>
            <div className="chartCard__head">PAIRS WIN RATIO</div>
    
            <div className="chart">
                <PairsRatioChart />
            </div>
            <div className='chartCard__seeReport'>SEE REPORT</div>
        </div>
      )
}

export default PairsRatioCard

