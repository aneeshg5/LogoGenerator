// ai-logo-generator/firebase/storage.ts
import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const uploadLogo = async (userId: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `logos/${userId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteLogo = async (url: string): Promise<void> => {
  const storageRef = ref(storage, url); // Assuming the URL contains the path
  await deleteObject(storageRef);
};