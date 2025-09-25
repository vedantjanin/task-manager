import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange, userRole, currentUserId }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ff6b6b';
      case 'Medium': return '#ffd93d';
      case 'Low': return '#6bcf7f';
      default: return '#ddd';
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (!tasks.length) return <div className="no-tasks">No tasks found</div>;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task._id} className="task-card" style={{ borderLeft: `6px solid ${getPriorityColor(task.priority)}` }}>
          <div className="task-header">
            <h3>{task.title}</h3>
            <span className={`status-badge ${task.status || 'pending'}`}>{task.status || 'pending'}</span>
          </div>
          <p>{task.description}</p>
          <div className="task-meta">
            <span>Due: {formatDate(task.dueDate)}</span>
            <span className="priority-tag" style={{ backgroundColor: getPriorityColor(task.priority) }}>{task.priority}</span>
            {task.assignedTo && <span>Assigned to: {task.assignedTo.username}</span>}
          </div>
          <div className="task-actions">
            <button className={`btn btn-status ${task.status === 'completed' ? 'completed' : ''}`}
              onClick={() => onStatusChange(task._id, task.status === 'pending' ? 'completed' : 'pending')}>
              {task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
            </button>
            {(userRole === 'admin' || task.assignedTo?._id === currentUserId) &&
              <button className="btn btn-edit" onClick={() => onEdit(task)}>Edit</button>}
            {userRole === 'admin' && 
              <button className="btn btn-danger" onClick={() => onDelete(task._id)}>Delete</button>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
