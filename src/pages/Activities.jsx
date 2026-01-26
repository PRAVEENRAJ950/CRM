/**
 * Activities Management Page
 * CRUD operations for activities (tasks, calls, meetings)
 */

import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';
import authService from '../auth/authService';
import DataTable, { StatusBadge } from '../components/Tables';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Task',
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    priority: 'Medium',
  });

  const user = authService.getStoredUser();
  const canEdit = ['System Admin', 'Sales Manager', 'Sales Executive', 'Support Executive'].includes(user?.role);
  const canDelete = ['System Admin', 'Sales Manager'].includes(user?.role);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        await api.put(`/activities/${editingActivity._id}`, formData);
      } else {
        await api.post('/activities', formData);
      }
      setShowModal(false);
      setEditingActivity(null);
      setFormData({
        type: 'Task',
        title: '',
        description: '',
        dueDate: '',
        status: 'Pending',
        priority: 'Medium',
      });
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save activity');
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      type: activity.type,
      title: activity.title,
      description: activity.description || '',
      dueDate: activity.dueDate
        ? new Date(activity.dueDate).toISOString().split('T')[0]
        : '',
      status: activity.status,
      priority: activity.priority,
    });
    setShowModal(true);
  };

  const handleDelete = async (activity) => {
    if (!window.confirm(`Are you sure you want to delete ${activity.title}?`)) {
      return;
    }
    try {
      await api.delete(`/activities/${activity._id}`);
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete activity');
    }
  };

  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'title', label: 'Title' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => (value ? new Date(value).toLocaleDateString() : '-'),
    },
  ];

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div>
      <div className="card-header">
        <h1>Activities Management</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Activity
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={activities}
        onEdit={canEdit ? handleEdit : null}
        onDelete={canDelete ? handleDelete : null}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            setShowModal(false);
            setEditingActivity(null);
          }}
        >
          <div
            className="card"
            style={{ width: '90%', maxWidth: '500px', zIndex: 1001 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Call">Call</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Email">Email</option>
                  <option value="Task">Task</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Note">Note</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingActivity ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingActivity(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
