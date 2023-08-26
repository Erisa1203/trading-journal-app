import { ArrowRight, Article, Calendar, Camera, CaretDoubleRight, CaretDown, CaretUp, ChartLineUp, CheckSquare, Coin, Crosshair, DotsSixVertical, ListBullets, MagnifyingGlassPlus, Palette, Paperclip, Percent, Tag, TextAa, TextHOne, TextHThree, TextHTwo, Trash } from 'phosphor-react'
import React, { useEffect, useRef, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { TextB } from '@phosphor-icons/react';
import { deleteRuleById, fetchPatternByLabel, handleDeleteRule, saveRuleUpdateToDb, updatePatternsInRule, updateSetupInRule } from '../../../services/rules';
import { CustomCreatableSelect } from '../../Select/CustomCreatableSelect';
import { useCustomPatternCreation } from '../../../hooks/useCustomPatternCreation';
import { getTagByLabel, patternOption, updatePatternsInTrade } from '../../../services/trades';
import { auth } from '../../../services/firebase';
import { PatternSelect } from '../../Select/PatternSelect';
import { useCustomSetupCreation } from '../../../hooks/useCustomSetupCreation';
import MyEditor from '../../QuillEditor/QuillEditor';
import ImageNav from '../../EditorNav/ImageNav';
import NavLayer from '../NavLayer/NavLayer'
import { ImageWrapperContext } from '../../../contexts/ImageWrapperContext';

const currencyOptions = [
    { value: "EURUSD", label: "EURUSD" },
    { value: "EURJPY", label: "EURJPY" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
];

const NewRule = ({isNewRuleModalVisible, setIsNewRuleModalVisible, currentDocId, setRules, ruleId, selectedRule, rules, setSelectedRule}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [name, setName] = useState("");
    const [rule1, setRule1] = useState("");
    const [rule2, setRule2] = useState("");
    const [rule3, setRule3] = useState("");
    const [dbSetupOptions, setDbSetupOptions] = useState([]);
    const [selectedPatternOption, setSelectedPatternOption] = useState(null);
    const [selectedSetupOption, setSelectedSetupOption] = useState(null);
    const [noteContentFromDb, setNoteContentFromDb] = useState("");
    const [editorHtml, setEditorHtml] = useState('');
    const [setupOptions, handleCreateNewSetupOption] = useCustomSetupCreation([], setDbSetupOptions, setSelectedSetupOption);
    const navRef = useRef(null);
    const [currentImageWrapper, setCurrentImageWrapper] = useState(null);

    const updateSetupOption = async (selectedOption, ruleId) => {
        setSelectedSetupOption(selectedOption);
        await updateSetupInRule(selectedOption, ruleId);
    };

    const handleInputChange = (e, dbField, localField, setStateFunction) => {
        const updatedValue = e.target.value;
    
        setStateFunction(updatedValue);  // ステートを更新
    
        // データベースに更新を保存
        saveRuleUpdateToDb(dbField, updatedValue, currentDocId);
    
        // ローカルのrulesを更新
        setRules(prevRules => {
            return prevRules.map(rule => {
                if (rule.ID === currentDocId) {
                    return { ...rule, [localField]: updatedValue };
                }
                return rule;
            });
        });
    };

    const fetchRuleById = async (id) => {
        return selectedRule;
    };

    useEffect(() => {
        const loadrule = async () => {
          if (selectedRule) { // ruleIdがnullやundefinedでない場合のみ実行
            const rule = await fetchRuleById(selectedRule.ID);
            setName(rule.NAME);
            setRule1(rule.RULE_1);
            setRule2(rule.RULE_2);
            setRule3(rule.RULE_3);
            setNoteContentFromDb(rule.NOTE)

            const setupTag = await getTagByLabel(rule.SETUP, rule.USER_ID, 'setup');
            setSelectedSetupOption(setupTag);

            // pattern を取得
            const matchingPatternOption = rule.PATTERN 
            ? patternOption.find(option => option.value === rule.PATTERN)
            : null;
            setSelectedPatternOption(matchingPatternOption ? matchingPatternOption : "");
          }
        };
    
    loadrule();
    }, [selectedRule]); // ruleIdの変更を監視

    const updatePatternOption = async (value, ruleId) => {
        setSelectedPatternOption(value);
        await updatePatternsInRule(value, ruleId);
        const updatedRules = rules.map(rule => {
            if (rule.ID === ruleId) {
                return {
                    ...rule,
                    PATTERN: value.value
                };
            }
            return rule;
        });
        
        setRules(updatedRules);
    };

    const handleDeleteRule = async () => {
        if (!selectedRule) return; // 選択されているルールがない場合は何もしない
    
        // Firestoreからドキュメントを削除
        await deleteRuleById(selectedRule.ID);
    
        // ローカルステートからデータを削除
        const updatedRules = rules.filter(rule => rule.ID !== selectedRule.ID);
        setRules(updatedRules);
    
        // モーダルを閉じる
        setIsNewRuleModalVisible(false);
    }


    return (
        <ImageWrapperContext.Provider value={{ currentImageWrapper, setCurrentImageWrapper }}>
            <div className={`newTrade ruleModal ${isNewRuleModalVisible ? 'visible' : ''}`}>
                <div className="newTrade__nav">
                    <div className="newTrade__close" onClick={() => setIsNewRuleModalVisible(false)}>
                        <CaretDoubleRight className='icon-16'/>
                    </div>
                    <div className="newTrade__next">
                        <CaretDown className='icon-16' />
                    </div>
                    <div className="newTrade__before">
                        <CaretUp className='icon-16' />
                    </div>
                    <div className="newTrade__delete" onClick={handleDeleteRule}>
                        <Trash className='icon-16' />
                    </div>
                </div>
                <h1 className="newTrade__title"  placeholder='名前を追加'></h1>
                <div className="tradeInfo">
                    <div className="tradeInfo__row">
                        <div className="tradeInfo__title">
                            <TextHOne className='icon-16'/>
                            <span className="tradeInfo__name">Name</span>
                        </div>
                        <div className="tradeInfo__right">
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => handleInputChange(e, "NAME", "NAME", setName)}
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
                                updatePatternOption={(selectedPatternOption) => updatePatternOption(selectedPatternOption, ruleId)}
                            />
                        </div>
                    </div>
                    <div className="tradeInfo__row">
                        <div className="tradeInfo__title">
                            <ChartLineUp className='icon-16'/>
                            <span className="tradeInfo__name">SETUP</span>
                        </div>
                        <div className="tradeInfo__right">
                            <CustomCreatableSelect
                                options={dbSetupOptions}
                                handleCreateNewOption={async (inputValue) => {
                                    const newOption = await handleCreateNewSetupOption(inputValue);
                                    setSelectedSetupOption(newOption);
                                }}
                                selectedOption={selectedSetupOption}
                                setSelectedOption={(selectedOption) => updateSetupOption(selectedOption, ruleId)}
                            />
                        </div>
                    </div>
                    <div className="tradeInfo__row">
                        <div className="tradeInfo__title">
                            <CheckSquare className='icon-16'/>
                            <span className="tradeInfo__name">Rule1</span>
                        </div>
                        <div className="tradeInfo__right">
                            <input 
                                type="text" 
                                value={rule1}
                                onChange={(e) => handleInputChange(e, "RULE_1", "RULE_1", setRule1)}
                            />
                        </div>
                    </div>
                    <div className="tradeInfo__row">
                        <div className="tradeInfo__title">
                            <CheckSquare className='icon-16'/>
                            <span className="tradeInfo__name">Rule2</span>
                        </div>
                        <div className="tradeInfo__right">
                            <input 
                                type="text"
                                value={rule2}
                                onChange={(e) => handleInputChange(e, "RULE_2", "RULE_2", setRule2)}
                            />
                        </div>
                    </div>
                    <div className="tradeInfo__row">
                        <div className="tradeInfo__title">
                            <CheckSquare className='icon-16'/>
                            <span className="tradeInfo__name">Rule3</span>
                        </div>
                        <div className="tradeInfo__right">
                            <input 
                                type="text"
                                value={rule3}
                                onChange={(e) => handleInputChange(e, "RULE_3", "RULE_3", setRule3)}
                            />
                        </div>
                    </div>
                </div>
                <div className="noteContent">
                    <MyEditor 
                        id={ruleId} 
                        content={noteContentFromDb}
                        onContentChange={(newContent) => setEditorHtml(newContent)} 
                        collectionName="rules"
                        navRef={navRef}
                        setCurrentImageWrapper={setCurrentImageWrapper}
                    /> 
                    <NavLayer />
                    <ImageNav
                        selectedRule={selectedRule}
                        setSelectedRule={setSelectedRule}
                        rules={rules}
                        setRules={setRules}
                    />
                </div>
            </div>
        </ImageWrapperContext.Provider>

    )
}

export default NewRule
