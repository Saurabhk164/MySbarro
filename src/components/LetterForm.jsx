import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';

const LetterForm = ({ collectionName, letterType, onSuccess }) => {
  const { currentUser } = useUser();
  const recipient = currentUser === 'Saurabh' ? 'Nirupa' : 'Saurabh';
  
  const [letter, setLetter] = useState({
    title: '',
    content: '',
    from: currentUser,
    to: recipient
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLetter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!letter.title.trim() || !letter.content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, collectionName), {
        ...letter,
        from: currentUser,
        to: recipient,
        createdAt: new Date()
      });
      
      // Reset form
      setLetter({
        title: '',
        content: '',
        from: currentUser,
        to: recipient
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Error adding ${letterType} letter:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="letter-form">
      <div className="letter-recipient-info">
        <p className="from-to-info">
          <strong>From:</strong> {currentUser} <strong>To:</strong> {recipient}
        </p>
      </div>
      
      <div className="form-group">
        <label htmlFor="letter-title">Title</label>
        <input
          id="letter-title"
          type="text"
          name="title"
          value={letter.title}
          onChange={handleInputChange}
          placeholder={`${letterType} Title`}
          required
          className="letter-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="letter-content">Your Letter</label>
        <textarea
          id="letter-content"
          name="content"
          value={letter.content}
          onChange={handleInputChange}
          placeholder={`Write your ${letterType.toLowerCase()} to ${recipient} here...`}
          required
          rows={8}
          className="letter-textarea"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        className="letter-submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : `Send ${letterType} to ${recipient}`}
      </button>
    </form>
  );
};

export default LetterForm; 