import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Package, Search, Loader2, Sparkles } from 'lucide-react';

// --- Micro-UI Components ---

export const StockCheckUI = ({ onAction }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = () => {
        if (query.trim()) {
            onAction(`Stock Check: ${query}`);
            setQuery('');
        }
    };

    return (
        <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-semibold text-white">Stock Check</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">Enter SKU or item name to check availability.</p>
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Search inventory..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all text-white placeholder-gray-500"
                />
                <button
                    onClick={handleSubmit}
                    className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export const MessageOwnerUI = ({ onAction }) => {
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('Normal');

    const handleSubmit = () => {
        if (message.trim()) {
            onAction(`Notify owner with ${priority} priority: ${message}`);
            setMessage('');
            setPriority('Normal');
        }
    };

    return (
        <div className="space-y-4 py-2 mt-2 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center">
                        <Send className="w-4 h-4 text-rose-400" />
                    </div>
                    <span className="font-semibold text-white">Message Owner</span>
                </div>
            </div>
            <p className="text-sm text-gray-400 font-medium">Direct emergency broadcast to operations dashboard.</p>

            <div className="space-y-2">
                <div className="flex gap-2">
                    {['Low', 'Normal', 'High', 'Critical'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPriority(p)}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition-colors ${priority === p
                                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="relative group">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="Type message to Owner..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/40 transition-all text-white placeholder-gray-500"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!message.trim()}
                        className="absolute right-2 top-1.5 p-1.5 bg-rose-600 disabled:bg-white/5 text-white disabled:text-white/20 rounded-lg hover:bg-rose-700 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Chat Sub-components ---

const MessageBubble = ({ message, isAI, isMicroUI = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
        <div
            className={`max-w-[85%] px-4 py-3 rounded-2xl ${isAI
                ? 'bg-white/5 text-white border border-white/5'
                : 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                } ${isMicroUI ? 'p-4 w-full' : ''}`}
        >
            <div className="text-[14px] leading-relaxed font-medium">
                {message}
            </div>
        </div>
    </motion.div>
);

const EmployeeChat = ({ isEmbedded = false, onAction, user = { name: 'sawan' }, threadId = 'general_chat', userName = 'sawan' }) => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef(null);

    const handleMicroUIAction = (text) => {
        handleSend(text);
        if (onAction) onAction(text);
    };

    const [messages, setMessages] = useState([
        { id: 0, isAI: true, content: "Live assist online. How can I help?" },
        {
            id: 1, isAI: true, content: (
                <>
                    <StockCheckUI onAction={handleMicroUIAction} />
                    {userName !== "Owner User" && <MessageOwnerUI onAction={handleMicroUIAction} />}
                </>
            ), isMicroUI: true
        }
    ]);

    // Fetch message history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/employee/messages?thread_id=${threadId}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    const mappedMessages = data.map(msg => ({
                        id: msg.id + 100, // offset id
                        isAI: msg.sender_name === 'AI Manager',
                        content: msg.message_text
                    }));
                    // Keep the initial intro and micro ui
                    setMessages(prev => [...prev.slice(0, 2), ...mappedMessages]);
                }
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };
        fetchHistory();
    }, [threadId]);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        if (recognition) {
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
        }
    }, [recognition]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSend = async (text = input) => {
        const finalMsg = typeof text === 'string' ? text : input;
        if (!finalMsg.trim()) return;

        // Trigger interaction detection in parent
        if (onAction) onAction();

        const userMessage = { id: Date.now(), isAI: false, content: finalMsg };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:8000/api/employee/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_name: userName,
                    message_text: finalMsg,
                    thread_id: threadId
                })
            });

            const data = await response.json();

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    isAI: true,
                    content: data.message || "Connection difficulty detected."
                }]);
                setIsTyping(false);
            }, 600);

        } catch (error) {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    isAI: true,
                    content: "Connection difficulty detected."
                }]);
                setIsTyping(false);
            }, 600);
        }
    };

    const toggleListening = () => {
        if (!recognition) return;
        if (isListening) {
            recognition.stop();
        } else {
            setIsListening(true);
            recognition.start();
        }
    };

    return (
        <div className={`flex flex-col h-full bg-transparent overflow-hidden relative`}>
            {/* Chat Area */}
            <div ref={scrollRef} className={`flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide`}>
                <div className="max-w-2xl mx-auto">
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg.content}
                            isAI={msg.isAI}
                            isMicroUI={msg.isMicroUI}
                        />
                    ))}
                    {isTyping && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-2">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <footer className={`p-4 bg-black/20 backdrop-blur-lg border-t border-white/5`}>
                <div className="max-w-2xl mx-auto flex items-center gap-2">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? "Listening..." : "Message assistant..."}
                            className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm focus:ring-1 focus:ring-blue-500/30 transition-all font-medium text-white placeholder-gray-500 shadow-inner`}
                        />
                        <button
                            onClick={() => handleSend()}
                            className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg transition-all ${input.trim() ? 'bg-blue-600 text-white cursor-pointer active:scale-95' : 'bg-transparent text-white/5'}`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>

                    <motion.button
                        onClick={toggleListening}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isListening ? 'bg-blue-600 border-blue-400 text-white animate-pulse' : 'bg-white/5 border-white/10 text-gray-400'}`}
                    >
                        <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
                    </motion.button>
                </div>
            </footer>
        </div>
    );
};

export default EmployeeChat;
