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

const TradingJournal = () => {
  const { user } = useContext(UserContext)
  const [isVisible, setIsVisible] = useState(false)
  const [trades, setTradesToJournal] = useState([])

  useEffect(() => {
	if(!user) {
		setTradesToJournal([])
	} else {
		const unsubscribe = subscribeToTradeJournal((newTrades) => {
			setTradesToJournal(newTrades);
		});
		return unsubscribe;
	}

  }, [user]);

  return (
	<AppContainer>
        <Sidebar page="trading-journal"/>
        <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
            <Header 
				title="トレード記録"
				onAddTradeBtnClick={() => {
					setIsVisible(true)
				}}
			/>
            <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
                <FilterCards />
                <FilterUI />
                <Filter />
                <TradeTable trades={trades}/>
                <NewTrade 
					visible={isVisible}
					onClose={() => setIsVisible(false)}
				/>
            </div>
            {!user && <HideContents />}
        </div>
	</AppContainer>
  )
}

export default TradingJournal


