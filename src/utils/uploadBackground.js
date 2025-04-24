import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Uploads a background image to Firebase Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadBackgroundImage = async (file) => {
  try {
    // Validate file type
    if (!file.type.match('image.*')) {
      throw new Error('Only image files are allowed');
    }
    
    // Create a unique filename with timestamp
    const fileName = `background_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `images/${fileName}`);
    
    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Image uploaded successfully:', snapshot);
    
    // Get the download URL for the file
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading background image:', error);
    throw error;
  }
}; 