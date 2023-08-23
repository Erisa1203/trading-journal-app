import React from 'react'
import "./_ruleCard.styl"

const RuleCard = ({ rule, onClick }) => {

    return (
    <li className="rules__item" onClick={onClick}>
        <img src="/img/chart.png" alt="" />
        <div className="rules__title">{rule.NAME}</div>
        <ul className="rules__tag">
            {rule.PATTERN && (
                <li>{rule.PATTERN}</li>
            )}
        </ul>
        <ul className="check-list">
            {rule.RULE_1 && (
                <li className='check-list__item'>
                    <span className='check-list__checkbox'></span>
                    <div className="check-list__desc">{rule.RULE_1}</div>
                </li>
            )}
            {rule.RULE_2 && (
                <li className='check-list__item'>
                    <span className='check-list__checkbox'></span>
                    <div className="check-list__desc">{rule.RULE_2}</div>
                </li>
            )}
            {rule.RULE_3 && (
                <li className='check-list__item'>
                    <span className='check-list__checkbox'></span>
                    <div className="check-list__desc">{rule.RULE_3}</div>
                </li>
            )}
        </ul>
    </li>
  )
}

export default RuleCard
