import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import { UserContext } from '../../contexts/UserContext'
import HideContents from '../../components/HideContents/HideContents'
import AppContainer from '../../components/Container/AppContainer'
import MyEditor from '../../components/QuillEditor/QuillEditor'
import TradeTable from '../../components/TradeTable/TradeTable'
import { TradesContext } from '../../contexts/TradesContext'
import { useTrades } from '../../services/trades'
import { INITIAL_FILTER_STATE } from '../../services/filter'
import SummaryCharts from '../../components/Summary/SummaryCharts/SummaryCharts'
import { FilterCardsContext } from '../../contexts/FilterCardsContext'
import AccountCard from '../../components/Summary/Card/AccountCard/AccountCard'
import WinRatioCard from '../../components/Summary/Card/WinRatioCard/WinRatioCard'
import PotentialPerformanceCard from '../../components/Summary/Card/PotentialPerformanceCard/PotentialPerformanceCard'
import PairsRatioCard from '../../components/Summary/Card/PairsRatioCard/PairsRatioCard'
import SettingModal from '../../components/Modal/Setting/SettingModal'
import { db } from '../../services/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const Home = () => {
  const { user } = useContext(UserContext);
  const [tradeId, setTradeId] = useState(null)
  const { trades, setTradesToJournal, filteredTrades, setFilteredTrades } = useTrades("journal");
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [filteredOption, setFilteredOption] = useState(INITIAL_FILTER_STATE)
  const [selectedFilters, setSelectedFilters] = useState(["SUMMARY"]);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const onTradeRowClickHandle = (trade) => {
    setSelectedTrade(trade)
    setIsVisible(true)
    setTradeId(trade.id)
  }

  const toggleSettingModal = () => {
    setIsSettingModalVisible(prevVisible => !prevVisible);
  };

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          // Check if firstLogin field exists and if it's set to true
          if (userData.firstLogin) {
            setIsFirstLogin(true);
            // Update the firstLogin field to false
            updateDoc(userDocRef, { firstLogin: false });
            // Open the modal
            setIsSettingModalVisible(true);
          } else if (!("firstLogin" in userData)) {
            // If the user's document doesn't have a firstLogin field, consider it as a first login
            updateDoc(userDocRef, { firstLogin: false });
            setIsSettingModalVisible(true);
          }
        } else {
          // If the user document doesn't exist, create one with firstLogin set to false
          updateDoc(userDocRef, { firstLogin: false });
          setIsSettingModalVisible(true);
        }
      }).catch(error => {
        console.error("Error fetching user data: ", error);
      });
    }
  }, [user]);
  
  

  return (
    <TradesContext.Provider value={{
        trades,
        setTradesToJournal,
        onTradeRowClickHandle,
        filteredTrades,
        setFilteredTrades
      }}>
      <FilterCardsContext.Provider value={{ selectedFilters, setSelectedFilters }}>
        <AppContainer>
            <Sidebar page="home"/>
            <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
                <Header title="ホーム" page="Home" onSettingClick={toggleSettingModal}/>
                <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
                <div className="sumBlock">
                    <div className="sumBlock__left">
                        <div>
                            <AccountCard />
                            <WinRatioCard />
                        </div>
                        <div className="sumBlock__left__bottom">
                            <PotentialPerformanceCard />
                        </div>
                    </div>
                    <div className="sumBlock__right">
                        <PairsRatioCard />
                    </div>
                </div>
                <div className='c-heading02'>直近のトレード</div>
                <TradeTable
                    trades={trades}
                    onTradeRowClick={(trade) => onTradeRowClickHandle(trade)}
                    filteredOption={filteredOption}
                    limitToLast={5}
                    page="journal"
                />
                <MyEditor />
                </div>
                {!user && <HideContents />}
                {isSettingModalVisible && <SettingModal setIsSettingModalVisible = {setIsSettingModalVisible}/>}
            </div>
        </AppContainer>
      </FilterCardsContext.Provider>
    </TradesContext.Provider>
  )
}

export default Home
