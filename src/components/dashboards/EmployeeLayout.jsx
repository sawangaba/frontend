import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, BottomNav } from './Navigation';
import { MessageSquare, CheckSquare } from 'lucide-react';

const EMPLOYEE_LINKS = [
    { to: '/employee/chat', label: 'Chat', icon: MessageSquare },
    { to: '/employee/tasks', label: 'Tasks', icon: CheckSquare },
];

const EmployeeLayout = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-[#050505] text-white">
            {/* Sidebar for Desktop */}
            <Sidebar links={EMPLOYEE_LINKS} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden md:ml-64 relative pb-28 md:pb-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="h-full w-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>


            {/* Bottom Nav for Mobile */}
            <BottomNav links={EMPLOYEE_LINKS} />
        </div>
    );
};

export default EmployeeLayout;
