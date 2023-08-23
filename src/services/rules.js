import { getFirestore, collection, addDoc, doc, setDoc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function addNewRule() {
    const db = getFirestore();
    const rulesCollection = collection(db, "rules");
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const newRule = {
        NAME: "",
        RULE_1: "",
        RULE_2: "",
        RULE_3: "",
        NOTES: "",
        PATTERN: "",
        SETUP: "",
        USER_ID: userId,
        ID: ""
    };

    try {
        const docRef = await addDoc(rulesCollection, newRule);
        newRule.ID = docRef.id;
        await updateDoc(docRef, { ID: docRef.id }); // IDを更新

        console.log("新しいルールが追加されました。ドキュメントID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("ルールの追加中にエラーが発生しました:", e);
        throw e; // エラーを上位の関数に伝える
    }
}

export const saveRuleUpdateToDb = async (fieldName, value, docId) => {
    const db = getFirestore();
    const ruleDoc = doc(db, "rules", docId); // 'yourDocumentId' は適切なドキュメントIDに置き換える必要があります。
 
    try {
       await setDoc(ruleDoc, { [fieldName]: value }, { merge: true });
       console.log(fieldName + "がデータベースに保存されました");
    } catch (e) {
       console.error("データベースへの保存中にエラーが発生しました", e);
    }
}

export const fetchRuleById = async (id) => {
    try {
        const docRef = doc(collection(db, "rules"), id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            return docSnapshot.data();
        } else {
            console.error("ドキュメントが存在しません");
            return null;
        }
    } catch (error) {
        console.error("ドキュメントの取得中にエラーが発生しました:", error);
        return null;
    }
}

export const updateFieldInRule = async (fieldName, inputValue, ruleId) => {
    if (inputValue === undefined) {
        console.error(`Undefined inputValue for ${fieldName} in rule ${ruleId}`);
        return;
    }

    const ruleRef = doc(getFirestore(), "rules", ruleId);
    const docSnap = await getDoc(ruleRef);
    
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
        await updateDoc(ruleRef, {
            [fieldName]: valueToUpdate  // 更新したいフィールドを指定
        });
    } else {
        // The document does not exist, create it
        await setDoc(ruleRef, {
            [fieldName]: valueToUpdate
        });
    }
};

export const updatePatternsInRule = (selectedOption, ruleId) => updateFieldInRule('PATTERN', selectedOption, ruleId);
export const updateSetupInRule = (selectedOption, ruleId) => updateFieldInRule('SETUP', selectedOption, ruleId);

export const fetchPatternByLabel = async (label, userId) => {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
            console.error("User document not found!");
            return null;
        }
        
        const patterns = userDocSnap.data().patterns;
        if (!patterns) {
            console.warn("No pattern found for the user!");
            return null;
        }
        
        const matchingPattern = patterns.find(pattern => pattern.label === label);
        return matchingPattern || null;
    } catch (error) {
        console.error("Error fetching pattern by label:", error);
        return null;
    }
};
