/**
 * Reports Page
 * Analytics and reports (Manager/Admin only)
 */

import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';
import DataTable from '../components/Tables';

const Reports = () => {
  const [salesPerformance, setSalesPerformance] = useState([]);
  const [leadConversion, setLeadConversion] = useState([]);
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('sales');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [salesRes, leadsRes, pipelineRes] = await Promise.all([
        api.get('/reports/sales-performance'),
        api.get('/reports/lead-conversion'),
        api.get('/reports/deal-pipeline'),
      ]);

      setSalesPerformance(salesRes.data.data);
      setLeadConversion(leadsRes.data.data);
      setPipelineData(pipelineRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  const salesColumns = [
    { key: 'userName', label: 'User' },
    { key: 'totalDeals', label: 'Total Deals' },
    { key: 'totalValue', label: 'Total Value', render: (v) => `$${v?.toLocaleString() || 0}` },
    { key: 'wonDeals', label: 'Won Deals' },
    { key: 'wonValue', label: 'Won Value', render: (v) => `$${v?.toLocaleString() || 0}` },
    { key: 'winRate', label: 'Win Rate', render: (v) => `${v?.toFixed(2) || 0}%` },
  ];

  const leadColumns = [
    { key: 'source', label: 'Source' },
    { key: 'totalLeads', label: 'Total Leads' },
    { key: 'newLeads', label: 'New' },
    { key: 'qualifiedLeads', label: 'Qualified' },
    { key: 'convertedLeads', label: 'Converted' },
    { key: 'conversionRate', label: 'Conversion Rate', render: (v) => `${v?.toFixed(2) || 0}%` },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Reports & Analytics</h1>

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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--border-color)' }}>
        <button
          className={`btn ${activeTab === 'sales' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('sales')}
        >
          Sales Performance
        </button>
        <button
          className={`btn ${activeTab === 'leads' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('leads')}
        >
          Lead Conversion
        </button>
        <button
          className={`btn ${activeTab === 'pipeline' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('pipeline')}
        >
          Pipeline Analysis
        </button>
      </div>

      {/* Sales Performance Tab */}
      {activeTab === 'sales' && (
        <div className="card">
          <h2 className="card-title">Sales Performance Report</h2>
          <DataTable
            columns={salesColumns}
            data={salesPerformance}
            canEdit={false}
            canDelete={false}
          />
        </div>
      )}

      {/* Lead Conversion Tab */}
      {activeTab === 'leads' && (
        <div className="card">
          <h2 className="card-title">Lead Conversion Report</h2>
          <DataTable
            columns={leadColumns}
            data={leadConversion}
            canEdit={false}
            canDelete={false}
          />
        </div>
      )}

      {/* Pipeline Analysis Tab */}
      {activeTab === 'pipeline' && pipelineData && (
        <div className="card">
          <h2 className="card-title">Deal Pipeline Analysis</h2>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Pipeline Value</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  ${pipelineData.summary?.totalValue?.toLocaleString() || 0}
                </div>
              </div>
              <div style={{ padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Open Deals Value</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  ${pipelineData.summary?.openValue?.toLocaleString() || 0}
                </div>
              </div>
              <div style={{ padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Closed Won Value</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success-color)' }}>
                  ${pipelineData.summary?.closedWonValue?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>
          <DataTable
            columns={[
              { key: '_id', label: 'Stage' },
              { key: 'count', label: 'Count' },
              { key: 'totalValue', label: 'Total Value', render: (v) => `$${v?.toLocaleString() || 0}` },
              { key: 'avgValue', label: 'Avg Value', render: (v) => `$${v?.toFixed(2) || 0}` },
            ]}
            data={pipelineData.stages}
            canEdit={false}
            canDelete={false}
          />
        </div>
      )}
    </div>
  );
};

export default Reports;
