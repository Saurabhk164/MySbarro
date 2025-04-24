import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useUser } from '../contexts/UserContext';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const { currentUser } = useUser();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Create a reference to the file in Firebase Storage with user-specific path
      const storageRef = ref(storage, `uploads/${currentUser}/${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);
      
      setDownloadURL(url);
      setUploading(false);
      
      console.log('File uploaded successfully. Download URL:', url);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">{currentUser}'s File Upload</h2>
      
      <div className="mb-4">
        <input 
          type="file" 
          onChange={handleFileChange}
          className="block w-full"
        />
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {uploading ? 'Uploading...' : 'Upload to Firebase'}
      </button>
      
      {downloadURL && (
        <div className="mt-4">
          <p className="mb-2 text-green-600 font-medium">File uploaded successfully!</p>
          <a 
            href={downloadURL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            View Uploaded File
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 