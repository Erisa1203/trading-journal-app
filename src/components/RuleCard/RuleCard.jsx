import React from 'react'
import "./_ruleCard.styl"

const RuleCard = ({ rule, onClick }) => {

    return (
    <li className="rules__item" onClick={onClick}>
        <img src="/img/chart.png" alt="" />
        <div className="rules__title">{rule.name}</div>
        <ul className="rules__tag">
                <li>{rule.pattern}</li>
        </ul>
        <ul className="check-list">
            {rule.rule_1 && (
                <li className='check-list__item'>
                    <span className='check-list__checkbox'></span>
                    <div className="check-list__desc">{rule.rule_1}</div>
                </li>
            )}
            {rule.rule_2 && (
                <li className='check-list__item'>
                    <span className='check-list__checkbox'></span>
                    <div className="check-list__desc">{rule.rule_2}</div>
                </li>
            )}
            {rule.rule_3 && (
                <li className='check-list__item'>
                    <span className='check-list__checkbox'></span>
                    <div className="check-list__desc">{rule.rule_3}</div>
                </li>
            )}
        </ul>
    </li>
  )
}

export default RuleCard
