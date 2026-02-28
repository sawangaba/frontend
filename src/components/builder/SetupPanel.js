import React, { useState } from 'react';
import { Panel } from '@xyflow/react';
import { ChevronDown, ChevronRight, Settings, Users, User, Building2 } from 'lucide-react';
import useBuilderStore from '../../store/builderStore';
import { motion, AnimatePresence } from 'framer-motion';

const SetupPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('business'); // business, roles, personality

    const setup = useBuilderStore((state) => state.setup);
    const updateSetup = useBuilderStore((state) => state.updateSetup);

    const handleEmployeeCountChange = (count) => {
        const newCount = parseInt(count) || 0;
        const currentEmployees = setup.employees || [];
        let newEmployees = [...currentEmployees];

        if (newCount > currentEmployees.length) {
            // Add new empty slots
            for (let i = currentEmployees.length; i < newCount; i++) {
                newEmployees.push(`Employee ${i + 1}`);
            }
        } else {
            // Trim list
            newEmployees = newEmployees.slice(0, newCount);
        }

        updateSetup({ employeeCount: newCount, employees: newEmployees });
    };

    const handleEmployeeNameChange = (index, name) => {
        const newEmployees = [...setup.employees];
        newEmployees[index] = name;
        updateSetup({ employees: newEmployees });
    };

    const handleRoleUpdate = (roleName, field, value) => {
        const currentRoles = setup.roles || {};
        const updatedRoles = {
            ...currentRoles,
            [roleName]: {
                ...currentRoles[roleName],
                [field]: value
            }
        };
        updateSetup({ roles: updatedRoles });
    };

    const allRoles = ['Business Owner', ...setup.employees];

    return (
        <Panel position="top-left" className="m-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl w-80 overflow-hidden">
                {/* Header */}
                <div
                    className="p-3 bg-neutral-800 flex items-center justify-between cursor-pointer hover:bg-neutral-750 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-2 text-white font-medium">
                        <Settings size={18} className="text-blue-400" />
                        <span>System Setup</span>
                    </div>
                    {isOpen ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-neutral-800"
                        >
                            {/* Tabs */}
                            <div className="flex border-b border-neutral-800">
                                <button
                                    className={`flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === 'business' ? 'text-blue-400 bg-neutral-800' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    onClick={() => setActiveTab('business')}
                                >
                                    <Building2 size={14} /> Business
                                </button>
                                <button
                                    className={`flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === 'roles' ? 'text-red-400 bg-neutral-800' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    onClick={() => setActiveTab('roles')}
                                >
                                    <Users size={14} /> Roles
                                </button>
                                <button
                                    className={`flex-1 p-2 text-xs font-medium flex items-center justify-center gap-1 ${activeTab === 'personality' ? 'text-purple-400 bg-neutral-800' : 'text-neutral-500 hover:text-neutral-300'}`}
                                    onClick={() => setActiveTab('personality')}
                                >
                                    <User size={14} /> Personality
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">

                                {/* Business Tab */}
                                {activeTab === 'business' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-500 mb-1">Business Name</label>
                                            <input
                                                type="text"
                                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                                                value={setup.businessName}
                                                onChange={(e) => updateSetup({ businessName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-500 mb-1">Type</label>
                                            <select
                                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                                                value={setup.businessType}
                                                onChange={(e) => updateSetup({ businessType: e.target.value })}
                                            >
                                                <option value="Restaurant">Restaurant</option>
                                                <option value="Salon">Salon</option>
                                                <option value="Store">Store</option>
                                                <option value="Office">Office</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-500 mb-1">Employee Count</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                                                value={setup.employeeCount}
                                                onChange={(e) => handleEmployeeCountChange(e.target.value)}
                                            />
                                        </div>
                                        {setup.employees.length > 0 && (
                                            <div className="space-y-2 pl-2 border-l-2 border-neutral-800">
                                                {setup.employees.map((name, idx) => (
                                                    <div key={idx}>
                                                        <label className="block text-[10px] text-neutral-500">Employee {idx + 1}</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                                                            value={name}
                                                            onChange={(e) => handleEmployeeNameChange(idx, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Roles Tab */}
                                {activeTab === 'roles' && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-neutral-400">Define permissions for each person.</p>
                                        {allRoles.map((role) => (
                                            <div key={role} className="p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                                                <h3 className="text-sm font-medium text-white mb-2">{role}</h3>
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                                        placeholder="Can ask..."
                                                        value={setup.roles[role]?.ask || ''}
                                                        onChange={(e) => handleRoleUpdate(role, 'ask', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-red-500"
                                                        placeholder="Cannot ask..."
                                                        value={setup.roles[role]?.forbid || ''}
                                                        onChange={(e) => handleRoleUpdate(role, 'forbid', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Personality Tab */}
                                {activeTab === 'personality' && (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                                <span>Strict</span>
                                                <span>Friendly</span>
                                            </div>
                                            <input
                                                type="range"
                                                className="w-full"
                                                value={setup.personality.tone}
                                                onChange={(e) => updateSetup({ personality: { ...setup.personality, tone: parseInt(e.target.value) } })}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                                <span>Reactive</span>
                                                <span>Proactive</span>
                                            </div>
                                            <input
                                                type="range"
                                                className="w-full"
                                                value={setup.personality.proactive}
                                                onChange={(e) => updateSetup({ personality: { ...setup.personality, proactive: parseInt(e.target.value) } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-500 mb-1">Description</label>
                                            <textarea
                                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none min-h-[100px]"
                                                value={setup.personality.description}
                                                onChange={(e) => updateSetup({ personality: { ...setup.personality, description: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Panel>
    );
};

export default SetupPanel;
