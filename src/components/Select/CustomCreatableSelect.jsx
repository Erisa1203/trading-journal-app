import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { CustomOption } from './CustomOption';
import { CustomSingleValue } from './CustomSingleValue';

export const CustomCreatableSelect = ({ options, handleCreateNewOption, selectedOption, setSelectedOption  }) => {

    // console.log(options)
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

