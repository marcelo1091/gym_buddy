import { db } from "./utils";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type RemoveFromDbType = {
  id: string;
  collectionName: string;
  notificationText?: string
  [x: string]: any;
}

export const removeFromDb = async ({ collectionName, id, data, notificationText }: RemoveFromDbType) => {
  const notifySucces = () => toast.success(notificationText);
  const notifyError = () => toast.error("Something whent wrong!");

  try {
    await deleteDoc(
      doc(db, collectionName, id ?? "")
    );
    if (data) {
      notificationText && notifySucces()
      return true
    } else {
      return false
    }
  } catch (e) {
    notifyError()
    console.error("Error removing document: ", e);
  }
};