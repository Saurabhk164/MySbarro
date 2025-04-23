import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { storage } from '../firebase';

const ImageDebug = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        console.log('Attempting to fetch images from Firebase storage...');
        
        const imagesRef = ref(storage, 'images');
        const result = await listAll(imagesRef);
        console.log('Firebase listAll result:', result);
        
        if (result.items.length === 0) {
          console.log('No images found in Firebase storage.');
          setError('No images found in the "images" folder. Please upload some images.');
        } else {
          console.log(`Found ${result.items.length} images in Firebase storage.`);
          
          const imageUrls = await Promise.all(
            result.items.map(async (imageRef) => {
              try {
                const url = await getDownloadURL(imageRef);
                return {
                  name: imageRef.name,
                  url: url
                };
              } catch (err) {
                console.error(`Error getting download URL for ${imageRef.name}:`, err);
                return {
                  name: imageRef.name,
                  url: null,
                  error: err.message
                };
              }
            })
          );
          
          setImages(imageUrls);
          console.log('Processed image URLs:', imageUrls);
        }
      } catch (err) {
        console.error('Error fetching images from Firebase:', err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  return (
    <div className="image-debug">
      <h2>Firebase Storage Image Debug</h2>
      
      {loading ? (
        <p>Loading images from Firebase Storage...</p>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <p>Make sure you have:</p>
          <ol>
            <li>Created a folder named "images" in Firebase Storage</li>
            <li>Uploaded image files to that folder</li>
            <li>Set appropriate security rules to allow read access</li>
          </ol>
        </div>
      ) : (
        <div>
          <p>Found {images.length} images in Firebase Storage:</p>
          <ul className="image-list">
            {images.map((image, index) => (
              <li key={index} className="image-item">
                {image.url ? (
                  <>
                    <p><strong>{image.name}</strong></p>
                    <div className="image-preview">
                      <img src={image.url} alt={image.name} />
                    </div>
                    <p className="image-url">URL: {image.url}</p>
                  </>
                ) : (
                  <>
                    <p><strong>{image.name}</strong></p>
                    <p className="error">Error: {image.error}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <style jsx>{`
        .image-debug {
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        
        .error {
          color: red;
          background-color: #ffeeee;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
        
        .image-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .image-item {
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 10px;
        }
        
        .image-preview {
          margin: 10px 0;
        }
        
        .image-preview img {
          max-width: 100%;
          max-height: 150px;
          object-fit: contain;
        }
        
        .image-url {
          font-size: 0.8rem;
          word-break: break-all;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ImageDebug; 