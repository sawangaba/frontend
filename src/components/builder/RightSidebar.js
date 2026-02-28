import React from 'react';
import useBuilderStore from '../../store/builderStore';
import { motion, AnimatePresence } from 'framer-motion';
import MultiSelect from './MultiSelect';

const RightSidebar = () => {
    const selectedNode = useBuilderStore((state) => state.selectedNode);
    const nodes = useBuilderStore((state) => state.nodes);
    const updateNodeData = useBuilderStore((state) => state.updateNodeData);
    const setup = useBuilderStore((state) => state.setup);

    const node = nodes.find((n) => n.id === selectedNode);

    const handleChange = (field, value) => {
        if (node) {
            updateNodeData(node.id, { [field]: value });
        }
    };

    const employeeOptions = ['Business Owner', ...setup.employees];

    if (!node) {
        return (
            <aside className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0 z-10 p-6 items-center justify-center text-neutral-500">
                <p>Select a node to edit properties</p>
            </aside>
        );
    }

    return (
        <aside className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col shrink-0 z-10 overflow-y-auto">
            <div className="p-4 border-b border-neutral-800">
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Properties</h2>
                <div className="mt-2 text-xs text-neutral-500 font-mono">{node.type}</div>
            </div>

            <div className="p-4 space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Collector Node Form */}
                        {node.type === 'collector' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Info Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.infoName || ''}
                                        onChange={(e) => handleChange('infoName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Who to Ask</label>
                                    <MultiSelect
                                        options={employeeOptions}
                                        value={node.data.target}
                                        onChange={(val) => handleChange('target', val)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Question</label>
                                    <textarea
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. Is anything running low?"
                                        value={node.data.question || ''}
                                        onChange={(e) => handleChange('question', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Answer Type</label>
                                    <select
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.answerType || 'Text'}
                                        onChange={(e) => handleChange('answerType', e.target.value)}
                                    >
                                        <option value="Text">Text</option>
                                        <option value="Number">Number</option>
                                        <option value="Yes/No">Yes/No</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Trigger Node Form */}
                        {node.type === 'trigger' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Type</label>
                                    <select
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.triggerType || 'Time'}
                                        onChange={(e) => handleChange('triggerType', e.target.value)}
                                    >
                                        <option value="Time">Time-based</option>
                                        <option value="Event">Event-based</option>
                                        <option value="Conditional">Conditional</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Detail</label>
                                    <input
                                        type="text"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. Daily at 9PM or Shift End"
                                        value={node.data.time || ''}
                                        onChange={(e) => handleChange('time', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Decision Node Form */}
                        {node.type === 'decision' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Condition</label>
                                    <textarea
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. If sales < yesterday"
                                        value={node.data.condition || ''}
                                        onChange={(e) => handleChange('condition', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Node Form */}
                        {node.type === 'action' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Action Type</label>
                                    <select
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.actionType || 'Notify'}
                                        onChange={(e) => handleChange('actionType', e.target.value)}
                                    >
                                        <option value="Notify">Notify Owner</option>
                                        <option value="Ask">Ask Question</option>
                                        <option value="Task">Create Task</option>
                                        <option value="Report">Generate Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Target</label>
                                    <MultiSelect
                                        options={employeeOptions}
                                        value={node.data.target}
                                        onChange={(val) => handleChange('target', val)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Message Style</label>
                                    <select
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.style || 'Short'}
                                        onChange={(e) => handleChange('style', e.target.value)}
                                    >
                                        <option value="Short">Short</option>
                                        <option value="Detailed">Detailed</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Channel Node Form */}
                        {node.type === 'channel' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Preferred Channel</label>
                                    <select
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.channel || 'Chat'}
                                        onChange={(e) => handleChange('channel', e.target.value)}
                                    >
                                        <option value="Chat">Chat</option>
                                        <option value="Voice">Voice</option>
                                        <option value="Notification">Notification</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Urgency</label>
                                    <select
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.urgency || 'Normal'}
                                        onChange={(e) => handleChange('urgency', e.target.value)}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Memory Node Form */}
                        {node.type === 'memory' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Label</label>
                                    <input
                                        type="text"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.label || ''}
                                        onChange={(e) => handleChange('label', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Schema (comma separated)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. item, count, date"
                                        value={Array.isArray(node.data.schema) ? node.data.schema.join(', ') : (node.data.schema || '')}
                                        onChange={(e) => handleChange('schema', e.target.value.split(',').map(s => s.trim()))}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Router Node Form */}
                        {node.type === 'router' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Label</label>
                                    <input
                                        type="text"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        value={node.data.label || ''}
                                        onChange={(e) => handleChange('label', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-500 mb-1">Routes (comma separated keys)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. urgent, normal"
                                        value={node.data.routes ? Object.keys(node.data.routes).join(', ') : ''}
                                        onChange={(e) => {
                                            const routes = {};
                                            e.target.value.split(',').forEach(k => routes[k.trim()] = '');
                                            handleChange('routes', routes);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </aside>
    );
};

export default RightSidebar;
