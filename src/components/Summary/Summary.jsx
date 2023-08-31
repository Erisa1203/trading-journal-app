import React, { createContext, useState } from 'react'
import FilterCards from '../FilterCards/FilterCards'
import SummaryCharts from './SummaryCharts/SummaryCharts'
import "./_summary.styl"
import { FilterCardsContext } from '../../contexts/FilterCardsContext'

const Summary = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  return (
      <FilterCardsContext.Provider value={{ selectedFilters, setSelectedFilters }}>
          <div>
              <FilterCards />
              {(selectedFilters.includes('SUMMARY') || selectedFilters.length > 0) && <SummaryCharts />}
          </div>
      </FilterCardsContext.Provider>
  )
}


export default Summary
