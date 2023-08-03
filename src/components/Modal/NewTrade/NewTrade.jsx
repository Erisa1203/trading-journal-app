import { ArrowRight, Article, Calendar, CaretDoubleRight, CaretDown, CaretUp, ChartLineUp, Coin, Crosshair, DotsSixVertical, ListBullets, Palette, Percent, Tag, TextAa, TextHOne, TextHThree, TextHTwo } from 'phosphor-react'
import React, { useState } from 'react'
import "./_newTrade.styl"
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { TextB } from '@phosphor-icons/react';
import CreatableSelect from 'react-select/creatable';

const colors = {
    default: "#343330",
    gray: "#7C7C7C",
    orange: "#E0A166",
    yellow: "#E0D466",
    green: "#66E081",
    blue: "#6681E0",
    purple: "#8D66E0",
    pink: "#CF66E0",
    red: "#E06666"
};

const backgrounds = {
    gray: "#EFEFEF",
    orange: "#FBF4ED",
    yellow: "#FBFAED",
    green: "#EDFBF0",
    blue: "#EDF0FB",
    purple: "#F1EDFB",
    pink: "#F9EDFB",
    red: "#FBEDED"
};


const NewTrade = ({ visible, onClose }) => {
    const [startDate, setStartDate] = useState(new Date());
    
    const CustomOption = ({ innerProps, label, data }) => (
        <div {...innerProps} style={{
            padding: '8px 16px',
            marginTop: '8px',
            borderRadius: '4px',
            backgroundColor: data.background,
            display: 'inline-block',
            width: 'auto',
            whiteSpace: 'nowrap',
            fontWeight: '700'
        }}>
            {label}
        </div>
    );
    const styles = {
        option: (provided, state) => ({
            ...provided,
            padding: '8px 16px',
            marginTop: '8px',
            display: 'inline-block',
            width: 'auto',
            whiteSpace: 'nowrap',
            
        }),
        menuList: base => ({
            ...base,
            display: 'inline-flex',
            flexDirection: 'column',
            padding: '8px'
        }),
    }
    const CustomSingleValue = ({ data }) => (
        <div style={{
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: data.background,
            display: 'inline-block',
            width: 'auto',
            whiteSpace: 'nowrap',
            fontWeight: '700'
        }}>
            {data.label}
        </div>
    );
    const [currencyOptions, setCurrencyOptions] = useState([
        { value: "EURUSD", label: "EURUSD", color: colors.blue, background: backgrounds.blue },
        { value: "EURJPY", label: "EURJPY", color: colors.green, background: backgrounds.green },
        { value: "EURGBP", label: "EURGBP", color: colors.red, background: backgrounds.red },
        { value: "EURGBP", label: "EURGBP",  },
        { value: "EURGBP", label: "EURGBP" },
        { value: "EURGBP", label: "EURGBP" },
    ]);
    
    const handleCreateNewOption = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        setCurrencyOptions((prevOptions) => [...prevOptions, newOption]);
        // You can also store the new option to your database here.
    };
    

  return (
    <div className={`newTrade ${visible ? 'visible' : ''}`}>
        <div className="newTrade__nav">
                <div className="newTrade__close" onClick={onClose}>
                    <CaretDoubleRight className='icon-16' />
                </div>
                <div className="newTrade__next">
                    <CaretDown className='icon-16' />
                </div>
                <div className="newTrade__before">
                    <CaretUp className='icon-16' />
                </div>
        </div>
        <h1 className="newTrade__title" placeholder='新しいトレードを追加'></h1>
        <div className="tradeInfo">
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Coin className='icon-16'/>
                    <span className="tradeInfo__name">PAIRS</span>
                </div>
                <div className="tradeInfo__right">
                    <CreatableSelect
                        // value={selectedCurrencyOption}
                        // onChange={handleChangeCurrency}
                        options={currencyOptions}
                        onCreateOption={handleCreateNewOption}
                        placeholder="Select or type to create..."
                        className="note-select"
                        classNamePrefix="note-select"
                        components={{
                            Option: CustomOption,
                            SingleValue: CustomSingleValue,
                        }}
                        styles={styles}
                        
                      
                    />
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <ArrowRight className='icon-16'/>
                    <span className="tradeInfo__name">DIRECTION</span>
                </div>
                <div className="tradeInfo__right">
                    <Select
                        // value={selectedCurrencyOption}
                        // onChange={handleChangeCurrency}
                        options={currencyOptions}
                        className="note-select"
                        classNamePrefix="note-select"
                    />
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Percent className='icon-16'/>
                    <span className="tradeInfo__name">RETURN</span>
                </div>
                <div className="tradeInfo__right">
                    <div className="tradeInfo__input"  placeholder='ENPTY'></div>
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Article className='icon-16'/>
                    <span className="tradeInfo__name">LOT</span>
                </div>
                <div className="tradeInfo__right">
                    <div className="tradeInfo__input"  placeholder='ENPTY'></div>
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Crosshair className='icon-16'/>
                    <span className="tradeInfo__name">SETUPS</span>
                </div>
                <div className="tradeInfo__right">
                    <Select
                        // value={selectedCurrencyOption}
                        // onChange={handleChangeCurrency}
                        options={currencyOptions}
                        className="note-select"
                        classNamePrefix="note-select"
                    />
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <ChartLineUp className='icon-16'/>
                    <span className="tradeInfo__name">PATTERN</span>
                </div>
                <div className="tradeInfo__right">
                    <Select
                        // value={selectedCurrencyOption}
                        // onChange={handleChangeCurrency}
                        options={currencyOptions}
                        className="note-select"
                        classNamePrefix="note-select"
                    />
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Calendar className='icon-16'/>
                    <span className="tradeInfo__name">DATE</span>
                </div>
                <div className="tradeInfo__right">
                    <div className="tradeInfo__date">
                        <div>
                            <span>entry</span>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div>
                            <span>exit</span>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Tag className='icon-16'/>
                    <span className="tradeInfo__name">ENTRY</span>
                </div>
                <div className="tradeInfo__right">
                    <div className="tradeInfo__date">
                        <div>
                            <span>entry</span>
                            <div className="tradeInfo__input"  placeholder='ENPTY'></div>
                        </div>
                        <div>
                            <span>exit</span>
                            <div className="tradeInfo__input"  placeholder='ENPTY'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="noteContent">
            <div className="noteContent__text"  placeholder='type...'>テキスト</div>
            <div className="textEditor">
                <div className="textEditor__edit">
                    <div className="textEditor__item js-text-select">
                        <span className='textEditor__tilte'>text</span>
                        <CaretDown className='textEditor__icon'/>
                    </div>
                    <div className="textEditor__item js-text-bold">
                        <TextB className='textEditor__icon'/>
                    </div>
                    <div className="textEditor__item js-palette">
                        <Palette className='textEditor__icon'/>
                    </div>
                </div>
                <div className="ternInto">
                    <div className="ternInto__title">tern into</div>
                    <ul className="ternInto__list">
                        <li className="ternInto__item">
                            <div className="ternInto__icon">
                                <TextAa className='icon-16'/>
                            </div>
                            <div className="ternInto__desc">text</div>
                        </li>
                        <li className="ternInto__item">
                            <div className="ternInto__icon">
                                <TextHOne className='icon-16'/>
                            </div>
                            <div className="ternInto__desc">Heading 1</div>
                        </li>
                        <li className="ternInto__item">
                            <div className="ternInto__icon">
                                <TextHTwo className='icon-16'/>
                            </div>
                            <div className="ternInto__desc">Heading 2</div>
                        </li>
                        <li className="ternInto__item">
                            <div className="ternInto__icon">
                                <TextHThree className='icon-16'/>
                            </div>
                            <div className="ternInto__desc">Heading 3</div>
                        </li>
                        <li className="ternInto__item">
                            <div className="ternInto__icon">
                                <ListBullets className='icon-16'/>
                            </div>
                            <div className="ternInto__desc">Bullet</div>
                        </li>
                    </ul>
                </div>
                <div className="paletteNav">
                    <div className="paletteNav__block">
                        <div className="paletteNav__title">color</div>
                        <ul className="paletteNav__list">
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Default</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--gray">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Gray</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Orange ">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Orange</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Yellow">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Yellow</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Green">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Green</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Blue">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Blue</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Purple">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Purple</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Pink">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Pink</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Red">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Red</div>
                            </li>
                        </ul>
                    </div>
                    <div className="paletteNav__block">
                        <div className="paletteNav__title">background</div>
                        <ul className="paletteNav__list paletteNav__list--bg">
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Default</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--gray">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Gray</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Orange ">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Orange</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Yellow">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Yellow</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Green">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Green</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Blue">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Blue</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Purple">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Purple</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Pink">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Pink</div>
                            </li>
                            <li className="paletteNav__item">
                                <div className="paletteNav__icon paletteNav__icon--Red">
                                    <TextAa className='icon-16'/>
                                </div>
                                <div className="paletteNav__desc">Red</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="textEditor__nav">
                    <div className="textEditor__drag">
                        <DotsSixVertical className='icon-16 textEditor__icon'/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NewTrade
