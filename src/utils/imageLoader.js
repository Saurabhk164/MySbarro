import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

// Gets all images from a specific folder in Firebase Storage
export const getImagesFromFolder = async (folderPath = 'images') => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    const imageUrls = await Promise.all(
      result.items.map(async (imageRef) => {
        const url = await getDownloadURL(imageRef);
        return {
          url,
          name: imageRef.name,
          fullPath: imageRef.fullPath
        };
      })
    );
    
    return {
      success: true,
      images: imageUrls
    };
  } catch (error) {
    console.error(`Error fetching images from ${folderPath}:`, error);
    return {
      success: false,
      error,
      images: []
    };
  }
};

// Gets a random selection of images
export const getRandomImages = async (count = 2, folderPath = 'images') => {
  const result = await getImagesFromFolder(folderPath);
  
  if (!result.success || result.images.length === 0) {
    return {
      success: false,
      error: result.error || new Error('No images found'),
      images: []
    };
  }
  
  // If we don't have enough images, return what we have
  if (result.images.length <= count) {
    return {
      success: true,
      images: result.images
    };
  }
  
  // Get random images
  const selectedImages = [];
  const availableIndices = Array.from({ length: result.images.length }, (_, i) => i);
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const imageIndex = availableIndices[randomIndex];
    
    selectedImages.push(result.images[imageIndex]);
    
    // Remove the selected index so we don't pick it again
    availableIndices.splice(randomIndex, 1);
  }
  
  return {
    success: true,
    images: selectedImages
  };
}; 