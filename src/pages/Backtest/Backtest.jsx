import React, { useContext, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import Filter from '../../components/Filter/Filter'
import FilterCards from '../../components/FilterCards/FilterCards'
import TradeTable from '../../components/TradeTable/TradeTable'
import FilterUI from '../../components/FilterUI/FilterUI'
import { UserContext } from '../../contexts/UserContext'
import HideContents from '../../components/HideContents/HideContents'
import AppContainer from '../../components/Container/AppContainer'
import Summary from '../../components/Summary/Summary'
import NewTrade from '../../components/Modal/NewTrade/NewTrade'
import { useTrades } from '../../services/trades'
import { INITIAL_FILTER_STATE } from '../../services/filter'
import { TradesContext } from '../../contexts/TradesContext'
import SettingModal from '../../components/Modal/Setting/SettingModal'
import useSettingModal from '../../hooks/useSettingModal'

const Backtest = () => {
  const { user, isFirstLogin } = useContext(UserContext);
  const [filteredOption, setFilteredOption] = useState(INITIAL_FILTER_STATE)
  const [clearFilterIsActive, setClearFilterIsActive] = useState(false)
  const [filterIsActive, setFilterIsActive] = useState(false); 
  const [dbSetupOptions, setDbSetupOptions] = useState([])
  const [dbPatternOptions, setDbPatternOptions] = useState([])
  const [filterUIClearClicked, setFilterUIClearClicked] = useState('')

  const [isVisible, setIsVisible] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [tradeId, setTradeId] = useState(null)
  const { trades, setTradesToJournal, filteredTrades, setFilteredTrades, loading } = useTrades("backtest");
  const { isSettingModalVisible, toggleSettingModal, setIsSettingModalVisible } = useSettingModal(user, isFirstLogin);


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
          <Sidebar page="backtest"/>
          <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
              <Header 
                  title="トレード検証"
                  page="Backtest"
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
                        page="backtest"
                      />
                      <TradeTable
                          trades={trades}
                          onTradeRowClick={(trade) => onTradeRowClickHandle(trade)}
                          filteredOption={filteredOption}
                          filterIsActive={filterIsActive}
                          setFilterIsActive={setFilterIsActive}
                          page="backtest"
                      />
                      <NewTrade 
                          dbCollection="backtest"
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
              {isSettingModalVisible && <SettingModal setIsSettingModalVisible = {setIsSettingModalVisible}/>}
        </div>
      </AppContainer>
    </TradesContext.Provider>
  )
}
export default Backtest
