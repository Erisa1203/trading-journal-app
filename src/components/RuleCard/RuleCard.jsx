import React from 'react'
import "./_ruleCard.styl"

const RuleCard = ({ rule, onClick }) => {
    // console.log(rule)

    return (
    <li className="rules__item" onClick={onClick}>
        <img src="/img/chart.png" alt="" />
        <div className="rules__title">{rule.name}</div>
        <ul className="rules__tag">
            <li>reversal</li>
        </ul>
        <ul className="check-list">
            <li className='check-list__item'>
                <span className='check-list__checkbox'></span>
                <div className="check-list__desc">{rule.rule_1}</div>
            </li>
            <li className='check-list__item'>
                <span className='check-list__checkbox'></span>
                <div className="check-list__desc">{rule.rule_2}</div>
            </li>
            <li className='check-list__item'>
                <span className='check-list__checkbox'></span>
                <div className="check-list__desc">{rule.rule_3}</div>
            </li>
        </ul>
    </li>
  )
}

export default RuleCard
