import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { CustomOption } from './CustomOption';
import { CustomSingleValue } from './CustomSingleValue';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const CustomCreatableSelect = ({ options, handleCreateNewOption, selectedOption, setSelectedOption, rules, setRules, ruleId  }) => {

    // console.log('options', options)
    // console.log('selectedOption', selectedOption)

    const styles = {
        option: (provided) => {
            return {
                ...provided,
                width: '100%',
            }
        },
        menuList: base => ({
            ...base,
            display: 'flex',
            flexDirection: 'column',
        }),
    }

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        if (rules) {
            const updatedRules = rules.map(rule => {
                if (rule.ID === ruleId) {
                    return { ...rule, 'SETUP': selectedOption.value };
                }
                return rule;
            });
    
            setRules(updatedRules);
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
            onChange={handleChange} // <-- Update this line
        />
    )
};

