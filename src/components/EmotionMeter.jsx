import React, { useState, useEffect } from 'react';
import { 
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

const EmotionMeter = ({ userId = 'default' }) => {
  const [emotionValues, setEmotionValues] = useState({
    happy: 5,
    sad: 1,
    angry: 1
  });
  
  const [averages, setAverages] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [canSubmitToday, setCanSubmitToday] = useState(true);
  
  // Check if the user has already submitted today
  useEffect(() => {
    const checkTodaySubmission = async () => {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const emotionsRef = collection(db, `users/${userId}/emotions`);
      const todayQuery = query(
        emotionsRef,
        where('date', '>=', today),
        where('date', '<', tomorrow)
      );
      
      const querySnapshot = await getDocs(todayQuery);
      setCanSubmitToday(querySnapshot.empty);
      
      // If already submitted today, get the averages
      if (!querySnapshot.empty) {
        fetchAverages();
      }
    };
    
    checkTodaySubmission();
  }, [userId]);
  
  // Fetch the average emotions for the past 7 days
  const fetchAverages = async () => {
    try {
      // Get date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const emotionsRef = collection(db, `users/${userId}/emotions`);
      const recentQuery = query(
        emotionsRef,
        where('date', '>=', sevenDaysAgo),
        orderBy('date', 'desc'),
        limit(7)
      );
      
      const querySnapshot = await getDocs(recentQuery);
      
      if (querySnapshot.empty) {
        setAverages(null);
        return;
      }
      
      let totalHappy = 0;
      let totalSad = 0;
      let totalAngry = 0;
      let count = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalHappy += data.happy || 0;
        totalSad += data.sad || 0;
        totalAngry += data.angry || 0;
        count++;
      });
      
      setAverages({
        happy: (totalHappy / count).toFixed(1),
        sad: (totalSad / count).toFixed(1),
        angry: (totalAngry / count).toFixed(1)
      });
    } catch (error) {
      console.error('Error fetching emotion averages:', error);
    }
  };
  
  const handleEmotionChange = (emotion, value) => {
    setEmotionValues(prev => ({
      ...prev,
      [emotion]: value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const emotionsRef = collection(db, `users/${userId}/emotions`);
      
      await addDoc(emotionsRef, {
        ...emotionValues,
        date: new Date()
      });
      
      setIsSubmitted(true);
      setCanSubmitToday(false);
      
      // Fetch the new averages
      await fetchAverages();
    } catch (error) {
      console.error('Error submitting emotions:', error);
    }
  };
  
  return (
    <div className="emotion-meter">
      <h2>Emotion Meter</h2>
      <div className="emotion-card">
        {canSubmitToday ? (
          <>
            <p>How are you feeling today? Slide to record your emotions.</p>
            <div className="emotion-sliders">
              <div className="emotion-slider">
                <label htmlFor="happy-slider">Happy</label>
                <input
                  id="happy-slider"
                  type="range"
                  min="1"
                  max="10"
                  value={emotionValues.happy}
                  onChange={(e) => handleEmotionChange('happy', parseInt(e.target.value))}
                  className="happy-slider"
                />
                <span className="emotion-value">{emotionValues.happy}</span>
              </div>
              
              <div className="emotion-slider">
                <label htmlFor="sad-slider">Sad</label>
                <input
                  id="sad-slider"
                  type="range"
                  min="1"
                  max="10"
                  value={emotionValues.sad}
                  onChange={(e) => handleEmotionChange('sad', parseInt(e.target.value))}
                  className="sad-slider"
                />
                <span className="emotion-value">{emotionValues.sad}</span>
              </div>
              
              <div className="emotion-slider">
                <label htmlFor="angry-slider">Angry</label>
                <input
                  id="angry-slider"
                  type="range"
                  min="1"
                  max="10"
                  value={emotionValues.angry}
                  onChange={(e) => handleEmotionChange('angry', parseInt(e.target.value))}
                  className="angry-slider"
                />
                <span className="emotion-value">{emotionValues.angry}</span>
              </div>
            </div>
            
            <button 
              className="submit-emotions-btn"
              onClick={handleSubmit}
            >
              Submit Today's Emotions
            </button>
          </>
        ) : (
          <div className="submitted-message">
            <p>You've already submitted your emotions for today.</p>
            {averages && (
              <div className="emotion-averages">
                <h3>Your 7-day averages:</h3>
                <ul>
                  <li>Happy: <span className="average-happy">{averages.happy}</span></li>
                  <li>Sad: <span className="average-sad">{averages.sad}</span></li>
                  <li>Angry: <span className="average-angry">{averages.angry}</span></li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionMeter; 