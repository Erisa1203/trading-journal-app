import { CaretDown, X } from '@phosphor-icons/react'
import React, { useContext } from 'react'
import "./_filterUI.styl"
import { FilterContext } from '../../contexts/FilterContext';
import { INITIAL_FILTER_STATE } from '../../services/filter';

const FilterUI = ({filteredOption, setClearFilterIsActive, setFilteredOption, setFilterUIClearClicked}) => {
  const { filterIsActive, filterHandleClick } = useContext(FilterContext);

  
  const getDisplayNameForKey = (key, value) => {
    const displayNames = {
        'WIN': 'WIN',
        'LOSS': 'LOSS',
        'OVER_3': 'OVER 3%',
        'FROM': `from: ${value}`,
        'TO': `to: ${value}`
    };

        return displayNames[key] || value;
    }

    const clearFilters = () => {
        setClearFilterIsActive(true)
        setFilteredOption(INITIAL_FILTER_STATE);
    }

    const filterItems = Object.keys(filteredOption).map(key => {
        const value = filteredOption[key];
    
        if (value !== false && value !== '') {            
            return (
                <li key={key} className="filteredItems__item">
                    {getDisplayNameForKey(key, value)}
                    <X 
                        className='filteredItems__remove' 
                        onClick={() => {
                            setFilterUIClearClicked(key); // この行はそのまま残します
                            setFilteredOption(prevOptions => ({
                                ...prevOptions,
                                [key]: '' // クリックされたアイテムに対応するキーの値を空に更新
                            }));
                        }}
                    />
                </li>
            );
        }
        return null; // 値がfalseまたは空の場合、nullを返して表示しない
    });
    

  return (
    <div className="filterUI">
        <div className={`filterBtn ${filterIsActive ? 'active' : ''}`} onClick={filterHandleClick} >
            <span>filter</span>
            <CaretDown className='filterBtn__icon'/>
        </div>
        <ul className="filteredItems">
          {filterItems}
        </ul>
        <div className="clearFilters" onClick={clearFilters}>clear filters</div>
    </div>
  )
}

export default FilterUI
