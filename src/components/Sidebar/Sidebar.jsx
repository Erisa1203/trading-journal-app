import { Crosshair, House, Notepad, ListMagnifyingGlass, Gear, SignOut, CaretDoubleLeft } from '@phosphor-icons/react';
import React, { useContext, useState } from 'react'
import "./_sidebar.styl"
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { SidebarContext } from '../../contexts/SidebarContext';
import { useTheme } from '../../contexts/ThemeContext';
import logoWhite from "../../img/logo_white.svg"
import logo from "../../img/logo.svg"

const Sidebar = ({ page }) => {
    const { logout } = useContext(UserContext);
    const { isSidebarClosed, setIsSidebarClosed } = useContext(SidebarContext)
    const { darkMode } = useTheme();

    const handleSidebarToggle = () => {  // sidebarを開閉する関数を定義
        setIsSidebarClosed(prev => !prev);
    };

    return (
        <div className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
            <CaretDoubleLeft weight='bold' className={`icon-16 icon-color-primary sidebar__back ${isSidebarClosed ? 'active' : ''}`} onClick={handleSidebarToggle}/>
            <div className="sidebar__logo">
            {darkMode ? 
                <img src={logoWhite} alt="" /> :
                <img src={logo} alt="" />
            }
            </div>
            <nav className='sidebar__nav'>
                <ul className='navigation'>
                    <li className={`navigation__item ${page === 'home' ? 'active' : ''}`}>
                        <Link to="/" className='navigation__link'>
                            <House weight={page === 'home' ? 'fill' : 'regular'} className='icon-24 navigation__icon'/>
                            <span className='navigation__title'>ホーム</span>
                        </Link>
                    </li>
                    <li className={`navigation__item ${page === 'trading-journal' ? 'active' : ''}`}>
                        <Link to="/trading-journal" className='navigation__link'>
                            <Notepad weight={page === 'trading-journal' ? 'fill' : 'regular'} className='icon-24 navigation__icon'/>
                            <span className='navigation__title'>トレード記録</span>
                        </Link>
                    </li>
                    <li className={`navigation__item ${page === 'backtest' ? 'active' : ''}`}>
                        <Link to="/backtest" className='navigation__link'>
                            <ListMagnifyingGlass weight={page === 'backtest' ? 'fill' : 'regular'} className='icon-24 navigation__icon'/>
                            <span className='navigation__title'>トレード検証</span>
                        </Link>
                    </li>
                    <li className={`navigation__item ${page === 'rules' ? 'active' : ''}`}>
                        <Link to="/rules" className='navigation__link'>
                            <Crosshair weight={page === 'rules' ? 'fill' : 'regular'} className='icon-24 navigation__icon'/>
                            <span className='navigation__title'>ルール作成</span>
                        </Link>
                    </li>
                </ul>
                <ul className="navigation navigation--bottom">
                    {/* <li className={`navigation__item ${page === 'setting' ? 'active' : ''}`}>
                        <Link to="/setting" className='navigation__link'>
                            <Gear weight={page === 'setting' ? 'fill' : 'regular'} className='icon-24 navigation__icon'/>
                            <span className='navigation__title'>SETTING</span>
                        </Link>
                    </li> */}
                    <li className="navigation__item">
                        <Link to="/" className='navigation__link'>
                            <SignOut className='icon-24 navigation__icon'/>
                            <span className='navigation__title' onClick={logout}>ログアウト</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
