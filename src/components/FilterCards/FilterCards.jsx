import { CaretDown } from '@phosphor-icons/react'
import React, { useContext } from 'react'
import "./_filterCards.styl"
import { FilterCardsContext } from '../../contexts/FilterCardsContext';
import { TradesContext } from '../../contexts/TradesContext';
import { colors, getPairColor, getPairColorBg } from '../../constants/colors';

const FilterCards = () => {
    const { trades } = useContext(TradesContext);
    const { selectedFilters, setSelectedFilters } = useContext(FilterCardsContext);
    const uniquePairs = [...new Set(trades.map(trade => trade.PAIRS))].filter(pair => pair !== '');

    const getRandomColor = () => {
        const colorKeys = Object.keys(colors);
        const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        return colors[randomKey];
    }

    const toggleFilter = (filter) => {
        if (filter === 'SUMMARY') {
            if (selectedFilters.includes('SUMMARY')) {
                setSelectedFilters([]); 
            } else {
                setSelectedFilters(['SUMMARY']);
            }
        } else {
            setSelectedFilters(['SUMMARY', filter]);
        }
    }
    

  return (
    <ul className="filterCards">
        <li className={`filterCards__item filterCards__summary ${selectedFilters.includes('SUMMARY') ? 'active' : ''}`} 
            onClick={() => toggleFilter('SUMMARY')}>
            <span>SUMMARY</span>
            <CaretDown className='filterCards__arrow'/>
        </li>

        {uniquePairs.map((pair, index) => {
            const currentColor = getPairColor(pair) || colors.default; // 該当する色がない場合はデフォルトの色を使用
            return (
                <li
                    key={index}
                    className={`filterCards__item ${selectedFilters.includes(pair) ? 'active' : ''}`}
                    onClick={() => toggleFilter(pair)}
                    style={{ outlineColor: currentColor }}
                >
                    <span className='filterCards__bullet' style={{ backgroundColor: currentColor }}></span>
                    <span>{pair}</span>
                </li>
            );
        })}

    </ul>
  )
}

export default FilterCards
