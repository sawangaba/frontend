import { create } from 'zustand';
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
} from '@xyflow/react';

const useBuilderStore = create((set, get) => ({
    nodes: [],
    edges: [],
    selectedNode: null,

    setup: {
        businessName: '',
        businessType: 'Restaurant',
        hours: '',
        employeeCount: 0,
        employees: [],
        roles: {
            owner: { ask: '', forbid: '' },
            manager: { ask: '', forbid: '' },
            employee: { ask: '', forbid: '' },
        },
        personality: {
            tone: 50,
            proactive: 50,
            authority: 50,
            description: '',
        },
    },

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node],
        });
    },
    deleteNode: (nodeId) => {
        set({
            nodes: get().nodes.filter((n) => n.id !== nodeId),
            edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
            selectedNode: get().selectedNode === nodeId ? null : get().selectedNode,
        });
    },
    updateSetup: (data) => {
        set({
            setup: { ...get().setup, ...data },
        });
    },
    setNodes: (nodes) => {
        set({ nodes });
    },
    setEdges: (edges) => {
        set({ edges });
    },
    loadFlow: (flow) => {
        set({
            nodes: flow.nodes || [],
            edges: flow.edges || [],
            setup: flow.setup || get().setup,
        });
    },
    updateNodeData: (nodeId, data) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...data } };
                }
                return node;
            }),
        });
    },
    setSelectedNode: (nodeId) => {
        set({ selectedNode: nodeId });
    },
    exportJson: () => {
        const { nodes, edges, setup } = get();
        return JSON.stringify({ nodes, edges, setup }, null, 2);
    },
}));

export default useBuilderStore;
