import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, updateDoc, Timestamp, getFirestore } from "firebase/firestore";
import { db } from "./firebase";
import { backgrounds } from "../constants/colors";

export const shortLongOptions = [
    { value: 'SHORT', label: 'SHORT', color: backgrounds.blue }, // color を追加
    { value: 'LONG', label: 'LONG', color: backgrounds.red }, // color を追加
];

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

export const addTrade = async (trade) => {
    const journalCol = collection(db, "journal");
    const docRef = await addDoc(journalCol, trade);
    return docRef.id;
};

const updateFieldInTrade = async (fieldName, inputValue, tradeId) => {
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

export const updateDirInTrade = (selectedOption, tradeId) => updateFieldInTrade('DIR', selectedOption, tradeId);

export const updateSetupInTrade = (selectedOption, tradeId) => updateFieldInTrade('SETUP', selectedOption, tradeId);

export const updatePatternsInTrade = (selectedOption, tradeId) => updateFieldInTrade('PATTERN', selectedOption, tradeId);

export const updateReturnInTrade = (inputValue, tradeId) => updateFieldInTrade('RETURN', inputValue, tradeId);

export const updateLotInTrade = (inputValue, tradeId) => updateFieldInTrade('LOT', inputValue, tradeId);

export const updateEntryDateInTrade = (inputValue, tradeId) => updateFieldInTrade('ENTRY_DATE', inputValue, tradeId);

export const updateExitDateInTrade = (inputValue, tradeId) => updateFieldInTrade('EXIT_DATE', inputValue, tradeId);

export const updateEntryPriceInTrade = (inputValue, tradeId) => updateFieldInTrade('ENTRY_PRICE', inputValue, tradeId);

export const updateExitPriceInTrade = (inputValue, tradeId) => updateFieldInTrade('EXIT_PRICE', inputValue, tradeId);


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
