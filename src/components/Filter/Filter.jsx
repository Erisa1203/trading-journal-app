import { CaretDown } from '@phosphor-icons/react'
import React, { useContext, useState } from 'react'
import "./_filter.styl"
import Select from "react-select";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { Check } from 'phosphor-react';
import { FilterContext } from '../../contexts/FilterContext';
import { TradesContext } from '../../contexts/TradesContext'
import { useCustomSetupCreation } from '../../hooks/useCustomSetupCreation';
import { useCustomPatternCreation } from '../../hooks/useCustomPatternCreation';
import { resetTime } from '../../services/filter';
import { useCustomOptionCreation } from '../../hooks/useCustomOptionCreation';

const dirOptions = [
    { value: "LONG", label: "LONG" },
    { value: "SHORT", label: "SHORT" },
];

const Filter = ({ isActive, dbSetupOptions, setDbSetupOptions, dbPatternOptions, setDbPatternOptions,  }) => {
    const { trades, setFilteredTrades } = useContext(TradesContext);
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndtDate] = useState('')

    const { filterIsActive } = useContext(FilterContext);
    const [selectedDir, setSelectedDir] = useState(null);
    const [setupOptions, handleCreateNewSetupOption] = useCustomSetupCreation([], setDbSetupOptions);
    const [ handleCreateNewPatternOption ] = useCustomPatternCreation([], setDbPatternOptions);
    const [dbCurrencyOptions, setDbCurrencyOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [currencyOptions, handleCreateNewOption, loading, setLoading] = useCustomOptionCreation([], setDbCurrencyOptions, setSelectedOption);
    const modifiedCurrencyOptions = currencyOptions.map(({ color, ...rest }) => rest);
    const [selectedSetupOption, setSelectedSetupOption] = useState(null);
    const [selectedPatternOption, setSelectedPatternOption] = useState(null);

    const [status, setStatus] = useState({
        WIN: false,
        LOSS: false,
        OVER_3: false,
        ALL: false
    });

    const handleSearch = (e) => {
        e.preventDefault();
        
        let currentFilteredTrades = trades;
        
        // 1. startDate と endDate の存在を確認
        if (startDate && endDate) {
            currentFilteredTrades = currentFilteredTrades.filter(trade => {
                let tradeDate = resetTime(new Date(trade.ENTRY_DATE));
                return tradeDate >= startDate && tradeDate <= endDate;
            });
        }
        
        // 2. SETUP の存在を確認
        if (selectedSetupOption) {
            currentFilteredTrades = currentFilteredTrades.filter(trade => trade.SETUP === selectedSetupOption.value);
        }
    
        // 3. PATTERN の存在を確認
        if (selectedPatternOption) {
            currentFilteredTrades = currentFilteredTrades.filter(trade => trade.PATTERN === selectedPatternOption.value);
        }
        
        // 4. PAIRの存在を確認
        if (selectedOption) {
            currentFilteredTrades = currentFilteredTrades.filter(trade => trade.PAIRS === selectedOption.value);
        }
    
        // 5. DIRの存在を確認
        if (selectedDir) {
            currentFilteredTrades = currentFilteredTrades.filter(trade => trade.DIR === selectedDir.value);
        }
        
        // 6. WIN/LOSS などの条件でフィルタリング
        if (status.WIN || status.LOSS) {
            currentFilteredTrades = currentFilteredTrades.filter(trade => {
                if (status.WIN && trade.STATUS === "WIN") return true;
                if (status.LOSS && trade.STATUS === "LOSS") return true;
                return false;
            });
        }
            
        if (status.OVER_3) {
            currentFilteredTrades = currentFilteredTrades.filter(trade => Number(trade.RETURN) >= 3);
        }
        
        // フィルタリングされたトレードをセット
        setFilteredTrades(currentFilteredTrades);
    }
    
    return (
        <form className={`filter ${filterIsActive ? 'active' : ''}`}>
            <div className="filter__left">
                <div className='filter__title'>STATUS</div>
                <div className="filter__status">
                    <label className='form-checkbox'>
                        <input 
                            type="checkbox" 
                            checked={status.WIN} 
                            onChange={() => setStatus(prev => ({ ...prev, WIN: !prev.WIN }))}
                        />                        
                        <span className='form-checkbox__box'><Check weight="bold" className='icon-16 form-checkbox__check'/></span>
                        <span className='form-checkbox__label'>WIN</span>
                    </label>
                    <label className='form-checkbox'>
                        <input 
                            type="checkbox" 
                            checked={status.LOSS}
                            onChange={() => setStatus(prev => ({ ...prev, LOSS: !prev.LOSS }))}
                        />                        
                        <span className='form-checkbox__box'><Check weight="bold" className='icon-16 form-checkbox__check'/></span>
                        <span className='form-checkbox__label'>LOSS</span>
                    </label>
                    <label className='form-checkbox'>
                        <input 
                            type="checkbox" 
                            checked={status.OVER_3} 
                            onChange={() => setStatus(prev => ({ ...prev, OVER_3: !prev.OVER_3 }))}
                        />
                        <span className='form-checkbox__box'><Check weight="bold" className='icon-16 form-checkbox__check'/></span>
                        <span className='form-checkbox__label'>OVER 3%</span>
                    </label>
                    <label className='form-checkbox'>
                        <input 
                            type="checkbox" 
                            checked={status.ALL} 
                            onChange={() => setStatus(prev => ({ ...prev, ALL: !prev.ALL }))}
                        />
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
                            value={selectedOption}
                            onChange={(option) => setSelectedOption(option)}
                            options={modifiedCurrencyOptions}
                            className="form-select"
                            classNamePrefix="form-select"
                        />
                    </div>
                    <div className="filter__box">
                        <label className='filter__title'>DIR</label>
                        <Select
                            value={selectedDir}
                            onChange={(option) => setSelectedDir(option)}
                            options={dirOptions}
                            className="form-select"
                            classNamePrefix="form-select"
                        />
                    </div>
                    <div className="filter__box">
                        <label className='filter__title'>SETUPS</label>
                        <Select
                            value={selectedSetupOption}
                            options={dbSetupOptions}
                            onChange={(option) => setSelectedSetupOption(option)}
                            className="form-select"
                            classNamePrefix="form-select"
                        />
                    </div>
                    <div className="filter__box">
                        <label className='filter__title'>PATTERN</label>
                        <Select
                            value={selectedPatternOption}
                            onChange={(option) => setSelectedPatternOption(option)}
                            options={dbPatternOptions}
                            className="form-select"
                            classNamePrefix="form-select"
                        />
                    </div>
                </div>
                <div className="filter__footer">
                    <div className="filter__box">
                        <label className='filter__title'>FROM</label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(resetTime(date))} placeholderText="Select a start date"/>
                    </div>
                    <div className="filter__box">
                        <label className='filter__title'>TO</label>
                        <DatePicker selected={endDate} onChange={(date) => setEndtDate(resetTime(date))} placeholderText="Select a start date"/>
                    </div>
                    <button className='btn btn--primary' onClick={(e) => handleSearch(e)}>SEARCH</button>
                </div>
            </div>

        </form>
    )
}

export default Filter
