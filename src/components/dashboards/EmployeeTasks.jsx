import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Play } from 'lucide-react';

const EmployeeTasks = () => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/employee/tasks?employee_name=sawan');
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error("Failed to fetch employee tasks", err);
        }
    };

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 2000); // Live poll
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await fetch(`http://localhost:8000/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchTasks(); // instantly refresh
        } catch (err) {
            console.error("Failed to update task", err);
        }
    };

    return (
        <div className="h-full w-full bg-[#050505] p-6 overflow-y-auto">
            <header className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 block mb-2">My Terminal</span>
                <h1 className="text-3xl font-black text-white tracking-tighter">Assigned Tasks</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {tasks.map((task) => {
                        const isDone = task.status?.toLowerCase() === 'done';
                        const inProgress = task.status?.toLowerCase() === 'in progress';

                        return (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`p-5 rounded-2xl border transition-all ${isDone ? 'bg-emerald-500/10 border-emerald-500/20 opacity-50' :
                                        inProgress ? 'bg-blue-500/10 border-blue-500/30' :
                                            'bg-white/5 border-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.priority?.toLowerCase() === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white/50'
                                        }`}>
                                        {task.priority || 'Normal'}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase ${isDone ? 'text-emerald-400' : inProgress ? 'text-blue-400' : 'text-white/30'}`}>
                                        {task.status || 'To Do'}
                                    </span>
                                </div>
                                <h3 className="text-white/90 font-semibold mb-4 text-sm leading-relaxed">{task.title}</h3>

                                <div className="flex gap-2 mt-auto">
                                    {!inProgress && !isDone && (
                                        <button
                                            onClick={() => updateStatus(task.id, 'In Progress')}
                                            className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                                        >
                                            <Play className="w-3 h-3" /> Start
                                        </button>
                                    )}
                                    {!isDone && (
                                        <button
                                            onClick={() => updateStatus(task.id, 'Done')}
                                            className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                                        >
                                            <Check className="w-3 h-3" /> Mark Done
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                {tasks.length === 0 && (
                    <div className="col-span-full p-10 text-center text-white/20 border border-white/5 bg-white/5 rounded-2xl border-dashed">
                        No active tasks found in the database.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeTasks;
