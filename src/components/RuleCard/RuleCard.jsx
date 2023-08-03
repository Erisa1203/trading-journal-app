import React from 'react'
import "./_ruleCard.styl"

const RuleCard = () => {
  return (
    <li className="rules__item">
        <img src="/img/chart.png" alt="" />
        <div className="rules__title">DOUBLE TOP REVERSAL</div>
        <ul className="rules__tag">
        <li>reversal</li>
        </ul>
        <ul className="check-list">
        <li className='check-list__item'>
            <span className='check-list__checkbox'></span>
            <div className="check-list__desc">break out of previous high</div>
        </li>
        <li className='check-list__item'>
            <span className='check-list__checkbox'></span>
            <div className="check-list__desc">break out of previous high</div>
        </li>
        <li className='check-list__item'>
            <span className='check-list__checkbox'></span>
            <div className="check-list__desc">break out of previous high</div>
        </li>
        </ul>
    </li>
  )
}

export default RuleCard
