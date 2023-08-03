import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function subscribeToTradeJournal(callback) {
    const journalRef = collection(db, "journal");
  
    return onSnapshot(journalRef, (snapshot) => {
      const trades = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
  
      callback(trades);
    });
  }
  
export const addTrade = async (trade) => {
    const journalCol = collection(db, "journal");
    const docRef = await addDoc(journalCol, trade);
    return docRef.id;
};

