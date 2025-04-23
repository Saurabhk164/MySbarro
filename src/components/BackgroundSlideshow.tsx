import React, { useEffect, useState } from 'react';

// Use placeholder images from Unsplash
const placeholderImages = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1529519195486-16945f0fb37f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1483983733810-fc4cb71a8253?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1529333166437-7cea30f76a38?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  'https://images.unsplash.com/photo-1523539693385-e5e891eb4465?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
];

interface BackgroundSlideshowProps {
  interval?: number; // in milliseconds
}

const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({ interval = 8000 }) => {
  const [visibleImages, setVisibleImages] = useState<string[]>([]);
  const [fadeOut, setFadeOut] = useState<number | null>(null);

  // Load images on component mount
  useEffect(() => {
    try {
      // Select initial images
      if (placeholderImages.length >= 2) {
        const randomIndices = getRandomIndices(placeholderImages.length, 2);
        setVisibleImages([
          placeholderImages[randomIndices[0]],
          placeholderImages[randomIndices[1]]
        ]);
      } else if (placeholderImages.length === 1) {
        setVisibleImages([placeholderImages[0]]);
      }
    } catch (error) {
      console.error('Error loading background images:', error);
    }
  }, []);

  // Set up the interval to change images
  useEffect(() => {
    if (placeholderImages.length < 2) return;

    const imageRotation = setInterval(() => {
      // Choose which image to replace (0 or 1)
      const imageToReplace = Math.round(Math.random());
      setFadeOut(imageToReplace);
      
      // After fade out, update the image
      setTimeout(() => {
        setVisibleImages(prevImages => {
          const newImages = [...prevImages];
          
          // Get a random index not currently shown
          const currentIndices = prevImages.map(img => placeholderImages.indexOf(img));
          const availableIndices = placeholderImages
            .map((_, i) => i)
            .filter(i => !currentIndices.includes(i));
          
          if (availableIndices.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            newImages[imageToReplace] = placeholderImages[availableIndices[randomIndex]];
          }
          
          return newImages;
        });
        
        // Reset fade out state
        setFadeOut(null);
      }, 1000); // 1 second for fade transition
    }, interval);

    return () => clearInterval(imageRotation);
  }, [interval]);

  // Helper to get random non-repeating indices
  const getRandomIndices = (max: number, count: number): number[] => {
    const indices: number[] = [];
    const available = Array.from({ length: max }, (_, i) => i);
    
    for (let i = 0; i < count && available.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      indices.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }
    
    return indices;
  };

  if (visibleImages.length === 0) return null;

  return (
    <div className="slideshow-container">
      {visibleImages.map((img, index) => (
        <img
          key={`${index}-${img}`}
          src={img}
          alt={`Background ${index + 1}`}
          className="slideshow-image"
          style={{ 
            opacity: fadeOut === index ? 0 : 0.5,
            zIndex: -10 + index
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundSlideshow; 