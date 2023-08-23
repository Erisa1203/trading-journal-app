import { ArrowRight, Article, Calendar, Camera, CaretDoubleRight, CaretDown, CaretUp, ChartLineUp, CheckSquare, Coin, Crosshair, DotsSixVertical, ListBullets, Palette, Percent, Tag, TextAa, TextHOne, TextHThree, TextHTwo } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { TextB } from '@phosphor-icons/react';
import { fetchPatternByLabel, saveRuleUpdateToDb, updatePatternsInRule } from '../../../services/rules';
import { CustomCreatableSelect } from '../../Select/CustomCreatableSelect';
import { useCustomPatternCreation } from '../../../hooks/useCustomPatternCreation';
import { patternOption, updatePatternsInTrade } from '../../../services/trades';
import { auth } from '../../../services/firebase';
import { PatternSelect } from '../../Select/PatternSelect';

const currencyOptions = [
    { value: "EURUSD", label: "EURUSD" },
    { value: "EURJPY", label: "EURJPY" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
    { value: "EURGBP", label: "EURGBP" },
];

const NewRule = ({isNewRuleModalVisible, setIsNewRuleModalVisible, currentDocId, setRules, ruleId, selectedRule}) => {
    const [startDate, setStartDate] = useState(new Date());
    const [name, setName] = useState("");
    const [rule1, setRule1] = useState("");
    const [rule2, setRule2] = useState("");
    const [rule3, setRule3] = useState("");
    const [dbPatternOptions, setDbPatternOptions] = useState([]);
    const [selectedPatternOption, setSelectedPatternOption] = useState(null);
    // const [patternOptions, handleCreateNewPatternOption ] = useCustomPatternCreation([], setDbPatternOptions, setSelectedPatternOption);
    
    const updatePatternOption = async (selectedOption, ruleId) => {
        setSelectedPatternOption(selectedOption);
        await updatePatternsInRule(selectedOption, ruleId);
    };

    const handleInputChange = (e, dbField, localField, setStateFunction) => {
        const updatedValue = e.target.value;
    
        setStateFunction(updatedValue);  // ステートを更新
    
        // データベースに更新を保存
        saveRuleUpdateToDb(dbField, updatedValue, currentDocId);
    
        // ローカルのrulesを更新
        setRules(prevRules => {
            return prevRules.map(rule => {
                if (rule.id === currentDocId) {
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
        const loadRuleData = async () => {
          if (selectedRule) { // ruleIdがnullやundefinedでない場合のみ実行
            const ruleData = await fetchRuleById(selectedRule.id);
            setName(ruleData.name);
            setRule1(ruleData.rule_1);
            setRule2(ruleData.rule_2);
            setRule3(ruleData.rule_3);
            // pattern を取得
            const matchingPatternOption = ruleData.pattern 
            ? patternOption.find(option => option.value === ruleData.pattern)
            : null;
            setSelectedPatternOption(matchingPatternOption ? matchingPatternOption : "");
          }
        };
    
        loadRuleData();
      }, [selectedRule]); // ruleIdの変更を監視

  return (
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
                        onChange={(e) => handleInputChange(e, "name", "name", setName)}
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
                    {/* <CustomCreatableSelect
                        options={dbPatternOptions}
                        handleCreateNewOption={async (inputValue) => {
                            const newOption = await handleCreateNewPatternOption(inputValue);
                            setSelectedPatternOption(newOption);
                        }}
                        selectedOption={selectedPatternOption}
                        setSelectedOption={(selectedOption) => updatePatternOption(selectedOption, ruleId)}
                    /> */}
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
                        onChange={(e) => handleInputChange(e, "rule_1", "rule_1", setRule1)}
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
                        onChange={(e) => handleInputChange(e, "rule_2", "rule_2", setRule2)}
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
                        onChange={(e) => handleInputChange(e, "rule_3", "rule_3", setRule3)}
                    />
                </div>
            </div>
        </div>
        <div className="noteContent">
            <div className="noteContent__text"  placeholder='type...'>テキスト</div>
        </div>
    </div>
  )
}

export default NewRule
