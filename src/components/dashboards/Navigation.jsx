import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    BarChart3,
    Users,
    MessageSquare,
    CheckSquare,
    Settings,
    LogOut
} from 'lucide-react';

const Sidebar = ({ links }) => {
    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/10 backdrop-blur-xl border-r border-white/20 z-50 p-6">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <LayoutDashboard className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
                    Koara AI
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                    >
                        {({ isActive }) => (
                            <div className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                                ${isActive
                                    ? 'bg-white/15 text-white shadow-lg border border-white/10'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'}
                            `}>
                                <link.icon className="w-5 h-5" />
                                <span className="font-medium">{link.label}</span>
                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <button
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

const BottomNav = ({ links }) => {
    return (
        <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/10 backdrop-blur-2xl border border-white/5 rounded-2xl z-[999] flex items-center justify-around px-2 shadow-2xl shadow-black/40">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                >
                    {({ isActive }) => (
                        <div className={`
                            relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300
                            ${isActive ? 'text-blue-400' : 'text-white/50'}
                        `}>
                            <link.icon className="w-6 h-6" />
                            {/* Active indicator bar */}
                            {isActive && (
                                <div className="absolute -top-1 w-8 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                            )}
                        </div>
                    )}
                </NavLink>
            ))}

            <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center w-14 h-14 rounded-xl text-white/50 hover:text-red-400 hover:bg-white/5 transition-all"
                title="Logout"
            >
                <LogOut className="w-6 h-6" />
            </button>
        </nav>
    );
};

export { Sidebar, BottomNav };
