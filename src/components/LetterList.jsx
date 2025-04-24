import React, { useState, useEffect } from 'react';
import { query, collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const LetterList = ({ collectionName, letterType }) => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState(null);
  
  useEffect(() => {
    // Create a query against the collection
    const q = query(collection(db, collectionName));
    
    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const letterData = [];
      querySnapshot.forEach((doc) => {
        letterData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
        });
      });
      
      // Sort by date (newest first)
      letterData.sort((a, b) => b.createdAt - a.createdAt);
      
      setLetters(letterData);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching ${letterType} letters:`, error);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, letterType]);
  
  const handleDeleteLetter = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      
      // Close detail view if the deleted letter was selected
      if (selectedLetter && selectedLetter.id === id) {
        setSelectedLetter(null);
      }
    } catch (error) {
      console.error(`Error deleting ${letterType} letter:`, error);
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <div className="loading">Loading letters...</div>;
  }
  
  if (letters.length === 0) {
    return (
      <div className="empty-message">
        No {letterType.toLowerCase()} letters yet. Write one to show your feelings!
      </div>
    );
  }
  
  return (
    <div className="letter-container">
      <div className="letter-list">
        {letters.map(letter => (
          <div 
            key={letter.id}
            className={`letter-item ${selectedLetter && selectedLetter.id === letter.id ? 'selected' : ''}`}
            onClick={() => setSelectedLetter(letter)}
          >
            <h3 className="letter-title">{letter.title}</h3>
            <div className="letter-date">{formatDate(letter.createdAt)}</div>
            <div className="letter-correspondence">
              <span className="letter-from">From: {letter.fromName || 'Anonymous'}</span>
              <span className="letter-to">To: {letter.toName || 'Anonymous'}</span>
            </div>
            <div className="letter-preview">
              {letter.content.length > 100
                ? `${letter.content.slice(0, 100)}...`
                : letter.content
              }
            </div>
          </div>
        ))}
      </div>
      
      {selectedLetter && (
        <div className="letter-detail">
          <div className="letter-detail-header">
            <h3>{selectedLetter.title}</h3>
            <div className="letter-detail-date">{formatDate(selectedLetter.createdAt)}</div>
            <div className="letter-detail-correspondence">
              <div className="letter-detail-from">From: {selectedLetter.fromName || 'Anonymous'}</div>
              <div className="letter-detail-to">To: {selectedLetter.toName || 'Anonymous'}</div>
            </div>
          </div>
          <div className="letter-detail-content">
            {selectedLetter.content.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="letter-detail-actions">
            <button 
              className="letter-delete-btn"
              onClick={() => handleDeleteLetter(selectedLetter.id)}
            >
              Delete Letter
            </button>
            <button 
              className="letter-close-btn"
              onClick={() => setSelectedLetter(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterList; 