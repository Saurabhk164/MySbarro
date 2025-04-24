import React, { useState } from 'react';
import { deletePhoto } from '../utils/dateGalleryUtils';

const PhotoGallery = ({ photos, onPhotoDeleted }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const handleDelete = async (photo) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      setIsDeleting(true);
      try {
        await deletePhoto(photo);
        if (onPhotoDeleted) {
          onPhotoDeleted(photo);
        }
        if (selectedPhoto && selectedPhoto.id === photo.id) {
          setSelectedPhoto(null);
        }
      } catch (error) {
        console.error('Error deleting photo:', error);
        alert('Failed to delete photo. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle click outside to close the modal
  const handleModalBackdropClick = (e) => {
    if (e.target.classList.contains('photo-modal')) {
      closeModal();
    }
  };

  return (
    <div className="photo-gallery">
      {photos.length === 0 ? (
        <div className="empty-gallery">
          <p>No photos added yet. Add your first photo above!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="gallery-item">
              <div 
                className="gallery-image" 
                onClick={() => handlePhotoClick(photo)}
                style={{ backgroundImage: `url(${photo.url})` }}
              >
                <div className="gallery-overlay">
                  <span className="view-photo">View</span>
                </div>
              </div>
              {photo.caption && (
                <div className="gallery-caption">{photo.caption}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={handleModalBackdropClick}>
          <div className="photo-modal-content">
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <img src={selectedPhoto.url} alt={selectedPhoto.caption || 'Date photo'} />
            {selectedPhoto.caption && (
              <div className="modal-caption">{selectedPhoto.caption}</div>
            )}
            <div className="modal-actions">
              <button 
                className="delete-photo-btn" 
                onClick={() => handleDelete(selectedPhoto)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery; 