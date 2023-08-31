import React from 'react'
import PotentialPerformance from '../../Chart/PotentialPerformance/PotentialPerformance'

const PotentialPerformanceCard = () => {
  return (
    <div className='chartCard chartCard--performance chartCard--flex'>
        <div className="chartCard__head">POTENTIAL PERFORMANCE</div>

        <div className="chart">
            <PotentialPerformance />
        </div>
        <div className='chartCard__seeReport'>SEE REPORT</div>
    </div>
  )
}

export default PotentialPerformanceCard
