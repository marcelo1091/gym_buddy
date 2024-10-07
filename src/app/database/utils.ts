import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../firebase/clientApp";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app);
export const storage = getStorage(app);
