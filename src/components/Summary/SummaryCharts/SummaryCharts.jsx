import React from 'react'
import WinRatioCard from '../Card/WinRatioCard/WinRatioCard'
import AccountCard from '../Card/AccountCard/AccountCard'
import PotentialPerformanceCard from '../Card/PotentialPerformanceCard/PotentialPerformanceCard'

const SummaryCharts = () => {
  return (
    <div className='charts'>
        <AccountCard />
        <WinRatioCard />
        <PotentialPerformanceCard />
    </div>
  )
}

export default SummaryCharts
