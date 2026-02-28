import React from 'react';
// The plan said "Sidebar: Items are HTML5 draggable". So I'll use standard HTML5 draggable.

const DraggableNode = ({ type, label, icon: Icon, description }) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg cursor-grab hover:bg-neutral-750 hover:border-neutral-600 transition-all group"
            onDragStart={(event) => onDragStart(event, type)}
            draggable
        >
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-neutral-700 rounded-md text-neutral-300 group-hover:text-white group-hover:bg-neutral-600 transition-colors">
                    <Icon size={18} />
                </div>
                <span className="font-medium text-neutral-200 text-sm">{label}</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
        </div>
    );
};

export default DraggableNode;
