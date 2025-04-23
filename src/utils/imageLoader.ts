/**
 * This file helps load images from the images folder.
 * Since we're having issues with require.context, we'll use a different approach.
 */

// Import some placeholder images from the public folder to use as defaults
// In a production app, you would want to place your images in the public folder
// and reference them correctly

// Define an array of image paths using the correct public URL format
const imagePaths = [
  // Use the process.env.PUBLIC_URL to ensure the correct path in both development and production
  `${process.env.PUBLIC_URL}/couple1.jpg`,
  `${process.env.PUBLIC_URL}/couple2.jpg`,
  `${process.env.PUBLIC_URL}/couple3.jpg`,
  `${process.env.PUBLIC_URL}/couple4.jpg`,
  `${process.env.PUBLIC_URL}/couple5.jpg`
];

/**
 * Gets a list of all available image paths
 */
export const getAllImagePaths = (): string[] => {
  return imagePaths;
};

/**
 * Gets a random image path from the list
 */
export const getRandomImagePath = (): string => {
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
};

/**
 * Gets n random image paths without duplicates
 */
export const getRandomImagePaths = (count: number): string[] => {
  const shuffled = [...imagePaths].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}; 