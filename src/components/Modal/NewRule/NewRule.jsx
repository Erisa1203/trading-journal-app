import { ArrowRight, Article, Calendar, Camera, CaretDoubleRight, CaretDown, CaretUp, ChartLineUp, CheckSquare, Coin, Crosshair, DotsSixVertical, ListBullets, Palette, Percent, Tag, TextAa, TextHOne, TextHThree, TextHTwo } from 'phosphor-react'
import React, { useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { TextB } from '@phosphor-icons/react';

const currencyOptions = [
    { value: "EURUSD", label: "EURUSD" },
    { value: "EURJPY", label: "EURJPY" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
];

const NewRule = () => {
    const [startDate, setStartDate] = useState(new Date());


  return (
    <div className='newTrade'>
        <div className="newTrade__nav">
                <div className="newTrade__close">
                    <CaretDoubleRight className='icon-16' />
                </div>
                <div className="newTrade__next">
                    <CaretDown className='icon-16' />
                </div>
                <div className="newTrade__before">
                    <CaretUp className='icon-16' />
                </div>
        </div>
        <h1 className="newTrade__title"  placeholder='名前を追加'></h1>
        <div className="tradeInfo">
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Camera className='icon-16'/>
                    <span className="tradeInfo__name">THUMBNAIL</span>
                </div>
                <div className="tradeInfo__right tradeInfo__file">
                    <button>ファイルを選択</button>
                    <input type="file" />
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
                    <CheckSquare className='icon-16'/>
                    <span className="tradeInfo__name">Rule1</span>
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
                    <CheckSquare className='icon-16'/>
                    <span className="tradeInfo__name">Rule1</span>
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
                    <CheckSquare className='icon-16'/>
                    <span className="tradeInfo__name">Rule1</span>
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

export default NewRule
