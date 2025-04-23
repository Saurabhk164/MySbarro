import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a query against the "todos" collection
    const q = query(collection(db, 'todos'));
    
    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosData = [];
      querySnapshot.forEach((doc) => {
        todosData.push({
          id: doc.id,
          text: doc.data().text,
          completed: doc.data().completed
        });
      });
      
      // Sort by completion status and then by creation time (if available)
      todosData.sort((a, b) => {
        if (a.completed === b.completed) {
          return 0;
        }
        return a.completed ? 1 : -1;
      });
      
      setTodos(todosData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching todos:", error);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodo.trim()) return;
    
    try {
      // Add a new document to the "todos" collection
      await addDoc(collection(db, 'todos'), {
        text: newTodo,
        completed: false,
        createdAt: new Date()
      });
      
      setNewTodo('');
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const todoRef = doc(db, 'todos', todo.id);
      await updateDoc(todoRef, {
        completed: !todo.completed
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="todo-page">
      <div className="page-header">
        <h1>Our Shared Todo List</h1>
        <p>Keep track of our tasks, plans, and goals</p>
      </div>
      
      <div className="content-section">
        <div className="todo-container">
          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="todo-input"
            />
            <button type="submit" className="todo-add-btn">Add Task</button>
          </form>
          
          {loading ? (
            <div className="loading">Loading todos...</div>
          ) : (
            <ul className="todo-list">
              {todos.length === 0 ? (
                <li className="empty-message">No todos yet. Add your first task above!</li>
              ) : (
                todos.map((todo) => (
                  <li 
                    key={todo.id}
                    className={`todo-item ${todo.completed ? 'completed' : ''}`}
                  >
                    <div className="todo-item-content">
                      <label className="todo-checkbox">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(todo)}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span className="todo-text">{todo.text}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="todo-delete-btn"
                      title="Delete task"
                    >
                      &times;
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoPage; 