import React, { useContext } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import Filter from '../../components/Filter/Filter'
import FilterCards from '../../components/FilterCards/FilterCards'
import TradeTable from '../../components/TradeTable/TradeTable'
import FilterUI from '../../components/FilterUI/FilterUI'
import { UserContext } from '../../contexts/UserContext'
import HideContents from '../../components/HideContents/HideContents'
import AppContainer from '../../components/Container/AppContainer'

const Backtest = () => {
  const { user } = useContext(UserContext);

  return (
    <AppContainer>
        <Sidebar page="backtest"/>
        <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
            <Header title="トレード検証"/>
            <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
                <FilterCards />
                <Filter />
                <FilterUI />
                <TradeTable />
            </div>
            {!user && <HideContents />}
      </div>
    </AppContainer>
  )
}

export default Backtest
