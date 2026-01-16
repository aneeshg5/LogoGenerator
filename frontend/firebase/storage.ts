// ai-logo-generator/firebase/storage.ts
import { storage } from "./config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Upload a file to Firebase Storage
export const uploadLogo = async (userId: string, file: File): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `logo_${timestamp}.png`;
  const storageRef = ref(storage, `logos/${userId}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Upload a logo from a URL (for generated images)
export const uploadLogoFromUrl = async (userId: string, imageUrl: string, logoName: string): Promise<string> => {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    const timestamp = Date.now();
    const sanitizedName = logoName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileName = `${sanitizedName}_${timestamp}.png`;
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `logos/${userId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading logo from URL:', error);
    throw new Error('Failed to upload logo to storage');
  }
};

// Delete a logo from Firebase Storage
export const deleteLogo = async (url: string): Promise<void> => {
  try {
    // Extract the path from the Firebase URL
    const urlParts = url.split('/');
    const pathIndex = urlParts.findIndex(part => part === 'o') + 1;
    if (pathIndex === 0) throw new Error('Invalid Firebase URL');
    
    const encodedPath = urlParts[pathIndex].split('?')[0];
    const path = decodeURIComponent(encodedPath);
    
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting logo from storage:', error);
    throw new Error('Failed to delete logo from storage');
  }
};