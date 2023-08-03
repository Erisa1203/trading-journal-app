import React, { useContext } from 'react';
import { SidebarContext } from '../../contexts/SidebarContext';

const AppContainer = ({ children }) => {
    const { isSidebarClosed } = useContext(SidebarContext);

    return (
        <div className={`app-container ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            {children}
        </div>
    );
};

export default AppContainer;
