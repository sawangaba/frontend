import React from 'react';
import {
    Database,
    Zap,
    GitFork,
    PlayCircle,
    MessageSquare,
    HardDrive,
    Signpost
} from 'lucide-react';
import DraggableNode from './DraggableNode';

const LeftSidebar = () => {
    return (
        <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0 z-10">
            <div className="p-4 border-b border-neutral-800">
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Components</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 mt-2">Flow</div>
                <DraggableNode
                    type="collector"
                    label="Info Collector"
                    icon={Database}
                    description="Ask questions to staff."
                />
                <DraggableNode
                    type="trigger"
                    label="Trigger"
                    icon={Zap}
                    description="When to act."
                />
                <DraggableNode
                    type="decision"
                    label="Decision / Rule"
                    icon={GitFork}
                    description="Conditional logic."
                />
                <DraggableNode
                    type="action"
                    label="Action"
                    icon={PlayCircle}
                    description="Perform tasks."
                />
                <DraggableNode
                    type="channel"
                    label="Channel"
                    icon={MessageSquare}
                    description="Communication method."
                />
                <DraggableNode
                    type="memory"
                    label="Memory"
                    icon={HardDrive}
                    description="Store data."
                />
                <DraggableNode
                    type="router"
                    label="Router"
                    icon={Signpost}
                    description="Route flow."
                />
            </div>
        </aside>
    );
};

export default LeftSidebar;
