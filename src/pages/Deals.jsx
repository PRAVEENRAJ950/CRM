/**
 * Deals Management Page
 * CRUD operations for deals/opportunities
 */

import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';
import authService from '../auth/authService';
import DataTable, { StatusBadge } from '../components/Tables';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    dealName: '',
    stage: 'Prospecting',
    value: '',
    expectedCloseDate: '',
    description: '',
  });

  const user = authService.getStoredUser();
  const canEdit = ['System Admin', 'Sales Manager', 'Sales Executive'].includes(user?.role);
  const canDelete = ['System Admin', 'Sales Manager'].includes(user?.role);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await api.get('/deals');
      setDeals(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDeal) {
        await api.put(`/deals/${editingDeal._id}`, {
          ...formData,
          value: parseFloat(formData.value),
        });
      } else {
        await api.post('/deals', {
          ...formData,
          value: parseFloat(formData.value),
        });
      }
      setShowModal(false);
      setEditingDeal(null);
      setFormData({
        dealName: '',
        stage: 'Prospecting',
        value: '',
        expectedCloseDate: '',
        description: '',
      });
      fetchDeals();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save deal');
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      dealName: deal.dealName,
      stage: deal.stage,
      value: deal.value.toString(),
      expectedCloseDate: deal.expectedCloseDate
        ? new Date(deal.expectedCloseDate).toISOString().split('T')[0]
        : '',
      description: deal.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (deal) => {
    if (!window.confirm(`Are you sure you want to delete ${deal.dealName}?`)) {
      return;
    }
    try {
      await api.delete(`/deals/${deal._id}`);
      fetchDeals();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete deal');
    }
  };

  const columns = [
    { key: 'dealName', label: 'Deal Name' },
    {
      key: 'stage',
      label: 'Stage',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'value',
      label: 'Value',
      render: (value) => `$${value?.toLocaleString() || 0}`,
    },
    {
      key: 'expectedCloseDate',
      label: 'Expected Close',
      render: (value) => (value ? new Date(value).toLocaleDateString() : '-'),
    },
  ];

  if (loading) {
    return <div className="loading">Loading deals...</div>;
  }

  return (
    <div>
      <div className="card-header">
        <h1>Deals Management</h1>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Deal
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
        data={deals}
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
            setEditingDeal(null);
          }}
        >
          <div
            className="card"
            style={{ width: '90%', maxWidth: '500px', zIndex: 1001 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Deal Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.dealName}
                  onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stage</label>
                <select
                  className="form-select"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                >
                  <option value="Prospecting">Prospecting</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Value ($) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Close Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
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
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingDeal ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDeal(null);
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

export default Deals;
