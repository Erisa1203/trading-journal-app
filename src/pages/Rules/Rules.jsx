import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import RuleCard from '../../components/RuleCard/RuleCard'
import NewRule from '../../components/Modal/NewRule/NewRule'
import HideContents from '../../components/HideContents/HideContents'
import { UserContext } from '../../contexts/UserContext'
import AppContainer from '../../components/Container/AppContainer'
import { addNewRule, fetchRuleById, fetchRules, sortRulesByDate } from "../../services/rules";
import './Rules.styl'
import RuleFilter from "../../components/RuleFilter/RuleFilter";
import { useCustomSetupCreation } from "../../hooks/useCustomSetupCreation";

const Rules = () => {
    const { user } = useContext(UserContext);
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNewRuleModalVisible, setIsNewRuleModalVisible] = useState(false)
    const [currentDocId, setCurrentDocId] = useState(null);  
    const [ruleId, setRuleId] = useState("");
    const [selectedRule, setSelectedRule] = useState(null);
    const [userSetup, setUserSetup] = useState([]);
    const [activeFilter, setActiveFilter] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [originalRules, setOriginalRules] = useState([]);
    const [filteredRules, setFilteredRules] = useState([]);
    
    useEffect(() => {
        if (activeFilter) {
            let filteredRules;

            if (activeFilter === 'REVERSAL' || activeFilter === 'CONTINUATION') {
                filteredRules = originalRules.filter(rule => rule.PATTERN && rule.PATTERN === activeFilter);
            } else {
                filteredRules = originalRules.filter(rule => rule.SETUP && rule.SETUP === activeFilter);
            }

            setRules(filteredRules); // Update filteredRules instead of rules
        } else {
            setRules(originalRules);  // フィルタがアクティブでない場合、全てのルールを表示
        }
    }, [activeFilter]);

    useEffect(() => {
        resetFilter()
    }, [originalRules]);

    useEffect(() => {
        if (!activeFilter) {
            setRules(originalRules);  // フィルタがアクティブでない場合、全てのルールを表示
        }
    }, [originalRules, activeFilter]);

    useEffect(() => {
        const db = getFirestore();
        const rulesCollection = collection(db, "rules");
    
        // onSnapshotリスナーを設定
        const unsubscribe = onSnapshot(rulesCollection, (snapshot) => {
            const updatedRules = snapshot.docs.map(doc => ({ ID: doc.ID, ...doc.data() }));
            setRules(updatedRules);
            setOriginalRules(updatedRules);  // originalRulesも更新
        });
    
        // クリーンアップ関数で、リスナーの解除を行う
        return () => unsubscribe();
    }, []); 

    useEffect(() => {
        const db = getFirestore();
        const usersCollection = collection(db, "users");
    
        // onSnapshotリスナーを設定
        const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
            const userList = snapshot.docs.flatMap(doc => doc.data().setup);
            const defaultSetup = [
                { label: 'REVERSAL' },
                { label: 'CONTINUATION' }
            ];
            setUserSetup([...defaultSetup, ...userList]);
        });
    
        // クリーンアップ関数を追加して、リスナーをアンマウント時に解除します。
        return () => unsubscribe();
    }, []);
    
    const handleRuleCardClick = (rule) => {
        setSelectedRule(rule);
        setIsNewRuleModalVisible(true);
        setRuleId(rule.ID)
        setCurrentDocId(rule.ID)
    }
        
    

    useEffect(() => {
        async function loadRules() {
          const fetchedRules = await fetchRules();
          setRules(fetchedRules);
          setOriginalRules(fetchedRules);  // フェッチしたルールをoriginalRulesにもセット
          setLoading(false);
        }
        loadRules();
    }, []);

    const resetFilter = () => {
        setFilteredRules(rules);
        setActiveFilter(null)
    }

    const createNewRuleHandle = async () => {
        try {
            const newDocId = await addNewRule();
            setCurrentDocId(newDocId)
            const updatedRules = await fetchRules(); // 新しいルールを取得します
            setRuleId(newDocId)
            setRules(updatedRules); // 最新のルールのリストでstateを更新します
            const newRuleDetails = await fetchRuleById(newDocId);
            setSelectedRule(newRuleDetails);
            resetFilter()
        } catch (e) {
            console.error("エラーが発生しました:", e);
        }
        setIsNewRuleModalVisible(true);

    }

    return (
        <AppContainer>
            <Sidebar page="rules"/>
            <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
                <Header 
                    title="ルール作成" 
                    page="Rules" 
                    createNewRuleHandle={createNewRuleHandle}
                    setRuleId={setRuleId}
                />
                <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
                    <ul className="ruleFilter">
                        {userSetup.map((setup, index) => (
                            <RuleFilter 
                                setup={setup}
                                index={index}
                                key={index}
                                rules={rules}
                                setRules={setRules}
                                originalRules={originalRules}
                                isActive={setup.label === activeFilter}
                                activeFilter={activeFilter}
                                setActiveFilter={setActiveFilter}
                            />
                        ))}
                    </ul>
                    <ul className="rules">
                        {rules.length > 0 ? (
                            rules.map((rule, index) => (
                                <RuleCard 
                                    key={rule.ID} 
                                    rule={rule}
                                    onClick={() => handleRuleCardClick(rule)}
                                    selectedRule={selectedRule}
                                    rules={rules}
                                    activeFilter={activeFilter}
                                />
                            ))
                        ) : (
                            <p>表示できるルールはありません。</p>
                        )}
                    </ul>
                </div>
                <NewRule 
                    currentDocId={currentDocId}
                    isNewRuleModalVisible={isNewRuleModalVisible}
                    setIsNewRuleModalVisible={setIsNewRuleModalVisible}
                    setRules={setRules}
                    ruleId={ruleId}
                    selectedRule={selectedRule}
                    setSelectedRule={setSelectedRule}
                    rules={rules}
                    
                />
                {!user && <HideContents />}
            </div>
        </AppContainer>
        
    )
}

export default Rules
