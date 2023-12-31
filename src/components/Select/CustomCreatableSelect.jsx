import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { CustomOption } from './CustomOption';
import { CustomSingleValue } from './CustomSingleValue';

export const CustomCreatableSelect = ({ options, handleCreateNewOption, selectedOption, setSelectedOption, rules, setRules, ruleId  }) => {

    const styles = {
        option: (provided) => ({ ...provided, width: '100%' }),
        menuList: base => ({ ...base, display: 'flex', flexDirection: 'column' }),
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    
        if (rules && ruleId) {
            setRules(rules.map(rule => rule.ID === ruleId ? { ...rule, 'SETUP': selectedOption.value } : rule));
        }
    };

    return (
        <CreatableSelect
            isClearable
            onCreateOption={handleCreateNewOption}
            options={options}
            placeholder="Select or type to create..."
            className="note-select"
            classNamePrefix="note-select"
            components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
            }}
            styles={styles}
            value={selectedOption}
            onChange={handleChange}
        />
    )
};

