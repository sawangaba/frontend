import React from 'react';
import TopBar from './TopBar';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Canvas from './Canvas';
import { ReactFlowProvider } from '@xyflow/react';

const BuilderLayout = () => {
    return (
        <div className="flex flex-col h-screen w-screen bg-neutral-900 text-neutral-100 overflow-hidden font-sans">
            {/* Top Bar */}
            <TopBar />

            {/* Main Workspace */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <LeftSidebar />

                {/* Canvas Area */}
                <div className="flex-1 relative bg-neutral-950">
                    <ReactFlowProvider>
                        <Canvas />
                    </ReactFlowProvider>
                </div>

                {/* Right Sidebar */}
                <RightSidebar />
            </div>
        </div>
    );
};

export default BuilderLayout;
