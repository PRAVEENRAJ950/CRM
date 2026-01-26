/**
 * Customers Page
 * View customer accounts and contacts (Read-only for Customers)
 */

import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';
import authService from '../auth/authService';
import DataTable from '../components/Tables';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = authService.getStoredUser();
  const isReadOnly = user?.role === 'Customer';

  useEffect(() => {
    // For now, we'll show a placeholder message
    // In a full implementation, you would fetch accounts/contacts here
    setLoading(false);
    setCustomers([]);
  }, []);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'industry', label: 'Industry' },
  ];

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div>
      <div className="card-header">
        <h1>Customers</h1>
        {!isReadOnly && (
          <button className="btn btn-primary" onClick={() => alert('Add customer functionality coming soon')}>
            + Add Customer
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

      {customers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <p>No customers found</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Customer account management will be available in the full implementation
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          canEdit={!isReadOnly}
          canDelete={false}
        />
      )}
    </div>
  );
};

export default Customers;
