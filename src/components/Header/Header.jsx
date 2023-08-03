import { Bell, Moon, Plus } from '@phosphor-icons/react'
import "./_header.styl"
import React from 'react'
import { addTrade } from '../../services/trades';

const Header = ({ title, onAddTradeBtnClick }) => {
    const handleAddTradeBtnClick = async () => {
        const trade = {
          STATUS: "",
          ENTRY_DATE: null,
          EXIT_DATE: null,
          ENTRY_PRICE: null,
          EXIT_PRICE: null,
          LOT: null,
          DIR: "",
          PERCENT: null,
          SETUP: "",
          USER_ID: null
        };
        const id = await addTrade(trade);
        console.log("Added trade with ID: ", id);
        onAddTradeBtnClick()  // 追加したトレードのIDを引数として渡す
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
