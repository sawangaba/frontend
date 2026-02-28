import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import useBuilderStore from '../../../store/builderStore';

const BaseNode = ({ data, selected, children, color = 'blue', icon: Icon, title, isGlobal = false, id }) => {
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const borderColor = selected ? 'border-white' : 'border-neutral-700';
    const shadow = selected ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'shadow-lg';

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteNode(id);
    };

    const colorMap = {
        purple: 'bg-purple-500',
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
    };

    const accentColor = colorMap[color] || 'bg-neutral-500';

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`min-w-[200px] bg-neutral-900 rounded-xl border ${borderColor} ${shadow} overflow-hidden group transition-colors`}
        >
            {/* Header */}
            <div className="h-2 w-full bg-neutral-800 relative overflow-hidden">
                <div className={`absolute top-0 left-0 h-full w-full ${accentColor} opacity-80`} />
            </div>

            {/* Delete Button - Always visible on hover or selected */}
            <button
                onClick={handleDelete}
                className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-all z-50 ${selected ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'}`}
            >
                <X size={12} />
            </button>

            <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${accentColor} bg-opacity-20 text-${color}-400`}>
                        {Icon && <Icon size={16} className="text-white" />}
                    </div>
                    <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
                </div>

                <div className="text-xs text-neutral-400">
                    {children}
                </div>
            </div>

            {/* Handles - Fixed size to prevent flickering */}
            {!isGlobal && (
                <>
                    <Handle
                        type="target"
                        position={Position.Left}
                        className="!w-3 !h-3 !bg-neutral-600 !border-2 !border-neutral-900 hover:!bg-white transition-colors"
                    />
                    <Handle
                        type="source"
                        position={Position.Right}
                        className="!w-3 !h-3 !bg-neutral-600 !border-2 !border-neutral-900 hover:!bg-white transition-colors"
                    />
                </>
            )}
        </motion.div>
    );
};

export default memo(BaseNode);
