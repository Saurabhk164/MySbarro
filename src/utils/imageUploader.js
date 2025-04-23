import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

// Uploads an image to Firebase Storage and returns the download URL
export const uploadImage = async (file, path = 'images') => {
  try {
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, `${path}/${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url,
      fullPath: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error
    };
  }
}; 