// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadTasks();
    if (user?.role === 'admin') loadUsers();
  }, [user]);

  // Load tasks
  const loadTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulate users list
  const loadUsers = async () => {
    setUsers([{ _id: '1', username: 'user1', role: 'user' }]);
  };

  // Save task (create or update)
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // ✅ Update task
        await tasksAPI.update(editingTask._id, taskData);
        setEditingTask(null);
      } else {
        // ✅ Create new task
        await tasksAPI.create(taskData);
      }
      setShowForm(false);
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Edit button
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true); // Show modal
  };

  // Delete button
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await tasksAPI.delete(taskId);
      loadTasks();
    }
  };

  // Mark as completed / pending
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      loadTasks();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="navbar">
        <h1>Task Manager</h1>
        <div className="user-info">
          <span>Welcome, {user?.username} ({user?.role})</span>
          <button onClick={logout} className="btn btn-logout">Logout</button>
        </div>
      </header>

      <main className="main-content">
        <div className="tasks-header">
          <h2>Your Tasks</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            + Create Task
          </button>
        </div>

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <div className="modal-overlay">
            <div className="modal-content">
              <TaskForm
                key={editingTask?._id || 'new'} // ✅ Force re-render
                task={editingTask}
                users={users}
                onSave={handleSaveTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          userRole={user?.role}
          currentUserId={user?._id}
        />
      </main>
    </div>
  );
};

export default Dashboard;
