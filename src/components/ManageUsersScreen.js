import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Save, User } from 'lucide-react';

const ManageUsersScreen = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://backend-fhk2.onrender.com/api/admin/users');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This will delete the user and ALL their data permanently.")) return;
        try {
            await fetch(`https://backend-fhk2.onrender.com/api/admin/user/${id}`, { method: 'DELETE' });
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const handleEditClick = (user) => {
        setEditUser(user.id);
        setFormData({ email: user.email, password: '' }); // Don't show hash
    };

    const handleSave = async (id) => {
        if (!formData.password) {
            alert("Please enter a new password to update.");
            return;
        }
        try {
            await fetch(`https://backend-fhk2.onrender.com/api/admin/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setEditUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Failed to update user", error);
        }
    };

    const containerStyle = {
        padding: '20px',
        height: '100%',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        fontSize: '0.9rem'
    };

    const thStyle = {
        textAlign: 'left',
        padding: '10px',
        borderBottom: '1px solid #00f3ff',
        color: '#00f3ff',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    const tdStyle = {
        padding: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
    };

    const inputStyle = {
        padding: '5px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        border: '1px solid #00f3ff',
        color: '#fff',
        borderRadius: '3px',
        outline: 'none'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={containerStyle}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#00f3ff', cursor: 'pointer', marginRight: '15px' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ margin: 0, color: '#00f3ff', textTransform: 'uppercase', letterSpacing: '2px' }}>Manage Users</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? <p>Loading users...</p> : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>New Password</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={tdStyle}>{user.id}</td>
                                    <td style={tdStyle}>
                                        {editUser === user.id ? (
                                            <input
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                style={inputStyle}
                                            />
                                        ) : user.email}
                                    </td>
                                    <td style={tdStyle}>
                                        {editUser === user.id ? (
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                style={inputStyle}
                                            />
                                        ) : '********'}
                                    </td>
                                    <td style={tdStyle}>
                                        {editUser === user.id ? (
                                            <button onClick={() => handleSave(user.id)} style={{ background: 'none', border: 'none', color: '#00ff00', cursor: 'pointer', marginRight: '10px' }}>
                                                <Save size={18} />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleEditClick(user)} style={{ background: 'none', border: 'none', color: '#00f3ff', cursor: 'pointer', marginRight: '10px' }}>
                                                Edit
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(user.id)} style={{ background: 'none', border: 'none', color: '#ff0000', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );
};

export default ManageUsersScreen;
