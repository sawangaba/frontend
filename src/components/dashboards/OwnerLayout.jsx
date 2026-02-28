import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, BottomNav } from './Navigation';
import { LayoutDashboard, BarChart3, Users, Bell, X, Check } from 'lucide-react';

const OWNER_LINKS = [
    { to: '/owner/live-ops', label: 'Live Ops', icon: LayoutDashboard },
    { to: '/owner/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/owner/staff', label: 'Staff', icon: Users },
];

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/owner/notifications');
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifs", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 2000);
        return () => clearInterval(interval);
    }, []);

    const markRead = async (id) => {
        try {
            await fetch(`http://localhost:8000/api/owner/notifications/${id}/read`, { method: 'PUT' });
            fetchNotifications();
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const hasUnread = notifications.some(n => !n.is_read);

    return (
        <div className="absolute top-6 right-6 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
                <Bell className="w-5 h-5 text-white/70" />
                {hasUnread && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-14 w-80 bg-[#0A0A0B] border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="font-bold text-sm tracking-widest uppercase text-white/70">Notifications</h3>
                            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-white/30 text-sm">No notifications</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-4 border-b border-white/5 transition-colors ${!notif.is_read ? 'bg-white/5' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${notif.urgency?.toLowerCase() === 'critical' ? 'text-red-400' : 'text-blue-400'}`}>
                                                {notif.urgency || 'System'}
                                            </span>
                                            <span className="text-[10px] text-white/30">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <h4 className="text-sm font-semibold text-white/90 mb-1">{notif.title}</h4>
                                        <p className="text-xs text-white/60 mb-3">{notif.message}</p>
                                        {!notif.is_read && (
                                            <button
                                                onClick={() => markRead(notif.id)}
                                                className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                                            >
                                                <Check className="w-3 h-3" /> Mark as read
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const OwnerLayout = () => {
    return (
        <div className="flex h-screen bg-[#050505] text-white relative">
            {/* Sidebar for Desktop */}
            <Sidebar links={OWNER_LINKS} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden md:ml-64 relative pb-28 md:pb-0">
                <NotificationsDropdown />
                <div className="h-full w-full overflow-y-auto">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Nav for Mobile */}
            <BottomNav links={OWNER_LINKS} />
        </div>
    );
};

export default OwnerLayout;
