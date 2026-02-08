import React, { useState, useEffect, useRef } from 'react';
import { api } from '../auth/authService';
import authService from '../auth/authService';

const Messages = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const currentUser = authService.getStoredUser();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/messages/users');
            setUsers(response.data.data);
            if (response.data.data.length > 0 && !selectedUser) {
                // Optional: Select first user automatically
                // setSelectedUser(response.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await api.get(`/messages/${userId}`);
            setMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const response = await api.post('/messages', {
                receiverId: selectedUser._id,
                message: newMessage,
            });
            setMessages([...messages, response.data.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return <div className="loading">Loading messages...</div>;

    return (
        <div className="messages-container" style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '20px' }}>
            {/* Users List Sidebar */}
            <div className="users-list" style={{ width: '300px', backgroundColor: 'white', borderRadius: '8px', padding: '15px', overflowY: 'auto' }}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>Conversations</h3>
                {users.length === 0 ? (
                    <p>No contacts found.</p>
                ) : (
                    users.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                backgroundColor: selectedUser?._id === user._id ? '#e0f2fe' : 'transparent',
                                marginBottom: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: '500' }}>{user.name}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.role}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Chat Area */}
            <div className="chat-area" style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                {selectedUser ? (
                    <>
                        <div className="chat-header" style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                            <h3>{selectedUser.name} <span style={{ fontSize: '0.8em', color: '#888' }}>({selectedUser.role})</span></h3>
                        </div>

                        <div className="messages-list" style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f9fafb' }}>
                            {messages.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '40px' }}>No messages yet. Say hello!</div>
                            ) : (
                                messages.map((msg) => {
                                    const isOwn = msg.senderId._id === currentUser.id || msg.senderId === currentUser.id; // handle populated vs non-populated if inconsistent
                                    return (
                                        <div
                                            key={msg._id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: '70%',
                                                    padding: '10px 15px',
                                                    borderRadius: '12px',
                                                    backgroundColor: isOwn ? '#3b82f6' : 'white',
                                                    color: isOwn ? 'white' : '#1f2937',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                    border: isOwn ? 'none' : '1px solid #e5e7eb',
                                                }}
                                            >
                                                <div>{msg.message}</div>
                                                <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8, textAlign: 'right' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input" style={{ padding: '15px', borderTop: '1px solid #eee' }}>
                            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="btn btn-primary"
                                    style={{ padding: '0 20px' }}
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
