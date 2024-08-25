import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "../config/firebase-config";

const db = getFirestore(app);

export const addDataToFirestore = async (
  collectionName: string,
  data: unknown
) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const fetchDataFromFirestore = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched data: ", data);
    return data;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return [];
  }
};
