import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState(null);
    const [initial, setInitial] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isFirstLogin, setIsFirstLogin] = useState(null);  // 初回ログインかどうかの状態を追加

    useEffect(() => {
        onAuthStateChanged(auth, (newUser) => {
            if (newUser) {
                setUser(newUser);
            } else {
                setUser(null);
                setIsFirstLogin(null); // ユーザーがいない場合はnullを設定
            }
            setLoading(false);
        });
    }, []);
    

    const logout = () => {
        signOut(auth)
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    useEffect(() => {
        if (user) {
            const settingsRef = doc(db, 'users', user.uid);  // usersコレクションを参照する
    
            onSnapshot(settingsRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
    
                    // FirestoreからisFirstLoginのデータを取得
                    if (data.hasOwnProperty("isFirstLogin")) {
                        setIsFirstLogin(data.isFirstLogin);
                    }
    
                    setDisplayName(data.username || user.displayName);
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
        <UserContext.Provider value={{ user, logout, loading, initial, photoURL, displayName, isFirstLogin }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
