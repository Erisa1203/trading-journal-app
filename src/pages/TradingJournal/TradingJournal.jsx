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

const TradingJournal = () => {
  const { user } = useContext(UserContext)
  const [isVisible, setIsVisible] = useState(false)
  const [tradeId, setTradeId] = useState(null)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [dbSetupOptions, setDbSetupOptions] = useState([])
  const [dbPatternOptions, setDbPatternOptions] = useState([])
  const [filteredOption, setFilteredOption] = useState(INITIAL_FILTER_STATE)
  const [clearFilterIsActive, setClearFilterIsActive] = useState(false)
  const [filterUIClearClicked, setFilterUIClearClicked] = useState('')
  const { trades, setTradesToJournal, filteredTrades, setFilteredTrades, loading } = useTrades("journal");
  const [filterIsActive, setFilterIsActive] = useState(false); 

  const onTradeRowClickHandle = (trade) => {
    setSelectedTrade(trade)
    setIsVisible(true)
    setTradeId(trade.id)
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
                    />
                    <TradeTable
                        trades={trades}
                        onTradeRowClick={(trade) => onTradeRowClickHandle(trade)}
                        filteredOption={filteredOption}
                        filterIsActive={filterIsActive}
                        setFilterIsActive={setFilterIsActive}
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
                    />
                </div>
                {!user && <HideContents />}
            </div>
        </AppContainer>
    </TradesContext.Provider>
  )
}

export default TradingJournal


