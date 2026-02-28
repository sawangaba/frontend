import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, ArrowLeft } from 'lucide-react';

const UserDataScreen = ({ user, onBack, theme }) => {
    const [formData, setFormData] = useState({
        business_name: '',
        location: '',
        menu_items: '',
        staff_list: '',
        monthly_expenses: '',
        additional_info: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) fetchUserData();
    }, [user]);

    const fetchUserData = async () => {
        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/user-data?user_id=${user.id}`);
            const data = await res.json();
            if (data.business_name) {
                setFormData(data);
            }
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("File size exceeds 2MB limit.");
                return;
            }
            const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.csv'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension) && !file.type.startsWith('text/')) {
                alert("Invalid file type. Allowed: PDF, Word, Text, Excel.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                if (file.type.startsWith('text/') || fileExtension === '.txt' || fileExtension === '.csv') {
                    setFormData(prev => ({ ...prev, menu_items: event.target.result }));
                } else {
                    setFormData(prev => ({ ...prev, menu_items: `[Attached File: ${file.name}]` }));
                }
            };
            reader.readAsText(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/user-data?user_id=${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setMessage('Data saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to save data.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error saving data.');
        }
        setLoading(false);
    };

    // Theme-based Styles
    const primary = theme?.primary || '#00f3ff';
    const text = theme?.text || '#00f3ff';
    const panelBg = theme?.panelBg || 'rgba(0, 20, 40, 0.8)';
    const border = theme?.border || '#00f3ff';

    const inputStyle = {
        width: '100%',
        padding: '15px',
        margin: '0', // Margin handled by grid gap
        display: 'block',
        border: `1px solid ${border}`,
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: text,
        fontFamily: theme?.font || "sans-serif",
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border 0.3s ease, box-shadow 0.3s ease'
    };

    const labelStyle = {
        color: theme?.textSecondary || '#e0e0e0',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '8px',
        display: 'block'
    };

    const scrollbarStyles = `
        .custom-scroll::-webkit-scrollbar {
            width: 6px; /* Thinner scrollbar */
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: transparent; /* Transparent track */
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: ${primary}40; /* Low opacity thumb */
            border-radius: 3px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: ${theme?.accent || primary}; 
        }
    `;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '40px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                color: text
            }}
        >
            <style>{scrollbarStyles}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: primary,
                        cursor: 'pointer',
                        marginRight: '20px',
                        padding: '10px',
                        borderRadius: '50%',
                        transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                    <ArrowLeft size={28} />
                </button>
                <div>
                    <h2 style={{ margin: 0, color: primary, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '2rem' }}>User Data</h2>
                    <p style={{ margin: '5px 0 0 0', color: theme?.textSecondary, fontSize: '0.9rem' }}>Manage your business information securely.</p>
                </div>
            </div>

            {/* Symmetric Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr', // Two equal columns
                gridTemplateRows: 'auto 1fr 1fr', // Auto height for inputs, equal height for textareas
                gap: '25px',
                flex: 1,
                overflow: 'hidden',
                paddingBottom: '10px'
            }}>

                {/* Row 1 Left: Business Name */}
                <div>
                    <label style={labelStyle}>Business Name</label>
                    <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Enter business name..."
                    />
                </div>

                {/* Row 1 Right: Location */}
                <div>
                    <label style={labelStyle}>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="Enter location..."
                    />
                </div>

                {/* Row 2 Left: Menu Items */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>Menu Items / Files</label>
                        <label style={{
                            cursor: 'pointer',
                            color: theme?.accent,
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            border: `1px dashed ${theme?.accent}`,
                            borderRadius: '4px'
                        }}>
                            <Upload size={12} style={{ marginRight: '5px' }} /> Upload
                            <input type="file" hidden onChange={handleFileUpload} />
                        </label>
                    </div>
                    <textarea
                        className="custom-scroll"
                        name="menu_items"
                        value={formData.menu_items}
                        onChange={handleChange}
                        style={{ ...inputStyle, flex: 1, resize: 'none', overflowY: 'auto' }}
                        placeholder="List menu items or upload a file..."
                    />
                </div>

                {/* Row 2 Right: Staff List */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <label style={labelStyle}>Staff List</label>
                    <textarea
                        className="custom-scroll"
                        name="staff_list"
                        value={formData.staff_list}
                        onChange={handleChange}
                        style={{ ...inputStyle, flex: 1, resize: 'none', overflowY: 'auto' }}
                        placeholder="List staff members..."
                    />
                </div>

                {/* Row 3 Left: Monthly Expenses */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <label style={labelStyle}>Monthly Expenses</label>
                    <textarea
                        className="custom-scroll"
                        name="monthly_expenses"
                        value={formData.monthly_expenses}
                        onChange={handleChange}
                        style={{ ...inputStyle, flex: 1, resize: 'none', overflowY: 'auto' }}
                        placeholder="Detail monthly expenses..."
                    />
                </div>

                {/* Row 3 Right: Additional Info */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <label style={labelStyle}>Additional Info</label>
                    <textarea
                        className="custom-scroll"
                        name="additional_info"
                        value={formData.additional_info}
                        onChange={handleChange}
                        style={{ ...inputStyle, flex: 1, resize: 'none', overflowY: 'auto' }}
                        placeholder="Any other details..."
                    />
                </div>

            </div>

            {/* Footer / Save Button */}
            <div style={{ marginTop: '20px', textAlign: 'center', flexShrink: 0 }}>
                {message && <span style={{ color: message.includes('success') ? '#00ff00' : '#ff0000', marginRight: '20px', fontSize: '0.9rem' }}>{message}</span>}
                <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                        padding: '12px 50px',
                        backgroundColor: theme?.buttonBg || 'rgba(0, 243, 255, 0.2)',
                        color: theme?.buttonText || '#00f3ff',
                        border: `1px solid ${theme?.border || '#00f3ff'}`,
                        borderRadius: '30px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 0 15px ${primary}40`
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = primary;
                        e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme?.buttonBg || 'rgba(0, 243, 255, 0.2)';
                        e.currentTarget.style.color = theme?.buttonText || '#00f3ff';
                    }}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </motion.div>
    );
};

export default UserDataScreen;
