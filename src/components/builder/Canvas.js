import React, { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useBuilderStore from '../../store/builderStore';
import BusinessNode from './nodes/BusinessNode';
import RolesNode from './nodes/RolesNode';
import PersonalityNode from './nodes/PersonalityNode';
import CollectorNode from './nodes/CollectorNode';
import TriggerNode from './nodes/TriggerNode';
import DecisionNode from './nodes/DecisionNode';
import ActionNode from './nodes/ActionNode';
import ChannelNode from './nodes/ChannelNode';
import MemoryNode from './nodes/MemoryNode';
import RouterNode from './nodes/RouterNode';
import SetupPanel from './SetupPanel';
import AIFlowBuilder from './AIFlowBuilder';

const nodeTypes = {
    business: BusinessNode,
    roles: RolesNode,
    personality: PersonalityNode,
    collector: CollectorNode,
    trigger: TriggerNode,
    decision: DecisionNode,
    action: ActionNode,
    channel: ChannelNode,
    memory: MemoryNode,
    router: RouterNode,
};

const Canvas = () => {
    const nodes = useBuilderStore((state) => state.nodes);
    const edges = useBuilderStore((state) => state.edges);
    const onNodesChange = useBuilderStore((state) => state.onNodesChange);
    const onEdgesChange = useBuilderStore((state) => state.onEdgesChange);
    const onConnect = useBuilderStore((state) => state.onConnect);
    const addNode = useBuilderStore((state) => state.addNode);
    const setSelectedNode = useBuilderStore((state) => state.setSelectedNode);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = {
                x: event.clientX - 300,
                y: event.clientY - 60,
            };

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: { label: `${type} node` },
            };

            addNode(newNode);
        },
        [addNode]
    );

    const onNodeClick = (event, node) => {
        setSelectedNode(node.id);
    };

    const onPaneClick = () => {
        setSelectedNode(null);
    };

    return (
        <div className="flex-1 h-full bg-neutral-950 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-neutral-950"
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#262626" gap={16} />
                <Controls
                    className="!bg-neutral-800 !border-neutral-700 [&>button]:!fill-neutral-400 [&>button]:!border-neutral-700 hover:[&>button]:!bg-neutral-700"
                />
                <MiniMap
                    className="!bg-neutral-900 !border-neutral-800"
                    maskColor="rgba(0, 0, 0, 0.6)"
                    nodeColor="#404040"
                />
                <SetupPanel />
                <AIFlowBuilder />
            </ReactFlow>
        </div>
    );
};

export default Canvas;
