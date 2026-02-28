import React, { useRef } from 'react';
import { Save, Download, Play, Upload, Layout, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useBuilderStore from '../../store/builderStore';
import dagre from 'dagre';

const TopBar = () => {
    const navigate = useNavigate();
    const exportJson = useBuilderStore((state) => state.exportJson);
    const loadFlow = useBuilderStore((state) => state.loadFlow);
    const nodes = useBuilderStore((state) => state.nodes);
    const edges = useBuilderStore((state) => state.edges);
    const setNodes = useBuilderStore((state) => state.setNodes);
    const fileInputRef = useRef(null);

    const handleExport = () => {
        const json = exportJson();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-partner-flow.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportFormatted = () => {
        // Deep clone to avoid mutating the actual ReactFlow state
        const formattedNodes = JSON.parse(JSON.stringify(nodes)).map(node => {
            delete node.position;
            delete node.measured;
            delete node.selected;
            delete node.dragging;
            return node;
        });

        const formattedEdges = JSON.parse(JSON.stringify(edges)).map(edge => {
            delete edge.id;
            // Optionally delete other reactflow specific fields from edges if needed
            delete edge.selected;
            return edge;
        });

        const formattedData = {
            setup: useBuilderStore.getState().setup,
            nodes: formattedNodes,
            edges: formattedEdges
        };

        const json = JSON.stringify(formattedData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-partner-formatted.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const flow = JSON.parse(event.target.result);
                loadFlow(flow);
            } catch (error) {
                console.error('Failed to parse JSON', error);
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
        e.target.value = null; // Reset
    };

    const handleAutoLayout = () => {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        dagreGraph.setGraph({ rankdir: 'LR' });

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: 200, height: 100 }); // Approx size
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        const layoutedNodes = nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            return {
                ...node,
                position: {
                    x: nodeWithPosition.x - 100,
                    y: nodeWithPosition.y - 50,
                },
            };
        });

        setNodes(layoutedNodes);
    };

    const handleSaveTemplate = () => {
        const name = prompt('Enter template name:');
        if (name) {
            const json = exportJson();
            localStorage.setItem(`template_${name}`, json);
            alert('Template saved!');
        }
    };

    const handleLoadTemplate = () => {
        const templates = Object.keys(localStorage).filter(k => k.startsWith('template_'));
        if (templates.length === 0) {
            alert('No templates found');
            return;
        }

        const name = prompt(`Available templates:\n${templates.map(t => t.replace('template_', '')).join('\n')}\n\nEnter name to load:`);
        if (name) {
            const json = localStorage.getItem(`template_${name}`);
            if (json) {
                loadFlow(JSON.parse(json));
            } else {
                alert('Template not found');
            }
        }
    };

    return (
        <div className="h-14 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-4 shrink-0 z-10">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/developer')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                    title="Back to Developer Hub"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    style={{ display: 'none' }}
                />

                <button
                    onClick={handleImportClick}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                >
                    <Upload size={16} />
                    <span>Import</span>
                </button>

                <button
                    onClick={handleAutoLayout}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                >
                    <Layout size={16} />
                    <span>Fix Canvas</span>
                </button>

                <div className="h-6 w-px bg-neutral-700 mx-1"></div>

                <button
                    onClick={handleSaveTemplate}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                >
                    <Save size={16} />
                    <span>Save Tmpl</span>
                </button>

                <button
                    onClick={handleLoadTemplate}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                >
                    <FileText size={16} />
                    <span>Load Tmpl</span>
                </button>

                <div className="h-6 w-px bg-neutral-700 mx-1"></div>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                >
                    <Download size={16} />
                    <span>Raw JSON</span>
                </button>
                <button
                    onClick={handleExportFormatted}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-300 hover:text-white hover:bg-emerald-900/50 rounded transition-colors"
                >
                    <FileText size={16} />
                    <span>Formatted JSON</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded shadow-sm transition-colors ml-2">
                    <Play size={16} />
                    <span>Preview</span>
                </button>
            </div>
        </div>
    );
};

export default TopBar;
