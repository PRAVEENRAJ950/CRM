import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';

const OrganizationSettings = () => {
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        location: '',
        currency: 'USD',
        timezone: 'UTC',
        workingHours: { start: '09:00', end: '17:00' },
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchOrgSettings();
    }, []);

    const fetchOrgSettings = async () => {
        try {
            const res = await api.get('/organization');
            if (res.data.data && res.data.data.name) {
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
            await api.put('/organization', formData);
            setMessage('Organization settings updated!');
        } catch (err) {
            setMessage('Failed to update settings');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="card">
            <h2 className="card-title">Organization Setup</h2>
            {message && <div style={{ marginBottom: '10px', color: 'green' }}>{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Organization Name</label>
                    <input
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Industry</label>
                    <input
                        className="form-input"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                        className="form-input"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Currency</label>
                        <input
                            className="form-input"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Timezone</label>
                        <input
                            className="form-input"
                            value={formData.timezone}
                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Working Hours</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="time"
                            className="form-input"
                            value={formData.workingHours?.start || '09:00'}
                            onChange={(e) => setFormData({ ...formData, workingHours: { ...formData.workingHours, start: e.target.value } })}
                        />
                        <span>to</span>
                        <input
                            type="time"
                            className="form-input"
                            value={formData.workingHours?.end || '17:00'}
                            onChange={(e) => setFormData({ ...formData, workingHours: { ...formData.workingHours, end: e.target.value } })}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Save Organization Settings</button>
            </form>
        </div>
    );
};

export default OrganizationSettings;
