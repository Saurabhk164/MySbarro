import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../firebase';

// Default local images as fallback
const defaultImages = [
  '/backgrounds/default1.jpg',
  '/backgrounds/default2.jpg',
  '/backgrounds/default3.jpg',
  '/backgrounds/default4.jpg',
  '/backgrounds/default5.jpg',
];

const BackgroundSlideshow = () => {
  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([null, null]);
  const [fadeOut, setFadeOut] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usingDefaultImages, setUsingDefaultImages] = useState(false);

  // Fetch all images from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('BackgroundSlideshow: Attempting to fetch images from Firebase storage...');
        const imagesRef = ref(storage, 'images');
        const result = await listAll(imagesRef);
        console.log('BackgroundSlideshow: Firebase listAll result:', result);
        
        const imageUrls = await Promise.all(
          result.items.map(async (imageRef) => {
            try {
              const url = await getDownloadURL(imageRef);
              console.log(`BackgroundSlideshow: Retrieved URL for ${imageRef.name}`);
              return url;
            } catch (downloadError) {
              console.error(`BackgroundSlideshow: Error getting download URL for ${imageRef.name}:`, downloadError);
              return null;
            }
          })
        );
        
        // Filter out any null values from failed downloads
        const validImageUrls = imageUrls.filter(url => url !== null);
        console.log(`BackgroundSlideshow: Retrieved ${validImageUrls.length} valid image URLs`);
        
        // If we have images from Firebase, use them
        if (validImageUrls.length >= 2) {
          console.log('BackgroundSlideshow: Using Firebase images for slideshow');
          setImages(validImageUrls);
          const randomIndexes = getRandomIndexes(validImageUrls.length, 2);
          setCurrentImages([validImageUrls[randomIndexes[0]], validImageUrls[randomIndexes[1]]]);
        } else {
          // Otherwise, use default images
          console.log('BackgroundSlideshow: Using default images for slideshow as Firebase returned insufficient images');
          setImages(defaultImages);
          setUsingDefaultImages(true);
          const randomIndexes = getRandomIndexes(defaultImages.length, 2);
          setCurrentImages([defaultImages[randomIndexes[0]], defaultImages[randomIndexes[1]]]);
        }
      } catch (error) {
        console.error('BackgroundSlideshow: Error fetching images from Firebase:', error);
        // Use default images on error
        console.log('BackgroundSlideshow: Using default images for slideshow due to Firebase error');
        setImages(defaultImages);
        setUsingDefaultImages(true);
        const randomIndexes = getRandomIndexes(defaultImages.length, 2);
        setCurrentImages([defaultImages[randomIndexes[0]], defaultImages[randomIndexes[1]]]);
      }
    };
    
    fetchImages();
  }, []);
  
  // Function to get random non-repeating indexes
  const getRandomIndexes = (max, count) => {
    const indexes = [];
    while (indexes.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  };
  
  // Change images every 8 seconds
  useEffect(() => {
    if (images.length < 2) {
      console.log('BackgroundSlideshow: Not enough images to start slideshow');
      return;
    }
    
    console.log('BackgroundSlideshow: Starting slideshow interval');
    const interval = setInterval(() => {
      // Start fade out animation
      setFadeOut(true);
      
      // After animation completes, change the image
      setTimeout(() => {
        const nextIndex = (activeIndex + 1) % 2;
        const randomIndex = Math.floor(Math.random() * images.length);
        
        // Make sure we don't pick the same image that's already displayed
        let newRandomIndex = randomIndex;
        while (images[newRandomIndex] === currentImages[0] || images[newRandomIndex] === currentImages[1]) {
          newRandomIndex = Math.floor(Math.random() * images.length);
          // If we have very few images, break to avoid infinite loop
          if (images.length <= 2) break;
        }
        
        // Update the non-active image
        const newImages = [...currentImages];
        newImages[nextIndex] = images[newRandomIndex];
        setCurrentImages(newImages);
        
        // Switch active image and reset fade
        setActiveIndex(nextIndex);
        setFadeOut(false);
      }, 1000); // 1s for the fade out animation
    }, 8000); // 8s interval
    
    return () => {
      console.log('BackgroundSlideshow: Clearing slideshow interval');
      clearInterval(interval);
    };
  }, [images, currentImages, activeIndex]);
  
  if (!currentImages[0] || !currentImages[1]) {
    console.log('BackgroundSlideshow: No images available yet, not rendering');
    return null; // Don't render anything until we have images
  }
  
  return (
    <div className="background-slideshow">
      <div 
        className={`slideshow-image ${activeIndex === 0 ? 'active' : ''} ${fadeOut && activeIndex === 0 ? 'fade-out' : ''}`} 
        style={{ backgroundImage: `url(${currentImages[0]})` }}
      ></div>
      <div 
        className={`slideshow-image ${activeIndex === 1 ? 'active' : ''} ${fadeOut && activeIndex === 1 ? 'fade-out' : ''}`} 
        style={{ backgroundImage: `url(${currentImages[1]})` }}
      ></div>
    </div>
  );
};

export default BackgroundSlideshow; 