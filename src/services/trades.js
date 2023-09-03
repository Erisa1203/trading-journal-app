import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, updateDoc, Timestamp, getFirestore, deleteDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { backgrounds } from "../constants/colors";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";

export const INITIAL_TRADE_STATE = ( userId ) =>  {
    const trade = {
        STATUS: "",
        PAIRS: "",
        ENTRY_DATE: "",
        EXIT_DATE: "",
        ENTRY_PRICE: "",
        EXIT_PRICE: "",
        LOT: "",
        DIR: "",
        RETURN: "",
        PROFIT: "",
        SETUP: "",
        PATTERN: "",
        USER_ID: userId,
        NOTE: "",
    }
    return trade
  };

export const shortLongOptions = [
    { value: 'SHORT', label: 'SHORT', color: backgrounds.blue }, // color を追加
    { value: 'LONG', label: 'LONG', color: backgrounds.red }, // color を追加
];

export const patternOption = [
    { value: 'REVERSAL', label: 'REVERSAL', color: backgrounds.pink }, // color を追加
    { value: 'CONTINUATION', label: 'CONTINUATION', color: backgrounds.yellow }, // color を追加
];

export const calculateStatus = (trade) => {
    if (trade.RETURN) {
        const status = trade.RETURN > 0 ? 'WIN' : (trade.RETURN < 0 ? 'LOSS' : 'BREAKEVEN');
        return status; 
    }
    return null; 
}

export const getTradeById = async (tradeId) => {
    try {
        const tradeRef = doc(db, "journal", tradeId);
        const tradeDoc = await getDoc(tradeRef);

        if (tradeDoc.exists()) {
            const data = tradeDoc.data();
            
            // Convert ENTRY_DATE and EXIT_DATE from Timestamp to Date
            if (data.ENTRY_DATE && typeof data.ENTRY_DATE.toDate === 'function') {
                data.ENTRY_DATE = data.ENTRY_DATE.toDate();
            }
            if (data.EXIT_DATE && typeof data.EXIT_DATE.toDate === 'function') {
                data.EXIT_DATE = data.EXIT_DATE.toDate();
            }
            
            return {
                id: tradeDoc.id,
                ...data
            };
        } else {
            console.error("Trade not found with ID:", tradeId);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching trade with ID ${tradeId}:`, error);
        return null;
    }
};

export function subscribeToTradeJournal(callback) {

    const journalRef = collection(db, "journal");
  
    return onSnapshot(journalRef, (snapshot) => {
        const trades = snapshot.docs.map((doc) => {
            const data = doc.data();
            
            // Convert ENTRY_DATE and EXIT_DATE from Timestamp to Date
            if (data.ENTRY_DATE && typeof data.ENTRY_DATE.toDate === 'function') {
                data.ENTRY_DATE = data.ENTRY_DATE.toDate();
            }
            if (data.EXIT_DATE && typeof data.EXIT_DATE.toDate === 'function') {
                data.EXIT_DATE = data.EXIT_DATE.toDate();
            }
            
            return {
              id: doc.id,
              ...data
            }
        });
  
      callback(trades);
    });
}

export const useTrades = () => {
    const { user } = useContext(UserContext);
    const [trades, setTradesToJournal] = useState([]);
    const [filteredTrades, setFilteredTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    const subscribeToTradeJournal = (callback) => {
        if (!user) {
            return;
        }
    
        const journalRef = collection(db, "journal");
        const userQuery = user ? query(journalRef, where("USER_ID", "==", user.uid)) : null;

        return onSnapshot(userQuery, (snapshot) => {
            const trades = snapshot.docs.map((doc) => {
                const data = doc.data();

                if (data.ENTRY_DATE && typeof data.ENTRY_DATE.toDate === 'function') {
                    data.ENTRY_DATE = data.ENTRY_DATE.toDate();
                }
                if (data.EXIT_DATE && typeof data.EXIT_DATE.toDate === 'function') {
                    data.EXIT_DATE = data.EXIT_DATE.toDate();
                }

                return {
                    id: doc.id,
                    ...data
                };
            });

            callback(trades);
        });
    };

    useEffect(() => {
        if (!user) {
            setTradesToJournal([]);
            setFilteredTrades([]);
            setLoading(false);
        } else {
            const unsubscribe = subscribeToTradeJournal((newTrades) => {
                setTradesToJournal(newTrades);
            });
            setLoading(false);
            return unsubscribe;
        }
    }, [user]);

    return { trades, setTradesToJournal, filteredTrades, setFilteredTrades, loading };
};


export const addTrade = async (trade) => {
    const journalCol = collection(db, "journal");
    const docRef = await addDoc(journalCol, trade);
    return docRef.id;
};

export const updateFieldInTrade = async (fieldName, inputValue, tradeId) => {
    if (inputValue === undefined) {
        console.error(`Undefined inputValue for ${fieldName} in trade ${tradeId}`);
        return;
    }

    const tradeRef = doc(getFirestore(), "journal", tradeId);
    const docSnap = await getDoc(tradeRef);
    
    let valueToUpdate;
    if(typeof inputValue === 'object' && inputValue instanceof Date) {
        // Convert Date object to Firestore Timestamp
        valueToUpdate = Timestamp.fromDate(inputValue);
    } else if (inputValue !== null && typeof inputValue === 'object') {
        valueToUpdate = inputValue.label;
    } else {
        valueToUpdate = inputValue;
    }

    if (docSnap.exists()) {
        await updateDoc(tradeRef, {
            [fieldName]: valueToUpdate  // 更新したいフィールドを指定
        });
    } else {
        // The document does not exist, create it
        await setDoc(tradeRef, {
            [fieldName]: valueToUpdate
        });
    }
};

export const updatePairsInTrade = (selectedOption, tradeId) => updateFieldInTrade('PAIRS', selectedOption, tradeId);


export const updateSetupInTrade = (selectedOption, tradeId) => updateFieldInTrade('SETUP', selectedOption, tradeId);

export const updatePatternsInTrade = (selectedOption, tradeId) => updateFieldInTrade('PATTERN', selectedOption, tradeId);

export const updateReturnInTrade = async (inputValue, tradeId) => {
    await updateFieldInTrade('RETURN', inputValue, tradeId);
    const updatedTrade = await getTradeById(tradeId);
    const status = calculateStatus(updatedTrade);
    await updateFieldInTrade('STATUS', status, tradeId);
};

export const updateProfitInTrade = (inputValue, tradeId) => updateFieldInTrade('PROFIT', inputValue, tradeId);

export const updateLotInTrade = (inputValue, tradeId) => updateFieldInTrade('LOT', inputValue, tradeId);

export const updateEntryDateInTrade = (inputValue, tradeId) => updateFieldInTrade('ENTRY_DATE', inputValue, tradeId);

export const updateExitDateInTrade = (inputValue, tradeId) => updateFieldInTrade('EXIT_DATE', inputValue, tradeId);

export const updateDirInTrade = async (selectedOption, tradeId) => {
    await updateFieldInTrade('DIR', selectedOption, tradeId);
};

export const updateEntryPriceInTrade = async (inputValue, tradeId) => {
    await updateFieldInTrade('ENTRY_PRICE', inputValue, tradeId);
};

export const updateExitPriceInTrade = async (inputValue, tradeId) => {
    await updateFieldInTrade('EXIT_PRICE', inputValue, tradeId);
};

export const getTagByLabel = async (label, userId, path) => {
    
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
            console.error("User document not found!");
            return null;
        }
        
        const tags = userDocSnap.data()[path];
        if (!tags) {
            console.warn(`No ${path} found for the user!`);
            return null;
        }
        
        const matchingTag = tags.find(tag => tag.label === label);

        return matchingTag || null;
    } catch (error) {
        console.error(`Error fetching ${path} by label:`, error);
        return null;
    }
};




export const deleteTradeById = async (tradeId) => {
    try {
        const tradeRef = doc(db, "journal", tradeId);
        await deleteDoc(tradeRef);
        console.log(`Trade with ID ${tradeId} has been successfully deleted.`);
    } catch (error) {
        console.error(`Error deleting trade with ID ${tradeId}:`, error);
    }
};
