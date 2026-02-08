import React, { useState, useEffect } from 'react';
import DataTable from '../components/Tables';
import { api } from '../auth/authService';

const History = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ module: '', action: '' });

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const fetchLogs = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (filter.module) queryParams.append('module', filter.module);
            if (filter.action) queryParams.append('action', filter.action);

            const response = await api.get(`/audit-logs?${queryParams.toString()}`);
            setLogs(response.data.data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'timestamp',
            label: 'Date/Time',
            render: (value) => new Date(value).toLocaleString()
        },
        {
            key: 'userId',
            label: 'User',
            render: (user) => user ? `${user.name} (${user.role})` : 'System'
        },
        { key: 'module', label: 'Module' },
        { key: 'action', label: 'Action' },
        { key: 'description', label: 'Description' },
    ];

    return (
        <div>
            <div className="card-header">
                <h1>Audit Logs</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        className="form-control"
                        onChange={(e) => setFilter({ ...filter, module: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="">All Modules</option>
                        <option value="Auth">Auth</option>
                        <option value="User">User</option>
                        <option value="Lead">Lead</option>
                        <option value="Deal">Deal</option>
                        <option value="Settings">Settings</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search Action..."
                        className="form-control"
                        onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <button className="btn btn-outline" onClick={fetchLogs}>Refresh</button>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <div className="loading">Loading logs...</div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">No logs found</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={logs.map(log => ({
                            ...log,
                            timestamp: log.createdAt // Map createdAt to timestamp for column
                        }))}
                        canEdit={false}
                        canDelete={false}
                    />
                )}
            </div>
        </div>
    );
};

export default History;
