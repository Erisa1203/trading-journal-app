import { doc, getFirestore, onSnapshot, arrayUnion, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { backgrounds } from "../constants/colors"; // Make sure to import this

export const useCustomSetupCreation = (initialOptions, setDbSetupOptions, setSelectedSetupOption) => {
    const [setupOptions, setSetupOptions] = useState(initialOptions);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    const handleCreateNewSetupOption = async (inputValue) => {
        // Get a random color from the backgrounds object
        const colorKeys = Object.keys(backgrounds);
        const randomColor = backgrounds[colorKeys[Math.floor(Math.random() * colorKeys.length)]];

        const newOption = { value: inputValue, label: inputValue, color: randomColor };  // Include the color in the newOption
        // get the firestore
        const db = getFirestore();
        const userDoc = doc(db, "users", auth.currentUser.uid);
        // update the firestore with the new option
        await updateDoc(userDoc, {
            setup: arrayUnion(newOption)
        });
        setSetupOptions((currentOptions) => [...currentOptions, newOption]);
        setSelectedSetupOption(newOption);
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
                            // Check if the setups field exists in the document
                            // console.log(docSnap)
                            if (!docSnap.data().hasOwnProperty('setup')) {
                                // If the setups field does not exist, create it by setting an empty array
                                await updateDoc(docRef, {
                                    setup: []
                                });
                            } else {
                                const fetchedSetups = docSnap.data().setup;
                                const newOptions = fetchedSetups.map(setup => ({
                                    value: setup.value,
                                    label: setup.label,
                                    color: setup.color,
                                }));
                                // console.log(newOptions)
                                setDbSetupOptions(newOptions);
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
    
    

    return [setupOptions, handleCreateNewSetupOption, loading, setLoading];
};
