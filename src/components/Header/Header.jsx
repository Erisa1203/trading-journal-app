import { Bell, Moon, Plus } from '@phosphor-icons/react'
import "./_header.styl"
import React, { useContext, useEffect, useState } from 'react'
import { INITIAL_TRADE_STATE, addTrade } from '../../services/trades';
import { auth } from '../../services/firebase';
import AccountModal from '../Modal/Account/AccountModal';
import { UserContext } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ title, onAddTradeBtnClick, setTradeId, setSelectedTrade, page, createNewRuleHandle, onSettingClick }) => {
    const { user, photoURL, initial } = useContext(UserContext);
    const [IsAccountModalVisible, setIsAccountModalVisible] = useState(false)
    const { darkMode, toggleDarkMode } = useTheme();

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

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        document.body.classList.toggle('light-mode', !darkMode);
    }, [darkMode]);

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
                <div className="darkModeBtn" onClick={toggleDarkMode}>
                    <Moon className='icon-24'/>
                </div>
                {/* <Bell className='icon-24 notificationBtn'/> */}
                <div className="account-img" onClick={() => setIsAccountModalVisible(!IsAccountModalVisible)}>
                    {photoURL 
                        ? <img src={photoURL} alt="" />
                        : <span className="initial">{initial}</span>
                    }
                </div>
                {IsAccountModalVisible && (
                    <>
                        <div className="modal-overlay" onClick={() => setIsAccountModalVisible(false)}></div>
                        <AccountModal onSettingClick={onSettingClick}/>
                    </>
                )}
                
            </div>
        </div>
    )
}

export default Header
