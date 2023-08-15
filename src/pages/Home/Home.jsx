import React, { useContext, useState } from 'react'
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

const Home = () => {
  const { user } = useContext(UserContext);
  const [tradeId, setTradeId] = useState(null)
  const { trades, setTradesToJournal, filteredTrades, setFilteredTrades } = useTrades(user);
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const [filteredOption, setFilteredOption] = useState(INITIAL_FILTER_STATE)

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
            <Sidebar page="home"/>
            <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
                <Header title="ホーム"/>
                <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
                <TradeTable
                    trades={trades}
                    onTradeRowClick={(trade) => onTradeRowClickHandle(trade)}
                    filteredOption={filteredOption}
                />
                <MyEditor />
                </div>
                {!user && <HideContents />}
            </div>
        </AppContainer>
    </TradesContext.Provider>
  )
}

export default Home
