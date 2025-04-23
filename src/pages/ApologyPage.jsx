import React, { useState } from 'react';
import LetterForm from '../components/LetterForm';
import LetterList from '../components/LetterList';

const ApologyPage = () => {
  const [activeTab, setActiveTab] = useState('read'); // 'read' or 'write'
  
  const handleLetterSuccess = () => {
    // Switch to read tab after successfully submitting a letter
    setActiveTab('read');
  };
  
  return (
    <div className="apology-page">
      <div className="page-header">
        <h1>Apology Letters</h1>
        <p>Express your apologies and regrets</p>
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
                Write a letter of apology to express your regrets and move forward together.
              </p>
              <LetterForm 
                collectionName="apology" 
                letterType="Apology"
                onSuccess={handleLetterSuccess}
              />
            </div>
          ) : (
            <div className="read-section">
              <LetterList 
                collectionName="apology" 
                letterType="Apology"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApologyPage; 