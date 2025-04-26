import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot,
  doc,
  deleteDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase';

const CalendarPage = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    location: '',
    notes: ''
  });

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
      
      setDates(datesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching dates:", error);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    setShowEventForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    if (!newEvent.name.trim() || !newEvent.location.trim()) return;
    
    try {
      // Format the date to ISO string (YYYY-MM-DD)
      const dateString = selectedDate.toISOString().split('T')[0];
      
      // Add a new document to the "dates" collection
      await addDoc(collection(db, 'dates'), {
        ...newEvent,
        date: dateString,
        createdAt: new Date()
      });
      
      // Reset form
      setNewEvent({
        name: '',
        location: '',
        notes: ''
      });
      setShowEventForm(false);
    } catch (error) {
      console.error("Error adding date:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, 'dates', id));
    } catch (error) {
      console.error("Error deleting date:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Check if there are any events on this day
      const dayEvents = dates.filter(event => event.date === dateString);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${dayEvents.length > 0 ? 'has-events' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          {dayEvents.length > 0 && (
            <div className="day-events-indicator">
              {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const renderEventsForSelectedDate = () => {
    if (!selectedDate) return null;
    
    const dateString = selectedDate.toISOString().split('T')[0];
    const dayEvents = dates.filter(event => event.date === dateString);
    
    if (dayEvents.length === 0) {
      return <p>No events scheduled for this day.</p>;
    }
    
    return (
      <div className="selected-date-events">
        {dayEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-card-header">
              <h4>{event.name}</h4>
              <button 
                onClick={() => handleDeleteEvent(event.id)}
                className="event-delete-btn"
                title="Delete event"
              >
                Delete
              </button>
            </div>
            <div className="event-info">
              <div className="event-where">📍 {event.location}</div>
              {event.notes && <div className="event-notes">📝 {event.notes}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Calendar</h1>
        <p>View and plan dates on a calendar</p>
      </div>
      
      <div className="content-section">
        {loading ? (
          <div className="loading">Loading calendar...</div>
        ) : (
          <div className="calendar-container">
            <div className="calendar-header">
              <button onClick={handlePrevMonth} className="month-nav-btn">&lt;</button>
              <h2>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={handleNextMonth} className="month-nav-btn">&gt;</button>
            </div>
            
            <div className="calendar-weekdays">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            
            <div className="calendar-grid">
              {renderCalendarDays()}
            </div>
            
            {selectedDate && (
              <div className="selected-date-container">
                <h3>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                
                {renderEventsForSelectedDate()}
                
                {showEventForm ? (
                  <div className="event-form-container">
                    <h4>Add New Event</h4>
                    <form onSubmit={handleAddEvent} className="event-form">
                      <div className="form-group">
                        <label htmlFor="event-name">Event Name</label>
                        <input
                          id="event-name"
                          type="text"
                          name="name"
                          value={newEvent.name}
                          onChange={handleInputChange}
                          placeholder="Movie Night, Dinner, etc."
                          required
                          className="event-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="event-location">Location</label>
                        <input
                          id="event-location"
                          type="text"
                          name="location"
                          value={newEvent.location}
                          onChange={handleInputChange}
                          placeholder="Restaurant name, park, etc."
                          required
                          className="event-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="event-notes">Notes (Optional)</label>
                        <textarea
                          id="event-notes"
                          name="notes"
                          value={newEvent.notes}
                          onChange={handleInputChange}
                          placeholder="Any special instructions or ideas..."
                          rows={3}
                          className="event-textarea"
                        ></textarea>
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="submit" 
                          className="event-submit-btn"
                        >
                          Add Event
                        </button>
                        
                        <button 
                          type="button"
                          onClick={() => setShowEventForm(false)}
                          className="event-cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowEventForm(true)}
                    className="add-event-btn"
                  >
                    Add Event
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage; 