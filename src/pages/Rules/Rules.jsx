import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import RuleCard from '../../components/RuleCard/RuleCard'
import NewRule from '../../components/Modal/NewRule/NewRule'
import HideContents from '../../components/HideContents/HideContents'
import { UserContext } from '../../contexts/UserContext'
import AppContainer from '../../components/Container/AppContainer'
import { addNewRule, fetchRuleById, sortRulesByDate } from "../../services/rules";

const Rules = () => {
    const { user } = useContext(UserContext);
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNewRuleModalVisible, setIsNewRuleModalVisible] = useState(false)
    const [currentDocId, setCurrentDocId] = useState(null);  
    const [ruleId, setRuleId] = useState("");
    const [selectedRule, setSelectedRule] = useState(null);

    const handleRuleCardClick = (rule) => {
        setSelectedRule(rule);
        setIsNewRuleModalVisible(true);
        setRuleId(rule.ID)
        setCurrentDocId(rule.ID)
    }
    
    
    async function fetchRules() {
      const db = getFirestore();
      const rulesCollection = collection(db, "rules");
      const ruleSnapshot = await getDocs(rulesCollection);
      const ruleList = ruleSnapshot.docs.map(doc => ({ ID: doc.ID, ...doc.data() }));
      return sortRulesByDate(ruleList); // ソート関数を使用

    }

    useEffect(() => {
        async function loadRules() {
          const fetchedRules = await fetchRules();
          setRules(fetchedRules);
          setLoading(false);
        }
    
        loadRules();
    }, []);

    const createNewRuleHandle = async () => {
        try {
            const newDocId = await addNewRule();
            setCurrentDocId(newDocId)
            const updatedRules = await fetchRules(); // 新しいルールを取得します
            setRuleId(newDocId)
            setRules(updatedRules); // 最新のルールのリストでstateを更新します
            const newRuleDetails = await fetchRuleById(newDocId);
            setSelectedRule(newRuleDetails);
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
                    <ul className="rules">
                        {rules.length > 0 ? (
                            rules.map((rule, index) => (
                                <RuleCard 
                                    key={rule.ID} 
                                    rule={rule}
                                    onClick={() => handleRuleCardClick(rule)}
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
                    rules={rules}
                    
                />
                {!user && <HideContents />}
        </div>
        </AppContainer>
        
    )
}

export default Rules
