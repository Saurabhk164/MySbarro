import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

const BackgroundSlideshow = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [secondImageIndex, setSecondImageIndex] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storage = getStorage();
        const slideshowRef = ref(storage, 'slideshow');
        const result = await listAll(slideshowRef);
        
        const urls = await Promise.all(
          result.items.map(async (itemRef) => {
            return await getDownloadURL(itemRef);
          })
        );
        
        setImages(urls);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images: ", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setSecondImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [images]);

  // Calculate second image index to ensure it's different from first
  useEffect(() => {
    if (images.length <= 1) return;
    
    setSecondImageIndex((currentImageIndex + Math.floor(images.length / 2)) % images.length);
  }, [currentImageIndex, images.length]);

  if (loading || images.length === 0) {
    return null;
  }

  return (
    <div className="background-slideshow">
      {images.map((imageUrl, index) => (
        <div
          key={index}
          className={`slideshow-image ${index === currentImageIndex || index === secondImageIndex ? 'active' : ''}`}
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            opacity: index === currentImageIndex || index === secondImageIndex ? 0.85 : 0,
            left: index === currentImageIndex ? '0%' : index === secondImageIndex ? '50%' : '0%',
            width: '50%'
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundSlideshow; 