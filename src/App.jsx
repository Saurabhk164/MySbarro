import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import TodoPage from './pages/TodoPage';
import WishlistPage from './pages/WishlistPage';
import AppreciationPage from './pages/AppreciationPage';
import ApologyPage from './pages/ApologyPage';
import DatesPage from './pages/DatesPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <BackgroundSlideshow />
        
        <header>
          <div className="container">
            <h1>SbarroSpace</h1>
            <p>Our digital space for love and connection</p>
          </div>
        </header>
        
        <nav className="main-nav">
          <div className="container">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/todo">Todo</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/appreciation">Appreciation</Link></li>
              <li><Link to="/apology">Apology</Link></li>
              <li><Link to="/dates">Dates</Link></li>
            </ul>
          </div>
        </nav>
        
        <main className="container content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/appreciation" element={<AppreciationPage />} />
            <Route path="/apology" element={<ApologyPage />} />
            <Route path="/dates" element={<DatesPage />} />
          </Routes>
        </main>
        
        <footer>
          <div className="container">
            <p>© 2025 SbarroSpace. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App; 