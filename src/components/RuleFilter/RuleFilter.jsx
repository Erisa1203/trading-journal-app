import React, { useState } from 'react'

const RuleFilter = ({ setup, rules, setRules, isActive, originalRules, activeFilter, setActiveFilter }) => {

    const handleClick = () => {
        if (setup.label === activeFilter) {
            setActiveFilter(null);
        } else {
            setActiveFilter(setup.label);
        }
    };
    
    

    return (
        <li 
            className={`ruleFilter__item ${isActive ? 'active' : ''}`} 
            onClick={handleClick}
        >
            {setup.label}
        </li>
    )
}

export default RuleFilter;
