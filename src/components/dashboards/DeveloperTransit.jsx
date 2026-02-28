import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Database, LogOut, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeveloperTransit = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        window.location.href = '/';
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                className="z-10 bg-white/5 border border-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl max-w-2xl w-full mx-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 mb-6 shadow-lg shadow-blue-500/30">
                        <Code className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-3 tracking-tight">
                        Developer Hub
                    </h1>
                    <p className="text-white/50">Select an environment to proceed</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate('/developer/builder')}
                        className="group relative flex flex-col items-center p-8 bg-black/40 border border-white/10 rounded-2xl hover:bg-black/60 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <LayoutDashboard className="w-12 h-12 text-blue-400 mb-4" />
                        <span className="text-xl font-semibold text-white mb-2 relative z-10">Interface Builder</span>
                        <span className="text-sm text-white/40 text-center relative z-10">Visual dragging, UI modifications, formatting</span>
                    </motion.button>

                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate('/developer/database')}
                        className="group relative flex flex-col items-center p-8 bg-black/40 border border-white/10 rounded-2xl hover:bg-black/60 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Database className="w-12 h-12 text-emerald-400 mb-4" />
                        <span className="text-xl font-semibold text-white mb-2 relative z-10">Database Manager</span>
                        <span className="text-sm text-white/40 text-center relative z-10">Edit tables, insert data rows, configurations</span>
                    </motion.button>
                </div>

                <motion.button
                    variants={itemVariants}
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-4 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors font-medium border border-red-500/20 hover:border-red-500/30"
                >
                    <LogOut className="w-5 h-5" />
                    Secure Logout
                </motion.button>
            </motion.div>
        </div>
    );
};

export default DeveloperTransit;
