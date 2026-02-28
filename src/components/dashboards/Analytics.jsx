import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Users, TrendingUp, Activity } from 'lucide-react';

const revenueData = [
    { name: 'Mon', actual: 4000, predicted: 4400 },
    { name: 'Tue', actual: 3000, predicted: 3200 },
    { name: 'Wed', actual: 5000, predicted: 4800 },
    { name: 'Thu', actual: 4500, predicted: 5000 },
    { name: 'Fri', actual: 6000, predicted: 5800 },
    { name: 'Sat', actual: 8000, predicted: 7500 },
    { name: 'Sun', actual: 7500, predicted: 7800 },
];

const taskData = [
    { name: 'Kitchen', completed: 45 },
    { name: 'Service', completed: 60 },
    { name: 'Cleaning', completed: 30 },
    { name: 'Prep', completed: 55 },
];

const employeeData = [
    { name: 'Morning', value: 12 },
    { name: 'Evening', value: 18 },
    { name: 'Night', value: 8 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-sm"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${colorClass}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <h3 className="text-white/40 text-[11px] font-black tracking-widest uppercase mb-1">{title}</h3>
            <p className="text-4xl font-black text-white">{value}</p>
        </div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0A0A0B] border border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
                <p className="text-white/80 font-bold mb-3 text-sm">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm mb-1.5 last:mb-0">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-white/40 flex-1">{entry.name}:</span>
                        <span className="text-white font-black">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const Analytics = () => {
    return (
        <div className="p-6 pb-32 md:p-8 md:pb-8 min-h-[100dvh] bg-[#050505]">
            <header className="mb-10 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Live Insights</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">ANALYTICS</h1>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value="$38.4k" icon={TrendingUp} trend={12.5} colorClass="bg-gradient-to-tr from-blue-600 to-blue-400 shadow-lg shadow-blue-500/20" />
                <StatCard title="Tasks Completed" value="190" icon={CheckCircle2} trend={5.2} colorClass="bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20" />
                <StatCard title="Active Employees" value="38" icon={Users} trend={-2.1} colorClass="bg-gradient-to-tr from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-500/20" />
                <StatCard title="AI Efficiency" value="98%" icon={Activity} trend={0.5} colorClass="bg-gradient-to-tr from-rose-600 to-rose-400 shadow-lg shadow-rose-500/20" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/5 rounded-3xl p-6 lg:p-8 col-span-1 lg:col-span-2 shadow-2xl backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-white text-xl font-bold">Revenue vs AI Predict</h3>
                            <p className="text-white/40 text-sm font-medium mt-1">Weekly projection vs actual performance</p>
                        </div>
                        <select className="bg-black/20 border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-blue-500/50 transition-colors">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff40" axisLine={false} tickLine={false} dy={10} fontSize={12} fontWeight={600} />
                                <YAxis stroke="#ffffff40" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} dx={-10} fontSize={12} fontWeight={600} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 2 }} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                                <Line
                                    type="monotone"
                                    dataKey="actual"
                                    name="Actual Revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    dot={{ r: 5, fill: "#0A0A0B", strokeWidth: 3, stroke: "#3b82f6" }}
                                    activeDot={{ r: 8, fill: "#3b82f6", strokeWidth: 0 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="predicted"
                                    name="AI Predicted"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    strokeDasharray="6 6"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Tasks Bar Chart & Staff Pie Chart Container */}
                <div className="col-span-1 flex flex-col gap-6">
                    {/* Tasks Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-sm flex-1"
                    >
                        <h3 className="text-white text-lg font-bold mb-6">Tasks by Dept</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={taskData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#ffffff40" axisLine={false} tickLine={false} fontSize={10} fontWeight={600} dy={10} />
                                    <YAxis stroke="#ffffff40" axisLine={false} tickLine={false} fontSize={10} fontWeight={600} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff02' }} />
                                    <Bar dataKey="completed" name="Tasks" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Employee Shifts Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-sm flex-1"
                    >
                        <h3 className="text-white text-lg font-bold mb-4">Staff Shifts</h3>
                        <div className="h-[200px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={employeeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {employeeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" verticalAlign="middle" layout="vertical" align="right" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
