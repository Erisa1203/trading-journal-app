import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { arrayUnion, doc, getFirestore, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { backgrounds } from "../constants/colors";
import { sortOptionsAlphabetically } from "../services/options";

export const useCustomOptionCreation = (initialOptions, onOptionsChange, setSelectedOption) => {
    const [options, setOptions] = useState(initialOptions);
    const user = auth.currentUser;
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {

    //             const fetchData = async () => {
    //                 setLoading(true);
    //                 const db = getFirestore();
    //                 const docRef = doc(db, "users", user.uid);
    //                 const docSnap = await getDoc(docRef);
    //                 if (docSnap.exists()) {
    //                     const fetchedTags = docSnap.data().customTags;
    //                     const newOptions = sortOptionsAlphabetically(fetchedTags.map(tag => ({
    //                         value: tag.value,
    //                         label: tag.label,
    //                         color: tag.color,
    //                     })));
                        
    //                     console.log('newOptions', newOptions)
    //                     setOptions(newOptions);
    //                 } else {
    //                     console.log("No such document!");
    //                 }
    //                 setLoading(false);
    //             };
    //             fetchData();
    //         } else {
    //             setOptions([]);
    //             setLoading(false);
    //         }
    //     });
    //     return () => unsubscribe();
    // }, []); // Changed from [auth]

    const handleCreateNewOption = async (inputValue) => {
        // Skip if the tag already exists
        if (options.some(option => option.value === inputValue)) {
            return;
        }
        if (typeof inputValue !== 'string') {
            console.error('Invalid input value: ', inputValue);
            return;
        }
    
        let color;
        if (inputValue.substring(0, 3) === 'EUR') {
            color = backgrounds.purple;
        } else if (inputValue.substring(0, 3) === 'USD') {
            color = backgrounds.red;
        } else if (inputValue.substring(0, 3) === 'GBP') {
            color = backgrounds.yellow;
        } else if (inputValue.substring(0, 3) === 'pink') {
            color = backgrounds.red;
        }else {
            color = 'defaultColor'; // or any other default color
        }
    
        const newOption = { 
            value: inputValue,
            label: inputValue,
            color: color
        };
    
        // Turn setOptions into a promise
        await new Promise(resolve => {
            setOptions(prevOptions => {
                const newOptions = sortOptionsAlphabetically([...prevOptions, newOption]); // <-- Sort the options
                onOptionsChange(newOptions);  // Inform the caller about the options change
                resolve(newOptions);  // Resolve the promise after the state is updated
                return newOptions;
            });
        }).then(() => {
            setSelectedOption(newOption);
        });
    
        try {
            const db = getFirestore();
            const userDoc = doc(db, 'users', user.uid);
            await updateDoc(userDoc, {
                customTags: arrayUnion(newOption)
            });
            setSelectedOption(newOption);
        } catch (error) {
            console.error("Error updating document: ", error);
        }    
        return newOption;
    };

    return [options, handleCreateNewOption, loading, setLoading];
};
