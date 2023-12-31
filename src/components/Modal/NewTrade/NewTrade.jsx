import { ArrowRight, Article, Bank, Calendar, CaretDoubleRight, CaretDown, CaretUp, ChartLineUp, Coin, Crosshair, CurrencyJpy, DotsSixVertical, ListBullets, Palette, Percent, Tag, TextAa, TextHOne, TextHThree, TextHTwo, Trash } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import "./_newTrade.styl"
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { TextB } from '@phosphor-icons/react';
import { CustomCreatableSelect } from '../../Select/CustomCreatableSelect';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useCustomOptionCreation } from '../../../hooks/useCustomOptionCreation';
import { ShortLongSelect } from '../../Select/ShortLongSelect';
import { useCustomSetupCreation } from '../../../hooks/useCustomSetupCreation';
import { calculateStatus, deleteTradeById, getTagByLabel, patternOption, shortLongOptions, updateDirInTrade, updateEntryDateInTrade, updateEntryPriceInTrade, updateExitDateInTrade, updateExitPriceInTrade, updateLotInTrade, updatePairsInTrade, updatePatternsInTrade, updateProfitInTrade, updateReturnInTrade, updateSetupInTrade, updateStatusInTrade } from '../../../services/trades';
import MyEditor from '../../QuillEditor/QuillEditor';
import { PatternSelect } from '../../Select/PatternSelect';

const NewTrade = ({ visible, setIsVisible, trade, onClose, tradeId, dbCollection, setNextTrade, setPreviousTrade }) => {
    const auth = getAuth();
    const [entryDate, setEntryDate] = useState(null);
    const [exitDate, setExitDate] = useState(null);
    const [dbCurrencyOptions, setDbCurrencyOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedDirOption, setSelectedDirOption] = useState(null);
    const [lotValue, setLotValue] = useState('');
    const [entryPrice, setEntryPrice] = useState('');
    const [exitPrice, setExitPrice] = useState('');
    const [dbSetupOptions, setDbSetupOptions] = useState([]);
    const [selectedPatternOption, setSelectedPatternOption] = useState(null);
    const [selectedSetupOption, setSelectedSetupOption] = useState(null);
    const [setupOptions, handleCreateNewSetupOption] = useCustomSetupCreation([], setDbSetupOptions, setSelectedSetupOption);
    const [currencyOptions, handleCreateNewOption, loading, setLoading] = useCustomOptionCreation([], setSelectedOption);
    const [initialContentFromDatabase, setInitialContentFromDatabase] = useState("");
    const [returnValue, setReturnValue] = useState('');
    const [profitValue, setProfitValue] = useState('');
    const [editorHtml, setEditorHtml] = useState('');
    const [tradeStatus, setTradeStatus] = useState('');

    const createUpdateFunction = (setState, updateFunctionName) => {
        return async (value, tradeId, dbCollection) => {
            setState(value);
            await updateFunctionName(value, tradeId, dbCollection);
        };
    };

    const updateSelectedOption = createUpdateFunction(setSelectedOption, updatePairsInTrade);
    const updateDirOption = createUpdateFunction(setSelectedDirOption, updateDirInTrade);
    const updateReturnValue = createUpdateFunction(setReturnValue, updateReturnInTrade);
    const updateProfitValue = createUpdateFunction(setProfitValue, updateProfitInTrade);
    const updateLotValue = createUpdateFunction(setLotValue, updateLotInTrade);
    const updateEntryPrice = createUpdateFunction(setEntryPrice, updateEntryPriceInTrade);
    const updateExitPrice = createUpdateFunction(setExitPrice, updateExitPriceInTrade);
    const updateSetupOption = createUpdateFunction(setSelectedSetupOption, updateSetupInTrade);
    const updatePatternOption = createUpdateFunction(setSelectedPatternOption, updatePatternsInTrade);
    const updateEntryDate = createUpdateFunction(setEntryDate, updateEntryDateInTrade);
    const updateExitDate = createUpdateFunction(setExitDate, updateExitDateInTrade);

    useEffect(() => {
        
        if (trade) {
            const fetchTags = async () => {
                const currencyTag = await getTagByLabel(trade.PAIRS, trade.USER_ID, 'customTags');
                setSelectedOption(currencyTag);
    
                const setupTag = await getTagByLabel(trade.SETUP, trade.USER_ID, 'setup');
                setSelectedSetupOption(setupTag);
            };
            fetchTags();
    
            const matchingDirOption = trade.DIR 
            ? shortLongOptions.find(option => option.value === trade.DIR)
            : null;
            setSelectedDirOption(matchingDirOption ? matchingDirOption : "");

            const matchingPatternOption = trade.PATTERN 
            ? patternOption.find(option => option.value === trade.PATTERN)
            : null;
            
            setSelectedPatternOption(matchingPatternOption ? matchingPatternOption : "");
            setInitialContentFromDatabase(trade.NOTE)
            setReturnValue(trade.RETURN);
            setProfitValue(trade.PROFIT);
            setLotValue(trade.LOT);
            setEntryPrice(trade.ENTRY_PRICE);
            setExitPrice(trade.EXIT_PRICE);
            setTradeStatus(trade.STATUS)
            setEntryDate(trade.ENTRY_DATE)
            setExitDate(trade.EXIT_DATE)
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchData = async () => {
                    const db = getFirestore();
                    const docRef = doc(db, "users", user.uid);
                    onSnapshot(docRef, (docSnap) => {
                        if (docSnap.exists()) {
                            const fetchedTags = docSnap.data().customTags;
                            const newOptions = fetchedTags.map(tag => ({
                                value: tag.value,
                                label: tag.label,
                                color: tag.color,
                            }));
                            const sortedNewOptions = newOptions.sort((a, b) => a.label.localeCompare(b.label));

                            setDbCurrencyOptions(sortedNewOptions);
                            setLoading(false);
                        } else {
                            console.log("No such document!");
                        }
                    });
                };
                fetchData();
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [trade]); // <-- change to empty array
    

    useEffect(() => {  
        if (returnValue) {    
            const status = returnValue > 0 ? 'WIN' : (returnValue < 0 ? 'LOSS' : 'BREAKEVEN');
            setTradeStatus(status)
        } else {
            setTradeStatus(null)
        }
    }, [returnValue]);
    
    const onTrashClickHandle = () => {
        deleteTradeById(dbCollection, tradeId)
        setIsVisible(false);
    }

    if (loading) {  // <--- add this conditional rendering
        return <div>Loading...</div>;  // or any other loading indicator you'd like to display
    }
    
  return (
    <div className={`newTrade ${visible ? 'visible' : ''}`}>
        <div className="newTrade__nav">
            <div className="newTrade__nav__left">
                <div className="newTrade__close" onClick={onClose}>
                    <CaretDoubleRight className='icon-16' />
                </div>
                <div className="newTrade__next" onClick={() => setNextTrade(trade)}>
                    <CaretDown className='icon-16' />
                </div>
                <div className="newTrade__before" onClick={() => setPreviousTrade(trade)}>
                    <CaretUp className='icon-16' />
                </div>
            </div>
            <div className="newTrade__trash" onClick={onTrashClickHandle}>
                <Trash className='icon-16' />
            </div>

        </div>
        <h1 className="newTrade__title" placeholder='新しいトレードを追加'></h1>
        <div className="tradeInfo">
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Coin className='icon-16'/>
                    <span className="tradeInfo__name">STATUS</span>
                </div>
                {}
                <div className={`tradeInfo__right tag ${tradeStatus === 'WIN' ? 'tag--green' : tradeStatus === 'LOSS' ? 'tag--red' : 'tag--pink'}`}>{ tradeStatus }</div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Coin className='icon-16'/>
                    <span className="tradeInfo__name">PAIRS</span>
                </div>
                <div className="tradeInfo__right">
                {
                        loading ? 
                        <div>Loading...</div> 
                        : 
                        <CustomCreatableSelect
                            options={dbCurrencyOptions}
                            handleCreateNewOption={async (inputValue) => {
                                const newOption = await handleCreateNewOption(inputValue);
                                setSelectedOption(newOption);
                                updateSelectedOption(newOption, tradeId, dbCollection)
                            }}
                            
                            selectedOption={selectedOption}
                            setSelectedOption={(selectedOption) => updateSelectedOption(selectedOption, tradeId, dbCollection)}
                        />
                    }
                </div>

            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <ArrowRight className='icon-16'/>
                    <span className="tradeInfo__name">DIRECTION</span>
                </div>
                <div className="tradeInfo__right">
                    <ShortLongSelect 
                        selectedDirOption={selectedDirOption} 
                        setSelectedDirOption={setSelectedDirOption}
                        updateDirOption={(selectedDirOption) => updateDirOption(selectedDirOption, tradeId, dbCollection)}
                    />
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Percent className='icon-16'/>
                    <span className="tradeInfo__name">RETURN</span>
                </div>
                <div className="tradeInfo__right">
                    <input 
                        className="tradeInfo__input"  
                        placeholder='EMPTY' 
                        value={returnValue || ''}
                        onChange={(e) => updateReturnValue(e.target.value, tradeId, dbCollection)}
                    />
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Bank className='icon-16'/>
                    <span className="tradeInfo__name">PROFIT</span>
                </div>
                <div className="tradeInfo__right">
                    <input 
                        className="tradeInfo__input"  
                        placeholder='EMPTY' 
                        value={profitValue || ''}
                        onChange={(e) => updateProfitValue(e.target.value, tradeId, dbCollection)}
                    />
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Article className='icon-16'/>
                    <span className="tradeInfo__name">LOT</span>
                </div>
                <div className="tradeInfo__right">
                    <input 
                        className="tradeInfo__input"  
                        placeholder='EMPTY' 
                        value={lotValue || ''}
                        onChange={(e) => updateLotValue(e.target.value, tradeId, dbCollection)}
                    />
                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <Crosshair className='icon-16'/>
                    <span className="tradeInfo__name">SETUPS</span>
                </div>
                <div className="tradeInfo__right">
                <CustomCreatableSelect
                    options={dbSetupOptions}
                    handleCreateNewOption={async (inputValue) => {
                        const newOption = await handleCreateNewSetupOption(inputValue);
                        setSelectedSetupOption(newOption);
                        updateSetupOption(newOption, tradeId, dbCollection)
                    }}
                    selectedOption={selectedSetupOption}
                    setSelectedOption={(selectedOption) => updateSetupOption(selectedOption, tradeId, dbCollection)}
                />

                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <ChartLineUp className='icon-16'/>
                    <span className="tradeInfo__name">PATTERN</span>
                </div>
                <div className="tradeInfo__right">
                    <PatternSelect 
                        selectedPatternOption={selectedPatternOption} 
                        setSelectedPatternOption={setSelectedPatternOption}
                        updatePatternOption={(selectedPatternOption) => updatePatternOption(selectedPatternOption, tradeId, dbCollection)}
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
                            <DatePicker 
                                showTimeInput
                                dateFormat="yyyy年M月d日 h:mm aa"
                                selected={entryDate} 
                                onChange={(date) => updateEntryDate(date, tradeId, dbCollection)} 
                            />
                        </div>
                        <div>
                            <span>exit</span>
                            <DatePicker 
                                showTimeInput
                                dateFormat="yyyy年M月d日 h:mm aa"
                                selected={exitDate} 
                                onChange={(date) => updateExitDate(date, tradeId, dbCollection)} 
                            />
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
                            <input 
                                className="tradeInfo__input"  
                                placeholder='EMPTY' 
                                value={entryPrice}
                                onChange={(e) => updateEntryPrice(e.target.value, tradeId, dbCollection)}
                            />
                        </div>
                        <div>
                            <span>exit</span>
                            <input 
                                className="tradeInfo__input"  
                                placeholder='EMPTY' 
                                value={exitPrice}
                                onChange={(e) => updateExitPrice(e.target.value, tradeId, dbCollection)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="noteContent">
            <MyEditor 
                id={tradeId} 
                content={initialContentFromDatabase}
                onContentChange={(newContent) => setEditorHtml(newContent)} 
                dbCollection={dbCollection}
            />            
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
                <div className="editorNav">
                    <div className="editorNav__title">tern into</div>
                    <ul className="editorNav__list">
                        <li className="editorNav__item">
                            <div className="editorNav__icon">
                                <TextAa className='icon-16'/>
                            </div>
                            <div className="editorNav__desc">text</div>
                        </li>
                        <li className="editorNav__item">
                            <div className="editorNav__icon">
                                <TextHOne className='icon-16'/>
                            </div>
                            <div className="editorNav__desc">Heading 1</div>
                        </li>
                        <li className="editorNav__item">
                            <div className="editorNav__icon">
                                <TextHTwo className='icon-16'/>
                            </div>
                            <div className="editorNav__desc">Heading 2</div>
                        </li>
                        <li className="editorNav__item">
                            <div className="editorNav__icon">
                                <TextHThree className='icon-16'/>
                            </div>
                            <div className="editorNav__desc">Heading 3</div>
                        </li>
                        <li className="editorNav__item">
                            <div className="editorNav__icon">
                                <ListBullets className='icon-16'/>
                            </div>
                            <div className="editorNav__desc">Bullet</div>
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
