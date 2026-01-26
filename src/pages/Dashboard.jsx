/**
 * Dashboard Page
 * Main dashboard with statistics and recent activities
 */

import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';
import DashboardCards from '../components/DashboardCards';
import DataTable, { StatusBadge } from '../components/Tables';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="empty-state">Error: {error}</div>;
  }

  const recentActivitiesColumns = [
    { key: 'type', label: 'Type' },
    { key: 'title', label: 'Title' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => (value ? new Date(value).toLocaleDateString() : '-'),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Dashboard</h1>

      <DashboardCards stats={stats} />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activities</h2>
        </div>
        {stats?.recentActivities && stats.recentActivities.length > 0 ? (
          <DataTable
            columns={recentActivitiesColumns}
            data={stats.recentActivities}
            canEdit={false}
            canDelete={false}
          />
        ) : (
          <div className="empty-state">
            <p>No recent activities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
