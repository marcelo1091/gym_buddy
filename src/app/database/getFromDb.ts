import { db } from "./utils";
import { collection, getDocs, query, where, WhereFilterOp } from "firebase/firestore";

type GetFromDbType = {
  collectionName: string;
  fieldId?: string
  comparisonType?: WhereFilterOp
  fildValue?: string | number
}

export const getFromDb = async ({ collectionName, fieldId, comparisonType, fildValue }: GetFromDbType) => {
  let firestoreRef
  if (fieldId !== undefined && comparisonType !== undefined && fildValue !== undefined) {
    firestoreRef = query(collection(db, collectionName), where(fieldId, comparisonType, fildValue))
  } else {
    firestoreRef = collection(db, collectionName)
  }

  const querySnapshot = await getDocs(firestoreRef);
  const data = querySnapshot.docs.map((doc) => ({ data: doc.data(), id: doc.id }));
  return { data }
};