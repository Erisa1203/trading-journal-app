import { Bell, Moon, Plus } from '@phosphor-icons/react'
import "./_header.styl"
import React from 'react'
import { addTrade } from '../../services/trades';
import { auth } from '../../services/firebase';

const Header = ({ title, onAddTradeBtnClick, setTradeId, setSelectedTrade }) => {
    const handleAddTradeBtnClick = async () => {
        const userId = auth.currentUser ? auth.currentUser.uid : null;
    
        const trade = {
            STATUS: "",
            PAIRS: "",
            ENTRY_DATE: "",
            EXIT_DATE: "",
            ENTRY_PRICE: "",
            EXIT_PRICE: "",
            LOT: "",
            DIR: "",
            RETURN: "",
            SETUP: "",
            PATTERN: "",
            USER_ID: userId, // ここでログインしているユーザーのIDを設定
            NOTE: "",
        };
        const id = await addTrade(trade);
        console.log("Added trade with ID: ", id);
        setTradeId(id)
        setSelectedTrade(trade);
        onAddTradeBtnClick(trade)  // 追加したトレードのIDを引数として渡す
      };
    return (
        <div className='header'>
            <div className="header__left">
                <h1 className='header__title'>{title}</h1>
                <div className="addTradeBtn" onClick={handleAddTradeBtnClick}>
                    <Plus className='icon-16' />
                </div>
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
