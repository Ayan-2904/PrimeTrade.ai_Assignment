import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium'
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/tasks', newTask);
      setTasks([...tasks, response.data.task]);
      setNewTask({ title: '', description: '', status: 'todo', priority: 'medium' });
      setShowForm(false);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'todo': return '#fbbf24';
      case 'in-progress': return '#3b82f6';
      case 'done': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn" style={{ backgroundColor: '#dc2626', color: 'white' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Profile Section */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Profile</h3>
            <div style={{ marginBottom: '16px' }}>
              <strong>Name:</strong> {user?.name}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}
            </div>
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <h4>Statistics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{tasks.length}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Tasks</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {tasks.filter(t => t.status === 'done').length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Completed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {tasks.filter(t => t.status === 'todo').length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>My Tasks</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
              >
                {showForm ? 'Cancel' : '+ New Task'}
              </button>
            </div>

            {showForm && (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0 }}>Create New Task</h4>
                <form onSubmit={handleCreateTask}>
                  <div style={{ marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <textarea
                      placeholder="Task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className="input-field"
                      style={{ minHeight: '80px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                      className="input-field"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="input-field"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Create Task</button>
                </form>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <div className="loading-spinner"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                No tasks found. Create your first task!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0 }}>{task.title}</h4>
                          <span style={{
                            backgroundColor: getStatusColor(task.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {task.status === 'in-progress' ? 'In Progress' : task.status}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p style={{ margin: '8px 0', color: '#4b5563' }}>{task.description}</p>
                        )}
                        
                        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                          <span>Priority: {task.priority}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateStatus(task._id, 
                            task.status === 'done' ? 'todo' : 
                            task.status === 'in-progress' ? 'done' : 'in-progress'
                          )}
                          className="btn"
                          style={{ 
                            backgroundColor: task.status === 'done' ? '#10b981' : '#f3f4f6',
                            color: task.status === 'done' ? 'white' : 'inherit'
                          }}
                        >
                          {task.status === 'done' ? '✓ Done' : 'Mark Complete'}
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="btn"
                          style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;