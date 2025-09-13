import React, { useState, useEffect } from 'react';
import './index.css';

const getInitialTasks = () => {
  const saved = localStorage.getItem('tasks');
  return saved ? JSON.parse(saved) : [];
};

const TaskManager = () => {
  const [tasks, setTasks] = useState(getInitialTasks);
  const [form, setForm] = useState({ title: '', category: '', dueDate: '', note: '' });
  const [error, setError] = useState('');

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.dueDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const newTask = {
      id: Date.now(),
      ...form,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setForm({ title: '', category: '', dueDate: '', note: '' });
    setError('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">📝 Task Manager</h1>

        <form onSubmit={handleAdd} className="space-y-3 mb-6">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Task title *"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Category *"
          />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Optional note"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>

        <div className="mb-4 font-semibold">
          ✅ {completedCount} of {tasks.length} tasks completed
        </div>

        <ul className="space-y-3">
          {tasks.map(task => (
            <li
              key={task.id}
              className={`flex items-start justify-between p-4 rounded border ${
                task.completed ? 'bg-green-50 line-through' : 'bg-white'
              }`}
            >
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600">📂 {task.category}</div>
                <div className="text-sm text-gray-500">📅 Due: {task.dueDate}</div>
                {task.note && <div className="text-sm mt-1">{task.note}</div>}
              </div>
              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="text-green-600 hover:underline text-sm"
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskManager;