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
        // onAuthStateChangedの購読を開始
        const unsubscribeAuth = onAuthStateChanged(auth, (newUser) => {
            if (newUser) {
                setUser(newUser);
            } else {
                setUser(null);
                setIsFirstLogin(null)
                setPhotoURL(null)
                setInitial("")
                setDisplayName("");
            }
            setLoading(false);
        });
    
        // useEffectのクリーンアップ関数で購読を終了
        return () => {
            unsubscribeAuth();
        };
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
    
            const unsubscribeSettings = onSnapshot(settingsRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    
                    // 'setting' コレクションの username が存在すればそれを使い、存在しなければ user の displayName を使用
                    const newDisplayName = data.username ? data.username : user.displayName || "";
                    setDisplayName(newDisplayName);
            
                    const newInitial = newDisplayName?.[0]; // username または displayName の最初の文字を initial に設定
                    setInitial(newInitial);
            
                    const googleProviderInfo = user.providerData.find(data => data.providerId === 'google.com');
                    const newPhotoURL = googleProviderInfo?.photoURL || data.profileImageUrl;
                    setPhotoURL(newPhotoURL);
                } else {
                    // Firestoreの 'setting' コレクションにデータがない場合、
                    // Firebase AuthenticationのuserからdisplayNameを取得してinitialとdisplayNameを設定
                    if (user.displayName) {
                        setDisplayName(user.displayName);
                        setInitial(user.displayName[0]);
                    }
                }
            });
            
            
            const usersRef = doc(db, 'users', user.uid);
            const unsubscribeUsers = onSnapshot(usersRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    // FirestoreからisFirstLoginとusernameのデータを取得
                    if (data.hasOwnProperty("isFirstLogin")) {
                        setIsFirstLogin(data.isFirstLogin);
                    }
                }
            });
            // useEffectのクリーンアップ関数で購読を終了
            return () => {
                unsubscribeSettings();
                unsubscribeUsers();
            };
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
