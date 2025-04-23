import React from 'react';
import './App.css';
import TodoList from './components/TodoList';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="App">
      <header>
        <div className="container">
          <h1>SbarroSpace</h1>
          <p>Your React application with Firebase integration</p>
        </div>
      </header>
      
      <main className="container">
        <div className="grid-container">
          <TodoList />
          <FileUpload />
        </div>
      </main>
      
      <footer>
        <div className="container">
          <p>© 2025 SbarroSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 