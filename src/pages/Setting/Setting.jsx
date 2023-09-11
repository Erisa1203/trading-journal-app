import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import AppContainer from '../../components/Container/AppContainer'

const Setting = () => {

  return (
    <AppContainer>
      <Sidebar page="setting"/>
      <div className="mainContent">
        <Header title="SETTING"/>
        <div className="inner">
          
        </div>
      </div>
    </AppContainer>
  )
}

export default Setting
