import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { storage, db } from '../firebase';

/**
 * Upload a photo to a specific date folder
 * @param {File} file - The image file to upload
 * @param {string} dateId - The ID of the date
 * @param {string} caption - Optional caption for the image
 * @returns {Promise<Object>} - The uploaded photo data
 */
export const uploadDatePhoto = async (file, dateId, caption = '') => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `date-photos/${dateId}/${file.name}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Add metadata to Firestore
    const photoData = {
      dateId,
      caption,
      fileName: file.name,
      url: downloadURL,
      path: `date-photos/${dateId}/${file.name}`,
      uploadedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'photos'), photoData);
    
    return {
      id: docRef.id,
      ...photoData
    };
  } catch (error) {
    console.error('Error uploading date photo:', error);
    throw error;
  }
};

/**
 * Get all photos for a specific date
 * @param {string} dateId - The ID of the date
 * @returns {Promise<Array>} - Array of photo objects
 */
export const getDatePhotos = async (dateId) => {
  try {
    const q = query(collection(db, 'photos'), where('dateId', '==', dateId));
    const querySnapshot = await getDocs(q);
    
    const photos = [];
    querySnapshot.forEach((doc) => {
      photos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by upload time, newest first
    return photos.sort((a, b) => {
      return b.uploadedAt.toDate() - a.uploadedAt.toDate();
    });
  } catch (error) {
    console.error('Error getting date photos:', error);
    throw error;
  }
};

/**
 * Get all dates that have photos
 * @returns {Promise<Array>} - Array of unique date IDs with photos
 */
export const getDatesWithPhotos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'photos'));
    
    // Get unique date IDs
    const dateIds = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.dateId) {
        dateIds.add(data.dateId);
      }
    });
    
    return Array.from(dateIds);
  } catch (error) {
    console.error('Error getting dates with photos:', error);
    throw error;
  }
};

/**
 * Delete a photo from both storage and Firestore
 * @param {Object} photo - The photo object to delete
 * @returns {Promise<void>}
 */
export const deletePhoto = async (photo) => {
  try {
    // Delete from storage
    const storageRef = ref(storage, photo.path);
    await deleteObject(storageRef);
    
    // Delete from Firestore
    await deleteDoc(doc(db, 'photos', photo.id));
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}; 