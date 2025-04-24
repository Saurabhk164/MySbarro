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
import { useUser } from '../contexts/UserContext';

const PRIORITY_LABELS = {
  1: 'Low',
  2: 'Medium',
  3: 'High'
};

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    link: '',
    priority: 2
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();

  useEffect(() => {
    // Create a query against the "wishlist" collection for the current user
    const q = query(
      collection(db, 'wishlist'),
      where("user", "==", currentUser)
    );
    
    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by priority (high to low)
      items.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      
      setWishlistItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching wishlist items:", error);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) : value
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItem.name.trim()) return;
    
    try {
      // Add a new document to the "wishlist" collection
      await addDoc(collection(db, 'wishlist'), {
        ...newItem,
        user: currentUser,
        createdAt: new Date()
      });
      
      // Reset form
      setNewItem({
        name: '',
        link: '',
        priority: 2
      });
    } catch (error) {
      console.error("Error adding wishlist item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'wishlist', id));
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
    }
  };

  return (
    <div className="wishlist-page">
      <div className="page-header">
        <h1>{currentUser}'s Wishlist</h1>
        <p>Items {currentUser} would love to have someday</p>
      </div>
      
      <div className="content-section">
        <div className="wishlist-container">
          <form onSubmit={handleAddItem} className="wishlist-form">
            <div className="form-group">
              <label htmlFor="item-name">Item Name</label>
              <input
                id="item-name"
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="What would you like?"
                required
                className="wishlist-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="item-link">Link (Optional)</label>
              <input
                id="item-link"
                type="url"
                name="link"
                value={newItem.link}
                onChange={handleInputChange}
                placeholder="https://example.com/product"
                className="wishlist-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="item-priority">Priority</label>
              <select
                id="item-priority"
                name="priority"
                value={newItem.priority}
                onChange={handleInputChange}
                className="wishlist-select"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
            </div>
            
            <button type="submit" className="wishlist-add-btn">Add to Wishlist</button>
          </form>
          
          {loading ? (
            <div className="loading">Loading wishlist...</div>
          ) : (
            <div className="wishlist-items">
              {wishlistItems.length === 0 ? (
                <div className="empty-message">Your wishlist is empty. Add items above!</div>
              ) : (
                wishlistItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`wishlist-item priority-${item.priority}`}
                  >
                    <div className="wishlist-item-content">
                      <h3 className="item-name">{item.name}</h3>
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="item-link"
                        >
                          View Item
                        </a>
                      )}
                      <div className="item-priority">
                        Priority: <span className="priority-label">{PRIORITY_LABELS[item.priority] || 'Medium'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="wishlist-delete-btn"
                      title="Delete item"
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage; 