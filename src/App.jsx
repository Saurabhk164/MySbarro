import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import TodoPage from './pages/TodoPage';
import WishlistPage from './pages/WishlistPage';
import AppreciationPage from './pages/AppreciationPage';
import ApologyPage from './pages/ApologyPage';
import DatesPage from './pages/DatesPage';
import DateGalleryPage from './pages/DateGalleryPage';
import CalendarPage from './pages/CalendarPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { UserProvider } from './contexts/UserContext';
import UserSwitcher from './components/UserSwitcher';
import PasswordProtection from './components/PasswordProtection';

function App() {
  return (
    <PasswordProtection>
      <UserProvider>
        <Router>
          <div className="App">
            <BackgroundSlideshow />
            
            <header>
              <div className="container">
                <div className="header-content">
                  <div>
                    <h1>SbarroSpace</h1>
                    <p>Our digital space for love and connection</p>
                  </div>
                  <UserSwitcher />
                </div>
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
                  <li><Link to="/calendar">Calendar</Link></li>
                  <li><Link to="/gallery">Date Gallery</Link></li>
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
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/gallery" element={<DateGalleryPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            
            <footer>
              <div className="container">
                <p>© 2025 SbarroSpace. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Router>
      </UserProvider>
    </PasswordProtection>
  );
}

export default App; 