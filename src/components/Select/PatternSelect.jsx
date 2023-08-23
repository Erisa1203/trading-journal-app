import React from 'react';
import Select from 'react-select';
import { CustomOption } from './CustomOption';
import { CustomSingleValue } from './CustomSingleValue';
import { backgrounds } from '../../constants/colors';
import { patternOption } from '../../services/trades';



export const PatternSelect = ({ selectedPatternOption, setSelectedPatternOption, updatePatternOption }) => {
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
    };

    const handleChange = (selectedPatternOption) => {
        setSelectedPatternOption(selectedPatternOption);
        updatePatternOption(selectedPatternOption);
    };

    return (
        <Select
            isClearable
            options={patternOption}
            placeholder="Select reversal or continuation...."
            className="note-select"
            classNamePrefix="note-select"
            components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
            }}
            styles={styles}
            value={selectedPatternOption}
            onChange={handleChange}
        />
    );
};
