import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DatabaseManager = ({ user }) => {
    const navigate = useNavigate();
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Editing state
    const [editingRowId, setEditingRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Adding state
    const [isAdding, setIsAdding] = useState(false);
    const [newFormData, setNewFormData] = useState({ email: '', password: '', role: 'employee' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/admin/users`);
            const data = await res.json();
            setUsersData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (rowId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/admin/user/${rowId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setUsersData(usersData.filter(u => u.id !== rowId));
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const startEdit = (row) => {
        setEditingRowId(row.id);
        // Leave password out of initial state so it's blank by default
        setEditFormData({ email: row.email, role: row.role, password: '' });
    };

    const cancelEdit = () => {
        setEditingRowId(null);
        setEditFormData({});
    };

    const handleEditChange = (e, key) => {
        setEditFormData({ ...editFormData, [key]: e.target.value });
    };

    const saveEdit = async () => {
        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/admin/user/${editingRowId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData)
            });
            if (res.ok) {
                fetchUsers(); // Refresh to catch changes
                setEditingRowId(null);
            }
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const startAdd = () => {
        setIsAdding(true);
        setNewFormData({ email: '', password: '', role: 'employee' });
    };

    const cancelAdd = () => {
        setIsAdding(false);
        setNewFormData({ email: '', password: '', role: 'employee' });
    };

    const handleAddChange = (e, key) => {
        setNewFormData({ ...newFormData, [key]: e.target.value });
    };

    const saveAdd = async () => {
        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormData)
            });
            if (res.ok) {
                setIsAdding(false);
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.detail || "Error adding user");
            }
        } catch (err) {
            console.error("Add failed", err);
        }
    };

    return (
        <div className="flex h-screen bg-[#050505] text-white">
            <div className="flex-1 flex flex-col h-full overflow-hidden p-8">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/developer')}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="Back to Hub"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1 flex justify-between items-center">
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white tracking-tight">
                            <Users className="w-7 h-7 text-blue-400" />
                            User Registry Manager
                        </h1>
                        <button
                            onClick={startAdd}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add User
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto h-full">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-white/50">Fetching users...</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                                    <tr>
                                        <th className="p-4 font-semibold text-white/70 uppercase text-xs tracking-wider w-20">ID</th>
                                        <th className="p-4 font-semibold text-white/70 uppercase text-xs tracking-wider w-1/3">Email</th>
                                        <th className="p-4 font-semibold text-white/70 uppercase text-xs tracking-wider w-40">Role</th>
                                        <th className="p-4 font-semibold text-white/70 uppercase text-xs tracking-wider">New Password (Optional)</th>
                                        <th className="p-4 font-semibold text-white/70 uppercase text-xs tracking-wider text-right w-32">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isAdding && (
                                        <tr className="border-b border-white/5 bg-blue-500/10">
                                            <td className="p-4"><span className="text-white/30 italic">Auto</span></td>
                                            <td className="p-4">
                                                <input
                                                    type="email"
                                                    placeholder="Required"
                                                    value={newFormData.email}
                                                    onChange={(e) => handleAddChange(e, 'email')}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={newFormData.role}
                                                    onChange={(e) => handleAddChange(e, 'role')}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="employee">Employee</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="developer">Developer</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <input
                                                    type="password"
                                                    placeholder="Required"
                                                    value={newFormData.password}
                                                    onChange={(e) => handleAddChange(e, 'password')}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                />
                                            </td>
                                            <td className="p-4 flex justify-end gap-2">
                                                <button onClick={saveAdd} className="p-1.5 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors" title="Save">
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button onClick={cancelAdd} className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Cancel">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    )}

                                    {usersData.length === 0 && !isAdding ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-white/40 italic">No users found.</td>
                                        </tr>
                                    ) : (
                                        usersData.map((row) => (
                                            <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4">
                                                    <span className="text-blue-400/80 font-mono">#{row.id}</span>
                                                </td>
                                                <td className="p-4 text-white/80">
                                                    {editingRowId === row.id ? (
                                                        <input
                                                            type="email"
                                                            value={editFormData.email}
                                                            onChange={(e) => handleEditChange(e, 'email')}
                                                            className="w-full bg-black/40 border border-blue-500/50 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                                        />
                                                    ) : row.email}
                                                </td>
                                                <td className="p-4 text-white/80">
                                                    {editingRowId === row.id ? (
                                                        <select
                                                            value={editFormData.role}
                                                            onChange={(e) => handleEditChange(e, 'role')}
                                                            className="w-full bg-black/40 border border-blue-500/50 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all appearance-none cursor-pointer"
                                                        >
                                                            <option value="employee">Employee</option>
                                                            <option value="manager">Manager</option>
                                                            <option value="developer">Developer</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${row.role === 'developer' ? 'bg-purple-500/20 text-purple-400' : row.role === 'manager' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                                            {row.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-white/80">
                                                    {editingRowId === row.id ? (
                                                        <input
                                                            type="password"
                                                            placeholder="Leave blank to keep current"
                                                            value={editFormData.password}
                                                            onChange={(e) => handleEditChange(e, 'password')}
                                                            className="w-full bg-black/40 border border-blue-500/50 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                                                        />
                                                    ) : (
                                                        <span className="text-white/20">••••••••</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        {editingRowId === row.id ? (
                                                            <>
                                                                <button onClick={saveEdit} className="p-1.5 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors" title="Save">
                                                                    <Check className="w-5 h-5" />
                                                                </button>
                                                                <button onClick={cancelEdit} className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Cancel">
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => startEdit(row)} className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleDelete(row.id)} className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete" disabled={row.email === 'admin'}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatabaseManager;
