import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../App'; // Ensure the app is initialized

const db = getFirestore(app);

export const addDataToFirestore = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
