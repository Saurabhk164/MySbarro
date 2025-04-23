import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../firebase';

const BackgroundSlideshow = () => {
  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([null, null]);
  const [fadeOut, setFadeOut] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch all images from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, 'images');
        const result = await listAll(imagesRef);
        
        const imageUrls = await Promise.all(
          result.items.map(async (imageRef) => {
            const url = await getDownloadURL(imageRef);
            return url;
          })
        );
        
        setImages(imageUrls);
        
        // Set initial random images if we have at least 2
        if (imageUrls.length >= 2) {
          const randomIndexes = getRandomIndexes(imageUrls.length, 2);
          setCurrentImages([imageUrls[randomIndexes[0]], imageUrls[randomIndexes[1]]]);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
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
    if (images.length < 2) return;
    
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
    
    return () => clearInterval(interval);
  }, [images, currentImages, activeIndex]);
  
  if (!currentImages[0] || !currentImages[1]) {
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