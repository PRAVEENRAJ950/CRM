import React, { useState, useEffect } from 'react';
import { api } from '../auth/authService';

const NotificationBadge = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();

        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            if (res.data.success) {
                setUnreadCount(res.data.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    if (unreadCount === 0) return null;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginLeft: '5px',
            }}
        >
            {unreadCount > 99 ? '99+' : unreadCount}
        </div>
    );
};

export default NotificationBadge;
