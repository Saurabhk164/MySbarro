import React, { useState } from 'react';
import LetterForm from '../components/LetterForm';
import LetterList from '../components/LetterList';

const AppreciationPage = () => {
  const [activeTab, setActiveTab] = useState('read'); // 'read' or 'write'
  
  const handleLetterSuccess = () => {
    // Switch to read tab after successfully submitting a letter
    setActiveTab('read');
  };
  
  return (
    <div className="appreciation-page">
      <div className="page-header">
        <h1>Appreciation Letters</h1>
        <p>Express your gratitude and appreciation</p>
      </div>
      
      <div className="content-section">
        <div className="letter-tabs">
          <button 
            className={`tab-btn ${activeTab === 'read' ? 'active' : ''}`}
            onClick={() => setActiveTab('read')}
          >
            Read Letters
          </button>
          <button 
            className={`tab-btn ${activeTab === 'write' ? 'active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            Write a Letter
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'write' ? (
            <div className="write-section">
              <p className="section-desc">
                Write a letter of appreciation to express your gratitude for something special.
              </p>
              <LetterForm 
                collectionName="appreciation" 
                letterType="Appreciation"
                onSuccess={handleLetterSuccess}
              />
            </div>
          ) : (
            <div className="read-section">
              <LetterList 
                collectionName="appreciation" 
                letterType="Appreciation"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppreciationPage; 