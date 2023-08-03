import { CaretDown, X } from '@phosphor-icons/react'
import React, { useContext } from 'react'
import "./_filterUI.styl"
import { FilterContext } from '../../contexts/FilterContext';

const FilterUI = () => {
  const { filterIsActive, filterHandleClick } = useContext(FilterContext);

  return (
    <div className="filterUI">
        <div className={`filterBtn ${filterIsActive ? 'active' : ''}`} onClick={filterHandleClick} >
            <span>filter</span>
            <CaretDown className='filterBtn__icon'/>
        </div>
        <ul className="filteredItems">
            <li className="filteredItems__item">WIN<X className='filteredItems__remove'/></li>
            <li className="filteredItems__item">EUR/USD<X className='filteredItems__remove'/></li>
            <li className="filteredItems__item">SHORT<X className='filteredItems__remove'/></li>
            <li className="filteredItems__item">DT RV<X className='filteredItems__remove'/></li>
            <li className="filteredItems__item">FROM 2023/12/23<X className='filteredItems__remove'/></li>
            <li className="filteredItems__item">TO 2023/12/30<X className='filteredItems__remove'/></li>
        </ul>
        <div className="clearFilters">clear filters</div>
    </div>
  )
}

export default FilterUI
