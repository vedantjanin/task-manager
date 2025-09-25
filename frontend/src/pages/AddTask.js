import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/tasks', formData, { withCredentials: true });
      navigate('/'); // Back to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Add Task</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;
