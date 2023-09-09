import { Bell, Moon, Plus } from '@phosphor-icons/react'
import "./_header.styl"
import React from 'react'
import { INITIAL_TRADE_STATE, addTrade } from '../../services/trades';
import { auth } from '../../services/firebase';

const Header = ({ title, onAddTradeBtnClick, setTradeId, setSelectedTrade, page, createNewRuleHandle }) => {
    const handleAddTradeBtnClick = async () => {
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        const trade = INITIAL_TRADE_STATE(userId);
    
        // pageプロパティの値に基づいてcolNameを設定
        let colName = '';
        if (page === 'TradingJournal') {
            colName = 'journal';
        } else if (page === 'Backtest') {
            colName = 'backtest';
        }
    
        // 引数として設定したcolNameを使用してaddTradeを呼び出す
        const id = await addTrade(trade, colName);
    
        console.log("Added trade with ID: ", id);
        setTradeId(id)
        setSelectedTrade(trade);
        onAddTradeBtnClick(trade)  // 追加したトレードのIDを引数として渡す
    };
    

    const buttonConfigs = {
        'TradingJournal': {
            className: "addTradeBtn",
            onClick: handleAddTradeBtnClick
        },
        'Backtest': {
            className: "addNewBacktestBtn",
            onClick: handleAddTradeBtnClick
        },
        'Rules': {
            className: "addNewRulesBtn",
            onClick: createNewRuleHandle
        }
    };
    const config = buttonConfigs[page];

    return (
        <div className='header'>
            <div className="header__left">
                <h1 className='header__title'>{title}</h1>
                {config && (
                    <div className={`addBtn ${config.className}`} onClick={config.onClick}>
                        <Plus className='icon-16' />
                    </div>
                )}
            </div>
            <div className="header__right">
                <div className="darkModeBtn">
                    <Moon className='icon-24'/>
                </div>
                <Bell className='icon-24 notificationBtn'/>
                <div className="account-img">
                    <img src="/img/account.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Header
