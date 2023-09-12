// Provider/AppProvider.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { UserContext } from "../contexts/UserContext";
import { auth, db } from "../services/firebase";
import { SidebarContext } from "../contexts/SidebarContext";
import { doc, onSnapshot } from "firebase/firestore";

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [initial, setInitial] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
    setLoading(false)
  }, []);

  const logout = () => {
    signOut(auth)
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  useEffect(() => {
    if (user) {
        const settingsRef = doc(db, 'setting', user.uid);
        
        // onSnapshotを使用して、データの変更をリアルタイムで監視
        onSnapshot(settingsRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setDisplayName(data.username || user.displayName);  // usernameがあればそれを使用し、なければuser.displayNameを使用
                const googleProviderInfo = user.providerData.find(data => data.providerId === 'google.com');
                const newPhotoURL = googleProviderInfo?.photoURL || data.profileImageUrl;
                setPhotoURL(newPhotoURL);

                const newInitial = (data.username || user.displayName)?.[0];
                setInitial(newInitial);
            }
        });
    }
}, [user]);

  return (
    <UserContext.Provider value={{ user, logout, loading, initial, photoURL, displayName }}>
      <SidebarContext.Provider value={{ isSidebarClosed, setIsSidebarClosed }}>
        {children}
      </SidebarContext.Provider>
    </UserContext.Provider>
  );
};

export default AppProvider;
