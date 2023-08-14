import React, { useContext } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import TradeTable from '../../components/TradeTable/TradeTable'
import { UserContext } from '../../contexts/UserContext'
import HideContents from '../../components/HideContents/HideContents'
import AppContainer from '../../components/Container/AppContainer'
import MyEditor from '../../components/QuillEditor/QuillEditor'

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <AppContainer>
        <Sidebar page="home"/>
        <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
            <Header title="ホーム"/>
            <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
            <TradeTable />
            <MyEditor />
            </div>
            {!user && <HideContents />}
        </div>
    </AppContainer>
  )
}

export default Home
