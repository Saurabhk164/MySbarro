import React, { useState } from 'react';
import { uploadBackgroundImage } from '../utils/uploadBackground';

const BackgroundUploader = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      setSuccessMessage('');
      
      const downloadURL = await uploadBackgroundImage(file);
      
      setSuccessMessage('Background image uploaded successfully!');
      setFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('background-file-input');
      if (fileInput) fileInput.value = '';
      
      // Alert the user that they need to refresh to see the new background
      setTimeout(() => {
        setSuccessMessage('Background image uploaded. Refresh the page to see new backgrounds in the rotation.');
      }, 2000);
      
    } catch (error) {
      setError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="background-uploader">
      <h3 className="text-lg font-medium mb-2">Upload Background Image</h3>
      
      <form onSubmit={handleUpload} className="flex flex-col space-y-3">
        <input
          type="file"
          id="background-file-input"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
          disabled={isUploading}
        />
        
        <button
          type="submit"
          disabled={isUploading || !file}
          className={`bg-blue-600 text-white py-2 px-4 rounded ${
            isUploading || !file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Background'}
        </button>
        
        {error && <div className="text-red-500">{error}</div>}
        {successMessage && <div className="text-green-500">{successMessage}</div>}
      </form>
    </div>
  );
};

export default BackgroundUploader; 