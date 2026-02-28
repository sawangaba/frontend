import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw, ArrowLeft } from 'lucide-react';

const DatabaseViewer = ({ user, onBack }) => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            fetchTableData(selectedTable);
        }
    }, [selectedTable]);

    const fetchTables = async () => {
        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/db/tables?user_id=${user.id}`);
            const data = await res.json();
            setTables(data);
            if (data.length > 0 && !selectedTable) setSelectedTable(data[0]);
        } catch (error) {
            console.error("Failed to fetch tables", error);
        }
    };

    const fetchTableData = async (tableName) => {
        setLoading(true);
        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/db/table/${tableName}?user_id=${user.id}`);
            const data = await res.json();
            setTableData(data);
        } catch (error) {
            console.error("Failed to fetch table data", error);
        }
        setLoading(false);
    };

    const handleEmptyTable = async () => {
        if (!window.confirm(`Are you sure you want to empty table "${selectedTable}"? This cannot be undone.`)) return;

        try {
            const res = await fetch(`https://backend-fhk2.onrender.com/api/db/table/${selectedTable}?user_id=${user.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchTableData(selectedTable);
            }
        } catch (error) {
            console.error("Failed to empty table", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{
                padding: '40px',
                height: '100%',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#00f3ff',
                        cursor: 'pointer',
                        marginRight: '20px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{
                    margin: 0,
                    fontSize: '2rem',
                    color: '#00f3ff',
                    textTransform: 'uppercase',
                    letterSpacing: '4px',
                    textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
                }}>
                    Database Viewer
                </h2>
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar: Table List */}
                <div style={{
                    width: '250px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(0, 243, 255, 0.2)',
                    borderRadius: '10px',
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ color: '#e0e0e0', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>Tables</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {tables.map(table => (
                            <li
                                key={table}
                                onClick={() => setSelectedTable(table)}
                                style={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedTable === table ? 'rgba(0, 243, 255, 0.2)' : 'transparent',
                                    color: selectedTable === table ? '#00f3ff' : '#aaa',
                                    borderRadius: '5px',
                                    marginBottom: '5px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {table}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content: Table Data */}
                <div style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(0, 243, 255, 0.2)',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: '#00f3ff' }}>{selectedTable}</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => fetchTableData(selectedTable)}
                                title="Refresh"
                                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                            >
                                <RefreshCw size={20} />
                            </button>
                            <button
                                onClick={handleEmptyTable}
                                title="Empty Table"
                                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflow: 'auto' }}>
                        {loading ? (
                            <div style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>Loading data...</div>
                        ) : tableData.length === 0 ? (
                            <div style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>Table is empty</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr>
                                        {Object.keys(tableData[0]).map(key => (
                                            <th key={key} style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #333', color: '#aaa' }}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} style={{ padding: '10px', color: '#eee' }}>
                                                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DatabaseViewer;
