export const fetchUserSetup = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.flatMap(doc => doc.data().setup);
    
    return userList;
}
