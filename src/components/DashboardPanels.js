import React from 'react';
import { motion } from 'framer-motion';

export const BookingsPanel = ({ data }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%' }}
    >
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>📅 Today's Bookings</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {data.map(b => (
                <li key={b.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>{b.name}</strong> ({b.guests} ppl)</span>
                    <span style={{ color: '#7f8c8d' }}>{b.time}</span>
                </li>
            ))}
        </ul>
    </motion.div>
);

export const StaffPanel = ({ data }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%' }}
    >
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>👨‍🍳 Staff On Shift</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {data.map(s => (
                <div key={s.id} style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                    <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{s.role}</div>
                </div>
            ))}
        </div>
    </motion.div>
);

export const MarketingPanel = ({ onGenerate, onPublish, generatedAd }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%' }}
    >
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>📢 Marketing Agent</h3>
        {!generatedAd ? (
            <button onClick={onGenerate} style={{ width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Generate 10% Off Post
            </button>
        ) : (
            <div>
                <div style={{ padding: '15px', backgroundColor: '#f0f3f5', borderRadius: '8px', marginBottom: '15px', fontStyle: 'italic' }}>
                    "{generatedAd}"
                </div>
                <button onClick={onPublish} style={{ width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Publish to Instagram
                </button>
            </div>
        )}
    </motion.div>
);

const DashboardPanels = ({ panels, generatedAd, onGenerateAd, onPublishAd }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {panels.map((panel, index) => (
                <div key={index}>
                    {panel.type === 'bookings' && <BookingsPanel data={panel.data} />}
                    {panel.type === 'staff' && <StaffPanel data={panel.data} />}
                    {panel.type === 'marketing' && (
                        <MarketingPanel
                            generatedAd={generatedAd}
                            onGenerate={onGenerateAd}
                            onPublish={onPublishAd}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default DashboardPanels;
