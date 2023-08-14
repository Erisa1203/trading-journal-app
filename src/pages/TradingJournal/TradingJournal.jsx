import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import FilterUI from '../../components/FilterUI/FilterUI'
import Filter from '../../components/Filter/Filter'
import FilterCards from '../../components/FilterCards/FilterCards'
import TradeTable from '../../components/TradeTable/TradeTable'
import NewTrade from '../../components/Modal/NewTrade/NewTrade'
import HideContents from '../../components/HideContents/HideContents'
import { UserContext } from '../../contexts/UserContext'
import AppContainer from '../../components/Container/AppContainer'
import { subscribeToTradeJournal } from '../../services/trades.js';
import { TradesContext } from '../../contexts/TradesContext'

const TradingJournal = () => {
  const { user } = useContext(UserContext)
  const [isVisible, setIsVisible] = useState(false)
  const [trades, setTradesToJournal] = useState([])
  const [tradeId, setTradeId] = useState(null)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [filteredTrades, setFilteredTrades] = useState([])
  const [dbSetupOptions, setDbSetupOptions] = useState([])
  const [dbPatternOptions, setDbPatternOptions] = useState([])
  const [filteredOption, setFilteredOption] = useState({
    WIN: '',
    LOSS: '',
    OVER_3: '',
    ALL: '',
    PAIRS: '',
    DIR: '',
    SETUPS: '',
    PATTERN: '',
    FROM: '',
    TO: '',
  })
  const [clearFilterIsActive, setClearFilterIsActive] = useState(false)
  const [filterUIClearClicked, setFilterUIClearClicked] = useState('')
 
//   console.log('filterUIClearClicked', filterUIClearClicked)

  useEffect(() => {
    if(!user) {
        setTradesToJournal([])
        setFilteredTrades([])  // ユーザーがいない場合にフィルタリングされたトレードも初期化します。
    } else {
        const unsubscribe = subscribeToTradeJournal((newTrades) => {
            setTradesToJournal(newTrades)
            setFilteredTrades(newTrades)  // 新しいトレードが取得されたら、それもフィルタリングされたトレードとして設定します。
        })
        return unsubscribe
    }

  }, [user])

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
      setFilteredTrades
    }}>
        <AppContainer>
            <Sidebar page="trading-journal"/>
            <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
                <Header 
                    title="トレード記録"
                    setTradeId={setTradeId}
                    setSelectedTrade={setSelectedTrade}
                    onAddTradeBtnClick={(newTrade) => {  // 新しいトレード情報を引数として受け取る
                        setSelectedTrade(newTrade);  // 新しい（空の）トレード情報をセット
                        setIsVisible(true);
                    }}
                />
                <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
                    <FilterCards />
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
                    />
                    <TradeTable 
                        trades={trades}
                        onTradeRowClick={(trade) => onTradeRowClickHandle(trade)}
                    />
                    <NewTrade 
                      visible={isVisible}
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


