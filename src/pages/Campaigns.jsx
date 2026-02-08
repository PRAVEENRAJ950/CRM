/**
 * Campaigns Page
 * Manage marketing campaigns (Marketing/Admin only)
 */

import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';
import DataTable from '../components/Tables';
import authService from '../auth/authService';

const Campaigns = () => {
    const user = authService.getStoredUser();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentCampaign, setCurrentCampaign] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Other',
        status: 'Planned',
        startDate: '',
        endDate: '',
        budget: '',
        expectedRevenue: '',
        description: ''
    });

    const isEditable = ['System Admin', 'Marketing Executive'].includes(user?.role);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const { data } = await api.get('/campaigns');
            setCampaigns(data.data);
        } catch (err) {
            setError('Failed to fetch campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentCampaign) {
                await api.put(`/campaigns/${currentCampaign._id}`, formData);
            } else {
                await api.post('/campaigns', formData);
            }
            setShowModal(false);
            fetchCampaigns();
            setFormData({
                name: '', type: 'Other', status: 'Planned', startDate: '', endDate: '', budget: '', expectedRevenue: '', description: ''
            });
            setCurrentCampaign(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (campaign) => {
        setCurrentCampaign(campaign);
        setFormData({
            name: campaign.name,
            type: campaign.type,
            status: campaign.status,
            startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
            endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
            budget: campaign.budget,
            expectedRevenue: campaign.expectedRevenue,
            description: campaign.description
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;
        try {
            await api.delete(`/campaigns/${id}`);
            fetchCampaigns();
        } catch (err) {
            alert('Failed to delete campaign');
        }
    };

    const columns = [
        { key: 'name', label: 'Campaign API Name' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'startDate', label: 'Start Date', render: (d) => new Date(d).toLocaleDateString() },
        { key: 'budget', label: 'Budget', render: (v) => `$${v?.toLocaleString() || 0}` },
        { key: 'roi', label: 'ROI (Est)', render: (v) => `${v ? v.toFixed(1) + '%' : '-'}` }
    ];

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Marketing Campaigns</h1>
                {isEditable && (
                    <button className="btn btn-primary" onClick={() => { setCurrentCampaign(null); setShowModal(true); }}>
                        + New Campaign
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="card">
                <DataTable
                    columns={columns}
                    data={campaigns}
                    onEdit={isEditable ? handleEdit : null}
                    onDelete={user?.role === 'System Admin' ? handleDelete : null}
                    canEdit={isEditable}
                    canDelete={user?.role === 'System Admin'}
                />
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{currentCampaign ? 'Edit Campaign' : 'New Campaign'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Campaign Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select name="type" value={formData.type} onChange={handleInputChange}>
                                    <option>Email</option>
                                    <option>Social Media</option>
                                    <option>Webinar</option>
                                    <option>Event</option>
                                    <option>Referral</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option>Planned</option>
                                    <option>Active</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Budget</label>
                                    <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Expected Revenue</label>
                                    <input type="number" name="expectedRevenue" value={formData.expectedRevenue} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Campaigns;
