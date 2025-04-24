import React, { useState } from 'react';
import { uploadDatePhoto } from '../utils/dateGalleryUtils';

const DatePhotoUploader = ({ dateId, dateName, onPhotoUploaded }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      const photo = await uploadDatePhoto(file, dateId, caption);
      setFile(null);
      setCaption('');
      setPreview(null);
      if (onPhotoUploaded) {
        onPhotoUploaded(photo);
      }
    } catch (error) {
      setError('Error uploading photo: ' + error.message);
      console.error('Error in photo upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-uploader">
      <h3>Add Photos to "{dateName}"</h3>
      
      <form onSubmit={handleSubmit} className="upload-form">
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="photo-file">Select Photo</label>
          <input
            type="file"
            id="photo-file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="photo-caption">Caption (Optional)</label>
          <input
            type="text"
            id="photo-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter a caption for this photo"
            disabled={uploading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="upload-btn"
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
};

export default DatePhotoUploader; 