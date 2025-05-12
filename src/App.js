import React, { useState, useEffect } from 'react';
import './App.css';

const todoItems = [
  "Video Update - Keep Indu logo on white background and add info from 0:06 seconds",
  "Video Update - Remove content from 0:24 to 0:28 seconds",
  "Video Update - Change warehouse walls from grey to white at 0:54",
  "Video Update - Change door color from yellow to lighter grey than door frame at 01:10 and 02:08",
  "Video Update - Grammar Correction: Replace with 'Additional security Check Point on entry to the warehouse' at 01:12",
  "Video Update - Grammar Correction: Change comma to full stop after 'Empty warehouse' at 01:32",
  "Video Update - Add door opening animation showing outdoor view from 01:35 to 01:38",
  "Video Update - Add panning shot across front of racks and VNA machine movement at 01:43",
  "Video Update - Grammar Correction: Change comma to full stop after 'Facility supports G+10 levels' and capitalize 'Full' at 01:44",
  "Video Update - Grammar Correction: Replace with 'Security Check Point on warehouse exit' at 02:10",
  "Video Update - Add full stop after 'space' at 02:16",
  "Video Update - Add text 'Warehouse Gates Open Q3 2025' at 02:31",
  "Video Update - Replace all instances of '22m' with '24m' throughout the video",
  "Video Update - Change Inbound/Outbound loading doors to match Battery Charging Doors color scheme",
  "Video Update - Make window panes on shutter doors more obvious and clear",
  "Video Update - Update text box styling with blue border, white background, and black text",
  "Video Update - Change in-video text font to 'Aptos (body)'",
  "Video Update - Lighten the dark grey color of the yard area flooring to a lighter grey"
];

function App() {
  const [todos, setTodos] = useState(() => {
    // Get saved todos from localStorage or use default list
    const saved = localStorage.getItem('todos');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize todos with completed: false
    return todoItems.map(item => ({
      text: item,
      completed: false
    }));
  });

  const [activeTab, setActiveTab] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleToggle = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTodos([...todos, { text: newTask.trim(), completed: false }]);
      setNewTask('');
    }
  };

  const handleDelete = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    if (editIndex === index) {
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(todos[index].text);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = (index) => {
    if (editValue.trim()) {
      const newTodos = [...todos];
      newTodos[index].text = editValue.trim();
      setTodos(newTodos);
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditValue('');
  };

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'completed') return todo.completed;
    if (activeTab === 'pending') return !todo.completed;
    return true;
  });

  const getTabCount = (type) => {
    if (type === 'all') return todos.length;
    if (type === 'completed') return todos.filter(todo => todo.completed).length;
    if (type === 'pending') return todos.filter(todo => !todo.completed).length;
    return 0;
  };

  return (
    <div className="App">
      <h1>Warehouse Updates Checklist</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Tasks ({getTabCount('all')})
        </button>
        <button 
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({getTabCount('completed')})
        </button>
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({getTabCount('pending')})
        </button>
      </div>

      <div className="todo-list">
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="add-task-input"
          />
          <button type="submit" className="add-task-button">
            Add Task
          </button>
        </form>

        {filteredTodos.map((todo, idx) => {
          // Find the real index in the todos array
          const realIndex = todos.findIndex(t => t === todo);
          return (
            <div key={realIndex} className="todo-item">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(realIndex)}
                />
                <span className="checkmark"></span>
                {editIndex !== realIndex && (
                  <span className={todo.completed ? 'completed' : ''}>
                    {todo.text}
                  </span>
                )}
              </label>
              {editIndex === realIndex ? (
                <>
                  <textarea
                    className="edit-task-input"
                    value={editValue}
                    onChange={handleEditChange}
                    autoFocus
                    rows="3"
                  />
                  <div className="actions">
                    <button className="save-btn" onClick={() => handleEditSave(realIndex)} type="button">Save</button>
                    <button className="cancel-btn" onClick={handleEditCancel} type="button">Cancel</button>
                  </div>
                </>
              ) : (
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(realIndex)} title="Edit" type="button">✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(realIndex)} title="Delete" type="button">🗑️</button>
                </div>
              )}
            </div>
          );
        })}
        {filteredTodos.length === 0 && (
          <div className="empty-state">
            No {activeTab} tasks found
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 