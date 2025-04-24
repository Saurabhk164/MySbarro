import React from 'react';
import EmotionMeter from '../components/EmotionMeter';
import { useUser } from '../contexts/UserContext';

const HomePage = () => {
  const { currentUser } = useUser();

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Welcome to SbarroSpace, {currentUser}!</h1>
        <p>Your digital space for love, connection, and shared experiences</p>
      </div>
      
      <div className="content-section">
        <EmotionMeter userId={currentUser} />
        
        <div className="sections-overview">
          <h2>What's Inside</h2>
          <div className="sections-grid">
            <div className="section-card">
              <h3>Todo</h3>
              <p>Keep track of your tasks and goals</p>
            </div>
            
            <div className="section-card">
              <h3>Wishlist</h3>
              <p>Save items you'd love to have</p>
            </div>
            
            <div className="section-card">
              <h3>Appreciation</h3>
              <p>Express gratitude and appreciation</p>
            </div>
            
            <div className="section-card">
              <h3>Apology</h3>
              <p>Share heartfelt apologies</p>
            </div>
            
            <div className="section-card">
              <h3>Dates</h3>
              <p>Plan and remember special moments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 