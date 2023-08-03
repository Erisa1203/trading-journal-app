import { CaretDown } from '@phosphor-icons/react'
import React from 'react'
import "./_filterCards.styl"

const FilterCards = () => {
  return (
    <ul className="filterCards">
        <li className="filterCards__item filterCards__summary">
            <span>SUMMARY</span>
            <CaretDown />
        </li>
        <li className="filterCards__item filterCards__EURUSD">
            <span className='filterCards__bullet'></span>
            <span>EURUSD</span>
        </li>
        <li className="filterCards__item filterCards__USDJPY">
            <span className='filterCards__bullet'></span>
            <span>USDJPY</span>
        </li>
        <li className="filterCards__item filterCards__GBPJPY">
            <span className='filterCards__bullet'></span>
            <span>GBPJPY</span>
        </li>
        <li className="filterCards__item filterCards__AUDUSD">
            <span className='filterCards__bullet'></span>
            <span>AUDUSD</span>
        </li>
        <li className="filterCards__item filterCards__AUDGBP">
            <span className='filterCards__bullet'></span>
            <span>AUDGBP</span>
        </li>
        <li className="filterCards__item filterCards__EURJPY">
            <span className='filterCards__bullet'></span>
            <span>EURJPY</span>
        </li>
        <li className="filterCards__item filterCards__GBPUSD">
            <span className='filterCards__bullet'></span>
            <span>GBPUSD</span>
        </li>
    </ul>
  )
}

export default FilterCards
