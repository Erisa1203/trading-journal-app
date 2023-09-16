import React, { useState } from "react";
import { UserProvider } from "../contexts/UserContext";
import { SidebarContext } from "../contexts/SidebarContext";

const AppProvider = ({ children }) => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(false);

    return (
        <UserProvider>
            <SidebarContext.Provider value={{ isSidebarClosed, setIsSidebarClosed }}>
                {children}
            </SidebarContext.Provider>
        </UserProvider>
    );
};

export default AppProvider;
