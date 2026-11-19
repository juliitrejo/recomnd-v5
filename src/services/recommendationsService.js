import { db } from "../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const COLLECTION_NAME = "recommendations";

export const saveRecommendation = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la recomendación: ", error);
    throw error;
  }
};

export const getRecommendations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const items = [];
    querySnapshot.forEach((document) => {
      items.push({ id: document.id, ...document.data() });
    });
    return items;
  } catch (error) {
    console.error("Error al obtener las recomendaciones: ", error);
    return [];
  }
};

export const deleteRecommendation = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error al eliminar: ", error);
    throw error;
  }
};

export const updateRecommendationStatus = async (id, watched) => {
  const recRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(recRef, { watched });
};