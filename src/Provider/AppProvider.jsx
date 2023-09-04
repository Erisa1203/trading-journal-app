// Provider/AppProvider.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { UserContext } from "../contexts/UserContext";
import { auth } from "../services/firebase";
import { SidebarContext } from "../contexts/SidebarContext";

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const logout = () => {
    signOut(auth)
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <UserContext.Provider value={{ user, logout }}>
      <SidebarContext.Provider value={{ isSidebarClosed, setIsSidebarClosed }}>
        {children}
      </SidebarContext.Provider>
    </UserContext.Provider>
  );
};

export default AppProvider;
