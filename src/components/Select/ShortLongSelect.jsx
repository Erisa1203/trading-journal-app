import React from 'react';
import Select from 'react-select';
import { CustomOption } from './CustomOption';
import { CustomSingleValue } from './CustomSingleValue';
import { backgrounds } from '../../constants/colors';
import { shortLongOptions } from '../../services/trades';



export const ShortLongSelect = ({ selectedDirOption, setSelectedDirOption, updateDirOption }) => {
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

    const handleChange = (selectedDirOption) => {
        setSelectedDirOption(selectedDirOption);
        updateDirOption(selectedDirOption);
    };

    return (
        <Select
            isClearable
            options={shortLongOptions}
            placeholder="Select SHORT or LONG..."
            className="note-select"
            classNamePrefix="note-select"
            components={{
                Option: CustomOption,
                SingleValue: CustomSingleValue,
            }}
            styles={styles}
            value={selectedDirOption}
            onChange={handleChange}
        />
    );
};
