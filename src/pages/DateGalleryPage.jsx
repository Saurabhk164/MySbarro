import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import DatePhotoUploader from '../components/DatePhotoUploader';
import PhotoGallery from '../components/PhotoGallery';
import { getDatePhotos } from '../utils/dateGalleryUtils';

const DateGalleryPage = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Fetch all dates
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const q = query(collection(db, 'dates'));
        const querySnapshot = await getDocs(q);
        
        const datesData = [];
        querySnapshot.forEach((doc) => {
          datesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort by date (newest first)
        datesData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
        
        setDates(datesData);
      } catch (error) {
        console.error('Error fetching dates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDates();
  }, []);

  // Fetch photos for selected date
  useEffect(() => {
    if (selectedDate) {
      fetchPhotosForDate(selectedDate.id);
    } else {
      setPhotos([]);
    }
  }, [selectedDate]);

  const fetchPhotosForDate = async (dateId) => {
    setPhotoLoading(true);
    try {
      const photosList = await getDatePhotos(dateId);
      setPhotos(photosList);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleDateSelect = async (dateId) => {
    if (dateId === 'none') {
      setSelectedDate(null);
      return;
    }
    
    try {
      const dateDoc = await getDoc(doc(db, 'dates', dateId));
      if (dateDoc.exists()) {
        setSelectedDate({
          id: dateDoc.id,
          ...dateDoc.data()
        });
      }
    } catch (error) {
      console.error('Error fetching date details:', error);
    }
  };

  const handlePhotoUploaded = (newPhoto) => {
    setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
  };

  const handlePhotoDeleted = (deletedPhoto) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== deletedPhoto.id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="date-gallery-page">
      <div className="page-header">
        <h1>Date Photo Gallery</h1>
        <p>Capture and cherish your special moments together</p>
      </div>
      
      <div className="content-section">
        <div className="gallery-container">
          {/* Date Selection */}
          <div className="date-selector">
            <label htmlFor="date-select">Select a Date</label>
            <select 
              id="date-select"
              onChange={(e) => handleDateSelect(e.target.value)}
              value={selectedDate ? selectedDate.id : 'none'}
            >
              <option value="none">-- Select a Date --</option>
              {dates.map(date => (
                <option key={date.id} value={date.id}>
                  {date.name} - {formatDate(date.date)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Selected Date Details & Upload */}
          {selectedDate ? (
            <div className="selected-date">
              <div className="date-header">
                <h2>{selectedDate.name}</h2>
                <div className="date-details">
                  <span className="date-date">{formatDate(selectedDate.date)}</span>
                  <span className="date-location">📍 {selectedDate.location}</span>
                </div>
                {selectedDate.notes && (
                  <div className="date-notes">
                    <p>{selectedDate.notes}</p>
                  </div>
                )}
              </div>
              
              <DatePhotoUploader 
                dateId={selectedDate.id} 
                dateName={selectedDate.name}
                onPhotoUploaded={handlePhotoUploaded}
              />
              
              <div className="gallery-section">
                <h3>Photos</h3>
                {photoLoading ? (
                  <div className="loading">Loading photos...</div>
                ) : (
                  <PhotoGallery 
                    photos={photos}
                    onPhotoDeleted={handlePhotoDeleted}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="no-date-selected">
              <p>Select a date from the dropdown to view or add photos.</p>
              {loading ? (
                <div className="loading">Loading dates...</div>
              ) : dates.length === 0 ? (
                <div className="no-dates">
                  <p>No dates found. Add dates in the Date Planner section first.</p>
                  <a href="/dates" className="add-date-link">Go to Date Planner</a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateGalleryPage; 