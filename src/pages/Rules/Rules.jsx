import React, { useContext } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header'
import RuleCard from '../../components/RuleCard/RuleCard'
import NewRule from '../../components/Modal/NewRule/NewRule'
import HideContents from '../../components/HideContents/HideContents'
import { UserContext } from '../../contexts/UserContext'
import AppContainer from '../../components/Container/AppContainer'

const Rules = () => {
    const { user } = useContext(UserContext);

  return (
    <AppContainer>
      <Sidebar page="rules"/>
        <div className="mainContent" style={!user ? { overflow: 'hidden' } : {}}>
            <Header title="ルール作成"/>
            <div className="inner" style={!user ? { filter: 'blur(3px)' } : {}}>
                <ul className="rules">
                    <RuleCard />
                    <RuleCard />
                    <RuleCard />
                    <RuleCard />
                    <RuleCard />
                    <RuleCard />
                    <RuleCard />
                    <NewRule />
                </ul>
            </div>
            {!user && <HideContents />}
      </div>
    </AppContainer>
      
  )
}

export default Rules
