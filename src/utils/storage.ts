// src/utils/storage.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Uploads an image from a local URI to Firebase Storage and returns the download URL.
 * @param uri The local device URI of the image
 * @param path The path/filename in Firebase Storage where the image should be saved
 */
export const uploadImageAsync = async (uri: string, path: string): Promise<string> => {
  // Convert local URI to a blob
  const response = await fetch(uri);
  const blob = await response.blob();
  
  // Create a reference to the storage location
  const storageRef = ref(storage, path);
  
  // Upload the blob
  await uploadBytes(storageRef, blob);
  
  // Get the publicly accessible download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
