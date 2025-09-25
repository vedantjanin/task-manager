import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSave, onCancel, users = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: ''
  });

  // Populate form when editing OR reset for new task
  useEffect(() => {
    if (task) {
      let formattedDate = '';
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (!isNaN(dueDate)) {
          formattedDate = dueDate.toISOString().split('T')[0];
        }
      }

      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: formattedDate,
        priority: task.priority || 'Medium',
        assignedTo: task.assignedTo?._id || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        assignedTo: ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>

      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Priority:</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {users.length > 0 && (
        <div className="form-group">
          <label>Assign To:</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {task ? 'Update Task' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
