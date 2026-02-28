import React, { useState } from 'react';
import { Panel } from '@xyflow/react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIFlowBuilder = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setPrompt('');
            setIsOpen(false);
            alert('AI Flow Generation simulated!');
        }, 1500);
    };

    return (
        <Panel position="bottom-center" className="m-4 z-50 flex flex-col items-center justify-end">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.button
                        key="button"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-colors font-medium"
                    >
                        <Sparkles size={16} />
                        <span>Generate Flow with AI</span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-4 w-[400px] relative"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-neutral-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-3 text-blue-400 font-medium">
                            <Sparkles size={16} />
                            <h3>AI Flow Builder</h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <textarea
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors resize-none mb-3"
                                rows={3}
                                placeholder="Describe the flow..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={isGenerating}
                            />

                            <button
                                type="submit"
                                disabled={isGenerating || !prompt.trim()}
                                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${isGenerating
                                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                                    }`}
                            >
                                {isGenerating ? (
                                    <span>Generating...</span>
                                ) : (
                                    <>
                                        <span>Generate Flow</span>
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </Panel>
    );
};

export default AIFlowBuilder;
