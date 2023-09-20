import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import FilterUI from '../../components/FilterUI/FilterUI'
import Filter from '../../components/Filter/Filter'
import FilterCards from '../../components/FilterCards/FilterCards'
import NewTrade from '../../components/Modal/NewTrade/NewTrade'
import HideContents from '../../components/HideContents/HideContents'
import { UserContext } from '../../contexts/UserContext'
import AppContainer from '../../components/Container/AppContainer'
import { subscribeToTradeJournal, useTrades } from '../../services/trades.js';
import { TradesContext } from '../../contexts/TradesContext'
import TradeTable from '../../components/TradeTable/TradeTable'
import { INITIAL_FILTER_STATE } from '../../services/filter'
import Summary from '../../components/Summary/Summary'
import useSettingModal from '../../hooks/useSettingModal'
import SettingModal from '../../components/Modal/Setting/SettingModal'

const TradingJournal = () => {
  const { user, isFirstLogin } = useContext(UserContext)
  const [isVisible, setIsVisible] = useState(false)
  const [tradeId, setTradeId] = useState(null)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [dbSetupOptions, setDbSetupOptions] = useState([])
  const [dbPatternOptions, setDbPatternOptions] = useState(["CONTINUATION", "REVERSAL"])
  const [filteredOption, setFilteredOption] = useState(INITIAL_FILTER_STATE)
  const [clearFilterIsActive, setClearFilterIsActive] = useState(false)
  const [filterUIClearClicked, setFilterUIClearClicked] = useState('')
  const { trades, setTradesToJournal, filteredTrades, setFilteredTrades, loading } = useTrades("journal");
  const [filterIsActive, setFilterIsActive] = useState(false); 
  const { isSettingModalVisible, toggleSettingModal, setIsSettingModalVisible } = useSettingModal(user, isFirstLogin);

  const onTradeRowClickHandle = (trade) => {
    setSelectedTrade(trade)
    setIsVisible(true)
    setTradeId(trade.id)
  }

  const setNextTrade = (currentTrade) => {
    const currentIndex = trades.findIndex(trade => trade.id === currentTrade.id);
    if (currentIndex !== -1 && currentIndex < trades.length - 1) {
      const nextTrade = trades[currentIndex + 1];
      setSelectedTrade(nextTrade);
    }
  }
  
  const setPreviousTrade = (currentTrade) => {
    const currentIndex = trades.findIndex(trade => trade.id === currentTrade.id);
    if (currentIndex > 0) {
      const previousTrade = trades[currentIndex - 1];
      setSelectedTrade(previousTrade);
    }
}

  return (
    <TradesContext.Provider value={{
      trades,
      setTradesToJournal,
      onTradeRowClickHandle,
      filteredTrades,
      setFilteredTrades,
      loading
    }}>
        <AppContainer>
            <Sidebar page="trading-journal"/>
            <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
                <Header 
                    title="トレード記録"
                    page="TradingJournal"
                    setTradeId={setTradeId}
                    setSelectedTrade={setSelectedTrade}
                    onAddTradeBtnClick={(newTrade) => {  // 新しいトレード情報を引数として受け取る
                        setSelectedTrade(newTrade);  // 新しい（空の）トレード情報をセット
                        setIsVisible(true);
                    }}
                    onSettingClick={toggleSettingModal}
                />
                <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
                    <Summary />
                    <FilterUI 
                        filteredOption={filteredOption}
                        setFilteredOption={setFilteredOption}
                        setClearFilterIsActive={setClearFilterIsActive}
                        setFilterUIClearClicked={setFilterUIClearClicked}
                    />
                    <Filter 
                      trades={trades} 
                      dbSetupOptions={dbSetupOptions} 
                      setDbSetupOptions={setDbSetupOptions}
                      dbPatternOptions={dbPatternOptions} 
                      setDbPatternOptions={setDbPatternOptions}
                      filteredOption={filteredOption}
                      setFilteredOption={setFilteredOption}
                      clearFilterIsActive={clearFilterIsActive}
                      setClearFilterIsActive={setClearFilterIsActive}
                      filterUIClearClicked={filterUIClearClicked}
                      setFilterIsActive={setFilterIsActive}
                      page="journal"
                    />
                    <TradeTable
                        trades={trades}
                        onTradeRowClick={(trade) => onTradeRowClickHandle(trade)}
                        filteredOption={filteredOption}
                        filterIsActive={filterIsActive}
                        setFilterIsActive={setFilterIsActive}
                        page="journal"
                    />
                    <NewTrade 
                      dbCollection="journal"
                      visible={isVisible}
                      setIsVisible={setIsVisible}
                      onClose={() => setIsVisible(false)}
                      tradeId={tradeId}
                      trade={selectedTrade}
                      dbSetupOptions={dbSetupOptions} 
                      setDbSetupOptions={setDbSetupOptions}
                      setNextTrade={setNextTrade}
                      setPreviousTrade={setPreviousTrade}
                    />
                </div>
                {!user && <HideContents />}
                {isSettingModalVisible && <SettingModal setIsSettingModalVisible = {setIsSettingModalVisible}/>}
            </div>
        </AppContainer>
    </TradesContext.Provider>
  )
}

export default TradingJournal


