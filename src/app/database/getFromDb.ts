import { db } from "./utils";
import { collection, getDocs, query, where, WhereFilterOp } from "firebase/firestore";

type GetFromDbType = {
  collectionName: string;
  fieldId?: string
  comparisonType?: WhereFilterOp
  fildValue?: string | boolean | number
  secFieldId?: string
  secComparisonType?: WhereFilterOp
  secFildValue?: string | boolean | number
}

export const getFromDb = async ({ collectionName, fieldId, comparisonType, fildValue, secFieldId, secComparisonType, secFildValue }: GetFromDbType) => {
  let firestoreRef
  if (fieldId !== undefined && comparisonType !== undefined && fildValue !== undefined && secFieldId !== undefined && secComparisonType !== undefined && secFildValue !== undefined) {
    firestoreRef = query(collection(db, collectionName), where(secFieldId, secComparisonType, secFildValue), where(fieldId, comparisonType, fildValue))
  }
  else if (fieldId !== undefined && comparisonType !== undefined && fildValue !== undefined) {
    firestoreRef = query(collection(db, collectionName), where(fieldId, comparisonType, fildValue))
  } else {
    firestoreRef = collection(db, collectionName)
  }

  const querySnapshot = await getDocs(firestoreRef);
  const data = querySnapshot.docs.map((doc) => ({ data: doc.data(), id: doc.id }));
  return { data }
};