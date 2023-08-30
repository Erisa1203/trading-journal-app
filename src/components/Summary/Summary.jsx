import React from 'react'
import FilterCards from '../FilterCards/FilterCards'
import SummaryCharts from './SummaryCharts/SummaryCharts'
import "./_summary.styl"

const Summary = () => {
  return (
    <div>
        <FilterCards />
        <SummaryCharts />
    </div>
  )
}

export default Summary
