import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Clock, MessageSquare, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import EmployeeChat from './EmployeeChat';

const PriorityBadge = ({ priority }) => {
    const isHigh = priority?.toLowerCase() === 'high' || priority?.toLowerCase() === 'critical';
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isHigh ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
            {priority || 'NORMAL'}
        </span>
    );
};

const TaskCard = ({ task }) => (
    <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 p-4 rounded-xl mb-4 backdrop-blur-sm group border border-white/5"
    >
        <div className="flex justify-between items-start mb-2">
            <PriorityBadge priority={task.priority} />
            <button className="text-white/10 hover:text-white/40 transition-colors">
                <MoreVertical className="w-4 h-4" />
            </button>
        </div>
        <h4 className="text-white/90 font-medium text-sm mb-4 leading-relaxed">{task.title}</h4>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                    {task.assignee ? task.assignee.substring(0, 2) : 'AI'}
                </div>
                <span className="text-[10px] text-white/30 font-medium">{task.assignee || 'Unassigned'}</span>
            </div>
            <div className="flex items-center gap-1 text-white/10">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold">Live</span>
            </div>
        </div>
    </motion.div>
);

const Column = ({ title, tasks, status }) => {
    // case insensitive match for status mapping
    const filteredTasks = tasks.filter(t => t.status?.toLowerCase() === status.toLowerCase() || (status === 'To Do' && t.status?.toLowerCase() === 'pending'));
    return (
        <div className="flex-none w-[80vw] md:w-full h-fit snap-center">
            <div className="px-2 mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-white/80 font-bold text-md tracking-tight uppercase tracking-widest text-[11px]">{title}</h3>
                    <span className="text-white/20 text-[11px] font-bold">{filteredTasks.length}</span>
                </div>
            </div>
            <div className="space-y-3 px-1">
                <AnimatePresence>
                    {filteredTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </AnimatePresence>
            </div>
        </div>
    );
};

const LiveOps = () => {
    const [showChatMobile, setShowChatMobile] = useState(false);
    const [isInteracting, setIsInteracting] = useState(true);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/owner/tasks');
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error("Failed to fetch owner tasks.", err);
            }
        };
        fetchTasks();
        const interval = setInterval(fetchTasks, 2000); // live polling
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full w-full bg-[#050505] overflow-hidden flex flex-col md:flex-row relative">

            {/* LEFT SIDE: AI Chat (Full 60% Width, auto animates up) */}
            <div
                className={`
          hidden md:flex flex-col md:w-[60%] transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] relative
          ${isInteracting ? 'pt-0' : 'pt-[20vh] items-center'}
          bg-[#050505]
        `}
            >
                {!isInteracting && (
                    <div className="text-center mb-12 animate-fade-in w-full max-w-2xl px-6 flex-none">
                        <div className="w-20 h-20 rounded-[2rem] bg-blue-600 mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">How can I assist you today?</h2>
                        <p className="text-white/20 text-sm font-medium tracking-widest uppercase">Direct Neural Interface Ready</p>
                    </div>
                )}

                <div className={`w-full flex-1 flex flex-col transition-all duration-700 h-full`}>
                    <div className={`flex-1 w-full overflow-hidden transition-all duration-500`}>
                        <EmployeeChat isEmbedded={true} onAction={() => setIsInteracting(true)} userName="Owner User" threadId="owner_chat" />
                    </div>
                </div>
            </div>


            {/* MOBILE CHAT OVERLAY */}
            <AnimatePresence>
                {showChatMobile && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed left-0 right-0 bottom-0 z-[100] bg-[#0A0A0B] md:hidden flex flex-col transition-all duration-300 ${isMobileExpanded ? 'h-full top-0' : 'h-[65vh]'}`}
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                <span className="font-bold text-white">AI Assistant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                                    className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white"
                                >
                                    {isMobileExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => setShowChatMobile(false)}
                                    className="p-2 rounded-xl bg-rose-500/10 text-rose-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden pb-32">
                            <EmployeeChat isEmbedded={true} onAction={() => { setIsInteracting(true); setIsMobileExpanded(true); }} userName="Owner User" threadId="owner_chat" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RIGHT SIDE: Tasks Board (Fixed 40% on Desktop) */}
            <div className="w-full md:w-[40%] border-l border-white/5 bg-[#080809] flex flex-col">
                <div className="p-6 md:p-8 flex-1 flex flex-col overflow-hidden">
                    <header className="mb-10 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-2">Operation Stream</span>
                            <h1 className="text-3xl font-black text-white tracking-tighter">LIVE BOARD</h1>
                        </div>

                        {/* Mobile Chat Button */}
                        <button
                            onClick={() => setShowChatMobile(true)}
                            className="md:hidden w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
                        >
                            <MessageSquare className="w-6 h-6" />
                        </button>
                    </header>

                    <div className="flex-1 flex flex-row md:flex-col gap-6 md:gap-8 overflow-x-auto md:overflow-y-auto pb-10 scrollbar-hide snap-x md:snap-none snap-mandatory">
                        <Column title="Done" tasks={tasks} status="Done" />
                        <Column title="To Do" tasks={tasks} status="To Do" />
                        <Column title="In Progress" tasks={tasks} status="In Progress" />
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
        </div>
    );
};

export default LiveOps;
