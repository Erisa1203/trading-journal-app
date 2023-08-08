import { doc, getFirestore, onSnapshot, arrayUnion, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { backgrounds } from "../constants/colors";

export const useCustomPatternCreation = (initialOptions, setDbPatternOptions, setSelectedPatternOption) => {
    const [patternOptions, setPatternOptions] = useState(initialOptions);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    const handleCreateNewPatternOption = async (inputValue) => {
        const colorKeys = Object.keys(backgrounds);
        const randomColor = backgrounds[colorKeys[Math.floor(Math.random() * colorKeys.length)]];

        const newOption = { value: inputValue, label: inputValue, color: randomColor };
        const db = getFirestore();
        const userDoc = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDoc, {
            patterns: arrayUnion(newOption)
        });
        setPatternOptions((currentOptions) => [...currentOptions, newOption]);
        setSelectedPatternOption(newOption);
        return newOption;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchData = async () => {
                    const db = getFirestore();
                    const docRef = doc(db, "users", user.uid);
                    onSnapshot(docRef, async (docSnap) => {
                        if (docSnap.exists()) {
                            if (!docSnap.data().hasOwnProperty('patterns')) {
                                await updateDoc(docRef, {
                                    patterns: []
                                });
                            } else {
                                const fetchedPatterns = docSnap.data().patterns;
                                const newOptions = fetchedPatterns.map(pattern => ({
                                    value: pattern.value,
                                    label: pattern.label,
                                    color: pattern.color,
                                }));
                                setDbPatternOptions(newOptions);
                                setLoading(false);
                            }
                        } else {
                            console.log("No such document!");
                            setLoading(false);
                        }
                    });
                };

                fetchData();
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    return [patternOptions, handleCreateNewPatternOption, loading, setLoading];
};
