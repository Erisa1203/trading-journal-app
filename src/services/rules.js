import { getFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc, Timestamp, updateDoc, deleteDoc, serverTimestamp, where, query } from "firebase/firestore";
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
        ID: "",
        CREATED_AT: serverTimestamp()
    };

    try {
        const docRef = await addDoc(rulesCollection, newRule);
        newRule.ID = docRef.id;
        await updateDoc(docRef, { ID: docRef.id }); // IDを更新
        return docRef.id;
    } catch (e) {
        console.error("ルールの追加中にエラーが発生しました:", e);
        throw e; // エラーを上位の関数に伝える
    }
}

export const fetchRules = async (userId) => {
    const db = getFirestore();
    const rulesCollection = collection(db, "rules");
    
    // ユーザーのIDとrule.USER_IDが一致するものだけをフェッチするクエリを設定
    const userQuery = query(rulesCollection, where("USER_ID", "==", userId));
    
    const ruleSnapshot = await getDocs(userQuery);
    const ruleList = ruleSnapshot.docs.map(doc => ({ ID: doc.id, ...doc.data() }));
    
    return sortRulesByDate(ruleList); // ソート関数を使用
}


export const saveRuleUpdateToDb = async (fieldName, value, docId) => {
    const db = getFirestore();
    const ruleDoc = doc(db, "rules", docId); // 'yourDocumentId' は適切なドキュメントIDに置き換える必要があります。
 
    try {
       await setDoc(ruleDoc, { [fieldName]: value }, { merge: true });
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

export const deleteRuleById = async (id) => {
    const docRef = doc(db, 'rules', id);
    await deleteDoc(docRef);
}

// "2023年8月23日 21:52:18 UTC+9" のような形式をDateオブジェクトに変換する関数
export const parseJapaneseDate = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        console.error('parseJapaneseDate: 期待される入力がTimestampオブジェクトではありません。入力:', timestamp);
        return new Date(); // デフォルトの日付を返す
    }
    return timestamp.toDate(); // TimestampオブジェクトをJavaScriptのDateオブジェクトに変換
}

// rulesを日付順にソートする関数
export const sortRulesByDate = (rules) => {
    return rules.sort((a, b) => {
        const dateA = parseJapaneseDate(a.CREATED_AT);
        const dateB = parseJapaneseDate(b.CREATED_AT);
        return dateB - dateA; // 降順（新しい順）
    });
}
