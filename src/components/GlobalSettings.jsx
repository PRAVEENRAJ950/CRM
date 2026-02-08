import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';

const GlobalSettings = () => {
    const [formData, setFormData] = useState({
        notificationsEnabled: true,
        autoLeadAssign: false,
        defaultLeadStatus: 'New',
        reminderBeforeDeadline: 24,
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (res.data.data) {
                setFormData(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/settings', formData);
            setMessage('Global settings updated!');
        } catch (err) {
            setMessage('Failed to update settings');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <h2 className="card-title">Global CRM Settings</h2>
            {message && <div style={{ marginBottom: '10px', color: 'green' }}>{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={formData.notificationsEnabled}
                            onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                        />
                        Enable System Notifications
                    </label>
                </div>
                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={formData.autoLeadAssign}
                            onChange={(e) => setFormData({ ...formData, autoLeadAssign: e.target.checked })}
                        />
                        Auto-Assign Leads to Sales Team
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">Default Lead Status</label>
                    <select
                        className="form-input"
                        value={formData.defaultLeadStatus}
                        onChange={(e) => setFormData({ ...formData, defaultLeadStatus: e.target.value })}
                    >
                        <option value="New">New</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Contacted">Contacted</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Reminder Before Deadline (Hours)</label>
                    <input
                        type="number"
                        className="form-input"
                        value={formData.reminderBeforeDeadline}
                        onChange={(e) => setFormData({ ...formData, reminderBeforeDeadline: parseInt(e.target.value) })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Global Settings</button>
            </form>
        </div>
    );
};

export default GlobalSettings;
