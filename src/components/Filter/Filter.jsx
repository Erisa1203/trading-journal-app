import { CaretDown } from '@phosphor-icons/react'
import React, { useContext, useState } from 'react'
import "./_filter.styl"
import Select from "react-select";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { Check } from 'phosphor-react';
import { FilterContext } from '../../contexts/FilterContext';

// オプションデータ
const currencyOptions = [
    { value: "EURUSD", label: "EURUSD" },
    { value: "EURJPY", label: "EURJPY" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
];

const Filter = ({ isActive }) => {
    const [startDate, setStartDate] = useState(new Date());
    const { filterIsActive } = useContext(FilterContext);


    // const [selectedCurrencyOption, setSelectedCurrencyOption] = useState(null);
    
    // const handleChangeCurrency = (option) => {
    //     setSelectedCurrencyOption(currencyOptions);
    // };

    return (
        <form className={`filter ${filterIsActive ? 'active' : ''}`}>
            <div className="filter__left">
                <div className='filter__title'>STATUS</div>
                <div className="filter__status">
                    <label className='form-checkbox'>
                        <input type="checkbox" />
                        <span className='form-checkbox__box'><Check weight="bold" className='icon-16 form-checkbox__check'/></span>
                        <span className='form-checkbox__label'>WIN</span>
                    </label>
                    <label className='form-checkbox'>
                        <input type="checkbox" />
                        <span className='form-checkbox__box'><Check weight="bold" className='icon-16 form-checkbox__check'/></span>
                        <span className='form-checkbox__label'>LOSS</span>
                    </label>
                    <label className='form-checkbox'>
                        <input type="checkbox" />
                        <span className='form-checkbox__box'><Check weight="bold" className='icon-16 form-checkbox__check'/></span>
                        <span className='form-checkbox__label'>OVER 3%</span>
                    </label>
                    <label className='form-checkbox'>
                        <input type="checkbox" />
                        <span className='form-checkbox__box'><Check weight="bold" className='icon-16 form-checkbox__check'/></span>
                        <span className='form-checkbox__label'>ALL</span>
                    </label>
                </div>
            </div>
            <div className="filter__right">
                <div className="filter__head">
                    <div className="filter__box">
                        <label className='filter__title'>PAIRS</label>
                        <Select
                            // value={selectedCurrencyOption}
                            // onChange={handleChangeCurrency}
                            options={currencyOptions}
                            className="form-select"
                            classNamePrefix="form-select"
                        />
                    </div>
                    <div className="filter__box">
                        <label className='filter__title'>DIR</label>
                        <Select
                            // value={selectedCurrencyOption}
                            // onChange={handleChangeCurrency}
                            options={currencyOptions}
                            className="form-select"
                            classNamePrefix="form-select"
                        />
                    </div>
                    <div className="filter__box">
                        <label className='filter__title'>SETUPS</label>
                        <Select
                            // value={selectedCurrencyOption}
                            // onChange={handleChangeCurrency}
                            options={currencyOptions}
                            className="form-select"
                            classNamePrefix="form-select"
                        />
                    </div>
                    <div className="filter__box">
                        <label className='filter__title'>PATTERN</label>
                        <Select
                            // value={selectedCurrencyOption}
                            // onChange={handleChangeCurrency}
                            options={currencyOptions}
                            className="form-select"
                            classNamePrefix="form-select"
                        />
                    </div>
                </div>
                <div className="filter__footer">
                    <div className="filter__box">
                        <label className='filter__title'>FROM</label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <div className="filter__box">
                        <label className='filter__title'>TO</label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <button className='btn btn--primary'>SEARCH</button>
                </div>
            </div>

        </form>
    )
}

export default Filter
