import React from 'react'
import PotentialPerformance from '../../Chart/PotentialPerformance/PotentialPerformance'

const PotentialPerformanceCard = () => {
  return (
    <div className='chartCard chartCard--sm'>
        <div className="chartCard__head">POTENTIAL PERFORMANCE</div>

        <div className="chart">
            <PotentialPerformance />
        </div>
    </div>
  )
}

export default PotentialPerformanceCard
