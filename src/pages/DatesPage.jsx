import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

const DatesPage = () => {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState({
    name: '',
    location: '',
    date: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Create a query against the "dates" collection
    const q = query(collection(db, 'dates'));
    
    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const datesData = [];
      querySnapshot.forEach((doc) => {
        datesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by date (closest first)
      datesData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
      
      setDates(datesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching dates:", error);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (editMode && selectedDate) {
      setSelectedDate(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewDate(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddDate = async (e) => {
    e.preventDefault();
    
    if (!newDate.name.trim() || !newDate.location.trim() || !newDate.date) return;
    
    try {
      // Add a new document to the "dates" collection
      await addDoc(collection(db, 'dates'), {
        ...newDate,
        createdAt: new Date()
      });
      
      // Reset form
      setNewDate({
        name: '',
        location: '',
        date: '',
        notes: ''
      });
    } catch (error) {
      console.error("Error adding date plan:", error);
    }
  };

  const handleEditDate = async (e) => {
    e.preventDefault();
    
    if (!selectedDate.name.trim() || !selectedDate.location.trim() || !selectedDate.date) return;
    
    try {
      // Update document in the "dates" collection
      await updateDoc(doc(db, 'dates', selectedDate.id), {
        name: selectedDate.name,
        location: selectedDate.location,
        date: selectedDate.date,
        notes: selectedDate.notes
      });
      
      // Exit edit mode
      setEditMode(false);
      setSelectedDate(null);
    } catch (error) {
      console.error("Error updating date plan:", error);
    }
  };

  const handleDeleteDate = async (id) => {
    try {
      await deleteDoc(doc(db, 'dates', id));
      
      // Close detail view if the deleted date was selected
      if (selectedDate && selectedDate.id === id) {
        setSelectedDate(null);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error deleting date plan:", error);
    }
  };

  const handleEditClick = (date) => {
    setSelectedDate(date);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedDate(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const isUpcoming = (dateString) => {
    const now = new Date();
    const dateObj = new Date(dateString);
    return dateObj >= now;
  };

  return (
    <div className="dates-page">
      <div className="page-header">
        <h1>Date Planner</h1>
        <p>Plan your special time together</p>
      </div>
      
      <div className="content-section">
        <div className="dates-container">
          <div className="form-container">
            <h2>{editMode ? 'Edit Date Plan' : 'Add a New Date Plan'}</h2>
            <form onSubmit={editMode ? handleEditDate : handleAddDate} className="date-form">
              <div className="form-group">
                <label htmlFor="date-name">Date Name</label>
                <input
                  id="date-name"
                  type="text"
                  name="name"
                  value={editMode ? selectedDate.name : newDate.name}
                  onChange={handleInputChange}
                  placeholder="Movie Night, Dinner at Italian Restaurant, etc."
                  required
                  className="date-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date-location">Location</label>
                <input
                  id="date-location"
                  type="text"
                  name="location"
                  value={editMode ? selectedDate.location : newDate.location}
                  onChange={handleInputChange}
                  placeholder="Restaurant name, park, etc."
                  required
                  className="date-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date-date">Date</label>
                <input
                  id="date-date"
                  type="date"
                  name="date"
                  value={editMode ? selectedDate.date : newDate.date}
                  onChange={handleInputChange}
                  required
                  className="date-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date-notes">Notes (Optional)</label>
                <textarea
                  id="date-notes"
                  name="notes"
                  value={editMode ? selectedDate.notes : newDate.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or ideas..."
                  rows={3}
                  className="date-textarea"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="date-submit-btn"
                >
                  {editMode ? 'Update Date' : 'Add Date'}
                </button>
                
                {editMode && (
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="date-cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="dates-list-container">
            <h2>Your Date Plans</h2>
            
            {loading ? (
              <div className="loading">Loading date plans...</div>
            ) : dates.length === 0 ? (
              <div className="empty-message">No date plans yet. Add your first one!</div>
            ) : (
              <div className="dates-sections">
                {/* Upcoming Dates */}
                <div className="dates-section">
                  <h3>Upcoming Dates</h3>
                  <div className="dates-list">
                    {dates.filter(date => isUpcoming(date.date)).length === 0 ? (
                      <div className="empty-section-message">No upcoming dates. Plan something special!</div>
                    ) : (
                      dates.filter(date => isUpcoming(date.date)).map(date => (
                        <div key={date.id} className="date-card">
                          <div className="date-card-header">
                            <h4>{date.name}</h4>
                            <div className="date-actions">
                              <button 
                                onClick={() => handleEditClick(date)}
                                className="date-edit-btn"
                                title="Edit date"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteDate(date.id)}
                                className="date-delete-btn"
                                title="Delete date"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="date-info">
                            <div className="date-when">{formatDate(date.date)}</div>
                            <div className="date-where">📍 {date.location}</div>
                            {date.notes && <div className="date-notes">📝 {date.notes}</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Past Dates */}
                <div className="dates-section past-dates">
                  <h3>Past Dates</h3>
                  <div className="dates-list">
                    {dates.filter(date => !isUpcoming(date.date)).length === 0 ? (
                      <div className="empty-section-message">No past dates yet.</div>
                    ) : (
                      dates.filter(date => !isUpcoming(date.date)).map(date => (
                        <div key={date.id} className="date-card past">
                          <div className="date-card-header">
                            <h4>{date.name}</h4>
                            <div className="date-actions">
                              <button 
                                onClick={() => handleDeleteDate(date.id)}
                                className="date-delete-btn"
                                title="Delete date"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="date-info">
                            <div className="date-when">{formatDate(date.date)}</div>
                            <div className="date-where">📍 {date.location}</div>
                            {date.notes && <div className="date-notes">📝 {date.notes}</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatesPage; 