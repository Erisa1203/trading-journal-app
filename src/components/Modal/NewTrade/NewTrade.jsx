import { ArrowRight, Article, Calendar, CaretDoubleRight, CaretDown, CaretUp, ChartLineUp, Coin, Crosshair, DotsSixVertical, ListBullets, Palette, Percent, Tag, TextAa, TextHOne, TextHThree, TextHTwo } from 'phosphor-react'
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
import { useCustomPatternCreation } from '../../../hooks/useCustomPatternCreation';
import { getTagByLabel, shortLongOptions, updateDirInTrade, updateEntryDateInTrade, updateEntryPriceInTrade, updateExitDateInTrade, updateExitPriceInTrade, updateFieldInTrade, updateLotInTrade, updatePairsInTrade, updatePatternsInTrade, updateReturnInTrade, updateSetupInTrade } from '../../../services/trades';
import MyEditor from '../../QuillEditor/QuillEditor';

const NewTrade = ({ visible, trade, onClose, tradeId }) => {
    const auth = getAuth();
    const [entryDate, setEntryDate] = useState(new Date());
    const [exitDate, setExitDate] = useState(new Date());
    const [dbCurrencyOptions, setDbCurrencyOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedDirOption, setSelectedDirOption] = useState(null);
    const [lotValue, setLotValue] = useState('');
    const [entryPrice, setEntryPrice] = useState('');
    const [exitPrice, setExitPrice] = useState('');
    const [dbSetupOptions, setDbSetupOptions] = useState([]);
    // console.log('dbCurrencyOptions', dbCurrencyOptions)
    const [dbPatternOptions, setDbPatternOptions] = useState([]);
    const [selectedPatternOption, setSelectedPatternOption] = useState(null);
    const [selectedSetupOption, setSelectedSetupOption] = useState(null);
    const [setupOptions, handleCreateNewSetupOption] = useCustomSetupCreation([], setDbSetupOptions, setSelectedSetupOption);
    const [currencyOptions, handleCreateNewOption, loading, setLoading] = useCustomOptionCreation([], setDbCurrencyOptions, setSelectedOption);
    const [patternOptions, handleCreateNewPatternOption ] = useCustomPatternCreation([], setDbPatternOptions, setSelectedPatternOption);
    const [initialContentFromDatabase, setInitialContentFromDatabase] = useState("");
    const [returnValue, setReturnValue] = useState('');
    const [editorHtml, setEditorHtml] = useState('');
    const [tradeStatus, setTradeStatus] = useState('');

    const createUpdateFunction = (setState, updateFunctionName) => {
        return async (value, tradeId) => {
            setState(value);
            await updateFunctionName(value, tradeId);
        };
    };
    
    const updateSelectedOption = createUpdateFunction(setSelectedOption, updatePairsInTrade);
    const updateDirOption = createUpdateFunction(setSelectedDirOption, updateDirInTrade);
    const updateReturnValue = createUpdateFunction(setReturnValue, updateReturnInTrade);
    const updateLotValue = createUpdateFunction(setLotValue, updateLotInTrade);
    const updateEntryPrice = createUpdateFunction(setEntryPrice, updateEntryPriceInTrade);
    const updateExitPrice = createUpdateFunction(setExitPrice, updateExitPriceInTrade);
    const updateSetupOption = createUpdateFunction(setSelectedSetupOption, updateSetupInTrade);
    const updatePatternOption = createUpdateFunction(setSelectedPatternOption, updatePatternsInTrade);
    const updateEntryDate = createUpdateFunction(setEntryDate, updateEntryDateInTrade);
    const updateExitDate = createUpdateFunction(setExitDate, updateExitDateInTrade);
    // console.log('dbSetupOptions', dbSetupOptions)

    useEffect(() => {
        if (trade) {
            const fetchTags = async () => {
                const currencyTag = await getTagByLabel(trade.PAIRS, trade.USER_ID, 'customTags');
                setSelectedOption(currencyTag);
    
                const setupTag = await getTagByLabel(trade.SETUP, trade.USER_ID, 'setup');
                setSelectedSetupOption(setupTag);
    
                const patternTag = await getTagByLabel(trade.PATTERN, trade.USER_ID, 'patterns');
                setSelectedPatternOption(patternTag);
            };
            fetchTags();
    
            const matchingDirOption = trade.DIR 
            ? shortLongOptions.find(option => option.value === trade.DIR)
            : null;
            setSelectedDirOption(matchingDirOption ? matchingDirOption : "");
            setInitialContentFromDatabase(trade.NOTE)
            setReturnValue(trade.RETURN);
            setLotValue(trade.LOT);
            setEntryPrice(trade.ENTRY_PRICE);
            setExitPrice(trade.EXIT_PRICE);
            setTradeStatus(trade.STATUS)
            
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
                            setDbCurrencyOptions(newOptions);
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
        if (entryPrice && exitPrice) {
            let status = "";
    
            if (trade && trade.DIR === 'SHORT') {
                status = parseFloat(entryPrice) - parseFloat(exitPrice) > 0 ? 'WIN' : 'LOSS';
            } else {
                // Assuming any other case is 'LONG' or the default behavior you want
                status = parseFloat(exitPrice) - parseFloat(entryPrice) > 0 ? 'WIN' : 'LOSS';
            }
    
            setTradeStatus(status);
        }
    }, [entryPrice, exitPrice, trade]);  // Depend on entryPrice, exitPrice, and trade for re-run
    

    if (loading) {  // <--- add this conditional rendering
        return <div>Loading...</div>;  // or any other loading indicator you'd like to display
    }
    
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
                            }}
                            
                            selectedOption={selectedOption}
                            setSelectedOption={(selectedOption) => updateSelectedOption(selectedOption, tradeId)}
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
                        updateDirOption={(selectedDirOption) => updateDirOption(selectedDirOption, tradeId)}
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
                        onChange={(e) => updateReturnValue(e.target.value, tradeId)}
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
                        onChange={(e) => updateLotValue(e.target.value, tradeId)}
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
                    }}
                    selectedOption={selectedSetupOption}
                    setSelectedOption={(selectedOption) => updateSetupOption(selectedOption, tradeId)}
                />

                </div>
            </div>
            <div className="tradeInfo__row">
                <div className="tradeInfo__title">
                    <ChartLineUp className='icon-16'/>
                    <span className="tradeInfo__name">PATTERN</span>
                </div>
                <div className="tradeInfo__right">
                <CustomCreatableSelect
                    options={dbPatternOptions}
                    handleCreateNewOption={async (inputValue) => {
                        const newOption = await handleCreateNewPatternOption(inputValue);
                        setSelectedPatternOption(newOption);
                    }}
                    selectedOption={selectedPatternOption}
                    setSelectedOption={(selectedOption) => updatePatternOption(selectedOption, tradeId)}

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
                                onChange={(date) => updateEntryDate(date, tradeId)} 
                            />
                        </div>
                        <div>
                            <span>exit</span>
                            <DatePicker 
                                showTimeInput
                                dateFormat="yyyy年M月d日 h:mm aa"
                                selected={exitDate} 
                                onChange={(date) => updateExitDate(date, tradeId)} 
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
                                onChange={(e) => updateEntryPrice(e.target.value, tradeId)}
                            />
                        </div>
                        <div>
                            <span>exit</span>
                            <input 
                                className="tradeInfo__input"  
                                placeholder='EMPTY' 
                                value={exitPrice}
                                onChange={(e) => updateExitPrice(e.target.value, tradeId)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="noteContent">
            <MyEditor 
                tradeId={tradeId} 
                content={initialContentFromDatabase}
                onContentChange={(newContent) => setEditorHtml(newContent)} 
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
