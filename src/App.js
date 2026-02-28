import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import BuilderLayout from './components/builder/BuilderLayout';
import OwnerLayout from './components/dashboards/OwnerLayout';
import EmployeeLayout from './components/dashboards/EmployeeLayout';
import EmployeeChat from './components/dashboards/EmployeeChat';
import LiveOps from './components/dashboards/LiveOps';
import Analytics from './components/dashboards/Analytics';
import DeveloperTransit from './components/dashboards/DeveloperTransit';
import EmployeeTasks from './components/dashboards/EmployeeTasks';
import DatabaseManager from './components/dashboards/DatabaseManager';
import { playUISound, speak } from './utils/VoiceUtils';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent = () => {
    const { theme } = useTheme();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [faceState, setFaceState] = useState('idle');

    useEffect(() => {
        if (isLoggedIn) {
            playUISound('startup');
            setTimeout(() => {
                speak(
                    "Welcome back. Systems online.",
                    () => setFaceState('speaking'),
                    () => setFaceState('idle')
                );
            }, 1000);
        }
    }, [isLoggedIn]);

    const handleLogin = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
    };

    const getRedirectPath = () => {
        if (user?.role === 'developer') return '/developer';
        if (user?.role === 'employee') return '/employee';
        return '/owner'; // manager or default
    };

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden', position: 'relative' }}>
            <Routes>
                <Route
                    path="/"
                    element={
                        !isLoggedIn ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                <LoginScreen onLogin={handleLogin} />
                            </motion.div>
                        ) : (
                            <Navigate to={getRedirectPath()} replace />
                        )
                    }
                />

                {/* Owner Dashboard Routes */}
                <Route path="/owner" element={<OwnerLayout />}>
                    <Route index element={<Navigate to="live-ops" replace />} />
                    <Route path="live-ops" element={<LiveOps />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="staff" element={<div className="p-8"><h1 className="text-4xl font-bold mb-4">Staff</h1><p className="text-white/60">Hello Staff Page</p></div>} />
                </Route>

                {/* Employee Dashboard Routes */}
                <Route path="/employee" element={<EmployeeLayout />}>
                    <Route index element={<Navigate to="chat" replace />} />
                    <Route path="chat" element={<EmployeeChat />} />
                    <Route path="tasks" element={<EmployeeTasks />} />
                </Route>

                {/* Developer Routes */}
                <Route path="/developer">
                    <Route index element={isLoggedIn ? <DeveloperTransit /> : <Navigate to="/" replace />} />
                    <Route path="builder" element={isLoggedIn ? <BuilderLayout /> : <Navigate to="/" replace />} />
                    <Route path="database" element={isLoggedIn ? <DatabaseManager user={user} /> : <Navigate to="/" replace />} />
                </Route>
            </Routes>
        </div>
    );
};

const App = () => (
    <ThemeProvider>
        <Router>
            <AppContent />
        </Router>
    </ThemeProvider>
);

export default App;