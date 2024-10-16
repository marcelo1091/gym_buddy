import { db } from "./utils";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UpdateDbType = {
  id: string;
  collectionName: string;
  notificationText?: string
  [x: string]: any;
}

export const updateDb = async ({ collectionName, id, data, notificationText }: UpdateDbType) => {
  const notifySucces = () => toast.success(notificationText);
  const notifyError = () => toast.error("Something whent wrong!");


  updateDoc(
    doc(db, collectionName, id ?? ""),
    data
  ).then(() => {
    notificationText && notifySucces()
  }).catch((e) => {
    notifyError()
    console.error("Error updating document: ", e);
  })

};