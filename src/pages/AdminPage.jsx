import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import ImageDebug from '../components/ImageDebug';

const AdminPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array
      const filesArray = Array.from(e.target.files);
      setFile(filesArray);
    }
  };

  const handleUpload = async () => {
    if (!file || file.length === 0) {
      setMessage({ type: 'error', text: 'Please select files to upload' });
      return;
    }
    
    setUploading(true);
    setMessage(null);
    const newUploadedImages = [];
    
    try {
      for (let i = 0; i < file.length; i++) {
        const currentFile = file[i];
        // Create a reference to the file in Firebase Storage - specifically in the 'images' folder
        const storageRef = ref(storage, `images/${currentFile.name}`);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, currentFile);
        
        // Get the download URL
        const url = await getDownloadURL(snapshot.ref);
        
        newUploadedImages.push({
          name: currentFile.name,
          url: url
        });
      }
      
      setUploadedImages([...uploadedImages, ...newUploadedImages]);
      setMessage({ 
        type: 'success', 
        text: `Successfully uploaded ${file.length} image${file.length > 1 ? 's' : ''} to the slideshow folder` 
      });
      
      // Reset file selection
      setFile(null);
      // Reset file input by accessing the DOM
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setMessage({ type: 'error', text: `Error uploading: ${error.message}` });
    }
    
    setUploading(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Slideshow Admin</h1>
        <p>Upload and manage slideshow background images</p>
      </div>
      
      <div className="content-section">
        <div className="upload-container">
          <h2>Upload Images for Slideshow</h2>
          <p>Select images to upload to the background slideshow.</p>
          
          <div className="upload-form">
            <div className="form-group">
              <label htmlFor="file-input">Select Image Files:</label>
              <input 
                id="file-input"
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFileChange}
                className="file-input"
              />
              <p className="form-hint">You can select multiple images at once</p>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="upload-btn"
            >
              {uploading ? 'Uploading...' : 'Upload to Slideshow'}
            </button>
            
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
          
          {uploadedImages.length > 0 && (
            <div className="uploaded-images">
              <h3>Recently Uploaded Images</h3>
              <div className="image-grid">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.url} alt={image.name} />
                    <p>{image.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <ImageDebug />
      </div>
      
      <style jsx>{`
        .admin-page {
          margin-bottom: 40px;
        }
        
        .upload-container {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        
        .upload-form {
          margin: 20px 0;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        
        .form-hint {
          font-size: 0.85rem;
          color: #666;
          margin-top: 4px;
        }
        
        .file-input {
          padding: 10px;
          border: 1px dashed #ccc;
          border-radius: 4px;
          background-color: #fff;
        }
        
        .upload-btn {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .upload-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .message {
          margin-top: 20px;
          padding: 10px 15px;
          border-radius: 4px;
        }
        
        .message.success {
          background-color: #e6ffea;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }
        
        .message.error {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ef9a9a;
        }
        
        .uploaded-images {
          margin-top: 30px;
        }
        
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .image-item {
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 10px;
          text-align: center;
        }
        
        .image-item img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 2px;
          margin-bottom: 8px;
        }
        
        .image-item p {
          font-size: 0.8rem;
          color: #666;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
};

export default AdminPage; 