import { db } from "./utils";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AddToDbType = {
  id: string;
  collectionName: string;
  notificationText?: string
  [x: string]: any;
}

export const addToDb = async ({ collectionName, id, data, notificationText }: AddToDbType) => {
  const notifySucces = () => toast.success(notificationText);
  const notifyError = () => toast.error("Something whent wrong!");

  setDoc(
    doc(db, collectionName, id ?? ""),
    data
  ).then(() => {
    notificationText && notifySucces()
  }).catch((e) => {
    notifyError()
    console.error("Error adding document: ", e);
  })
};