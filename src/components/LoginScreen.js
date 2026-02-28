import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedBackgrounds from './AdvancedBackgrounds';
import { Sun, Moon, Palette } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({ email: '', password: '', role: 'employee' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Background & Theme State
    const [bgMode, setBgMode] = useState('neural'); // DEFAULT: NET
    const [chaosSeed, setChaosSeed] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    // Theme State
    const [theme, setTheme] = useState({
        primary: '#ffffff',
        background: '#000000',
        solidBackground: '#000000', // New: For opaque elements
        isDark: true
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        const endpoint = mode === 'login' ? '/api/login' : '/api/signup';

        try {
            const res = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                if (mode === 'signup') {
                    setSuccessMsg('ID Created. Please Authenticate.');
                    setMode('login');
                    setFormData({ email: formData.email, password: '', role: 'employee' });
                    setLoading(false);
                } else {
                    setIsLoggingIn(true);
                    setIsExiting(true);
                    setTimeout(() => {
                        onLogin(data);
                    }, 600);
                }
            } else {
                setError(data.detail || 'Authentication failed');
                setLoading(false);
            }
        } catch (err) {
            setError('Server error. Check connection.');
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError('');
        setSuccessMsg('');
        setFormData({ email: '', password: '', role: 'employee' });
    };

    const handleChaosClick = () => {
        setBgMode('chaos');
        setChaosSeed(prev => prev + 1);
    };

    const toggleTheme = () => {
        if (theme.isDark) {
            setTheme({
                primary: '#000000',
                background: '#ffffff',
                solidBackground: '#ffffff',
                isDark: false
            });
        } else {
            setTheme({
                primary: '#ffffff',
                background: '#000000',
                solidBackground: '#000000',
                isDark: true
            });
        }
    };

    // --- SMART COLOR GENERATION ---
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getBrightness = (hex) => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
    };

    const generateRandomTheme = () => {
        let bg1 = getRandomColor();
        let bg2 = getRandomColor();

        let attempts = 0;
        while (Math.abs(getBrightness(bg1) - getBrightness(bg2)) < 40 && attempts < 5) {
            bg2 = getRandomColor();
            attempts++;
        }

        const isGradient = Math.random() > 0.5;
        let bg;
        let avgBrightness;

        if (isGradient) {
            const angle = Math.floor(Math.random() * 360);
            bg = `linear-gradient(${angle}deg, ${bg1}, ${bg2})`;
            avgBrightness = (getBrightness(bg1) + getBrightness(bg2)) / 2;
        } else {
            bg = bg1;
            avgBrightness = getBrightness(bg1);
        }

        let primary = getRandomColor();
        let primaryBrightness = getBrightness(primary);

        attempts = 0;
        while (Math.abs(primaryBrightness - avgBrightness) < 120 && attempts < 20) {
            primary = getRandomColor();
            primaryBrightness = getBrightness(primary);
            attempts++;
        }

        if (Math.abs(primaryBrightness - avgBrightness) < 120) {
            primary = avgBrightness < 128 ? '#ffffff' : '#000000';
        }

        setTheme({
            primary: primary,
            background: bg,
            solidBackground: bg1, // Use the first color as the solid fallback
            isDark: avgBrightness < 128
        });
    };

    const inputStyle = {
        padding: '12px',
        borderRadius: '5px',
        border: `1px solid ${theme.primary}`,
        backgroundColor: theme.solidBackground, // STRICT: From theme only, opaque
        color: theme.primary,
        fontSize: '1rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 25
    };

    const letterStyle = {
        fontWeight: '900',
        color: theme.primary,
        letterSpacing: '-10px',
        margin: 0,
        lineHeight: 0.8
    };

    const btnStyle = (active) => ({
        padding: '8px 16px',
        // STRICT: No extra colors. Active = Primary, Inactive = Transparent (or Solid BG)
        background: active ? theme.primary : 'transparent',
        border: `1px solid ${theme.primary}`,
        color: active ? theme.solidBackground : theme.primary,
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        backdropFilter: 'blur(5px)',
        transition: 'all 0.3s',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    });

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: theme.background,
            overflow: 'hidden',
            fontFamily: "sans-serif",
            position: 'relative',
            transition: 'background 0.5s ease'
        }}>
            {/* Dynamic Styles for Placeholder */}
            <style>
                {`
                    .custom-input::placeholder {
                        color: ${theme.primary};
                        opacity: 0.6;
                    }
                `}
            </style>

            {/* Advanced Background with Warp State */}
            <AdvancedBackgrounds mode={bgMode} theme={theme} chaosSeed={chaosSeed} isExiting={isExiting} />

            {/* Flash Overlay */}
            <AnimatePresence>
                {isExiting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }} // Flash
                        transition={{ duration: 0.5, times: [0, 0.8, 1] }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: theme.primary,
                            zIndex: 9999,
                            pointerEvents: 'none'
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Top Right Controls */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 100 }}>
                <button onClick={generateRandomTheme} style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer' }} title="Random Color Theme">
                    <Palette size={24} />
                </button>
                <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer' }} title="Toggle Light/Dark Mode">
                    {theme.isDark ? <Sun size={24} /> : <Moon size={24} />}
                </button>
            </div>

            {/* Background Controls */}
            {!isExiting && (
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '90%',
                    gap: '10px',
                    zIndex: 50
                }}>
                    {['neural', 'constellation', 'quantum', 'net'].map((m) => (
                        <button key={m} onClick={() => setBgMode(m)} style={btnStyle(bgMode === m)}>
                            {m}
                        </button>
                    ))}
                    <button onClick={handleChaosClick} style={btnStyle(bgMode === 'chaos')}>
                        CHAOS
                    </button>
                </div>
            )}

            {/* Logo Container */}
            <motion.div
                animate={isLoggingIn ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute top-[35%] w-full flex justify-center items-center gap-2 md:gap-5 z-10"
            >
                <h1 style={letterStyle} className="text-7xl md:text-9xl">K</h1>

                {/* Desktop 3D Earth 'O' */}
                <div
                    className="hidden md:block relative rounded-full"
                    style={{
                        width: '120px', height: '120px',
                        backgroundColor: 'rgba(128,128,128,0.2)', perspective: '500px',
                        boxShadow: `0 0 30px ${theme.primary}, inset 0 0 20px rgba(0,0,0,0.5)`
                    }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0) 60%)', zIndex: 5, pointerEvents: 'none' }} />
                    <motion.div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
                        <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: isExiting ? 2 : 20 }}
                            style={{ display: 'flex', height: '100%', width: '200%' }}
                        >
                            {[0, 1].map(i => (
                                <div key={i} style={{ width: '50%', height: '100%', backgroundColor: theme.background.includes('gradient') ? 'transparent' : theme.background }}>
                                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <pattern id={`grid-${i}`} width="10" height="10" patternUnits="userSpaceOnUse">
                                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={theme.primary} strokeOpacity="0.2" strokeWidth="0.5" />
                                        </pattern>
                                        <rect width="100%" height="100%" fill={`url(#grid-${i})`} />
                                        <path d="M20,30 Q40,10 60,30 T90,50 T70,80 T40,70 T20,50 Z" fill={theme.primary} opacity="0.8" />
                                        <path d="M10,80 Q20,60 30,80 T50,90 Z" fill={theme.primary} opacity="0.6" />
                                    </svg>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Mobile Standard 'O' */}
                <h1 style={letterStyle} className="md:hidden text-7xl md:text-9xl">O</h1>

                <h1 style={letterStyle} className="text-7xl md:text-9xl">A</h1>
                <h1 style={letterStyle} className="text-7xl md:text-9xl">R</h1>
                <h1 style={letterStyle} className="text-7xl md:text-9xl">A</h1>
            </motion.div>

            {/* Form Container */}
            <AnimatePresence>
                {!isLoggingIn && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            top: '55%',
                            left: '0',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            zIndex: 20
                        }}
                    >
                        <form
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                width: '300px'
                            }}
                            onSubmit={handleSubmit}
                        >
                            <input className="custom-input" type="text" name="email" placeholder="Email Access ID" value={formData.email} onChange={handleChange} style={inputStyle} required disabled={loading} />
                            <input className="custom-input" type="password" name="password" placeholder="Security Key" value={formData.password} onChange={handleChange} style={inputStyle} required disabled={loading} />

                            {mode === 'signup' && (
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                                        disabled={loading}
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="manager">Manager</option>
                                        <option value="developer">Developer</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${theme.primary}` }} />
                                </div>
                            )}

                            {error && <div style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}
                            {successMsg && <div style={{ color: 'green', fontSize: '0.8rem', textAlign: 'center' }}>{successMsg}</div>}

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02, backgroundColor: theme.primary, color: theme.solidBackground }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                style={{
                                    padding: '12px',
                                    backgroundColor: theme.primary,
                                    color: theme.solidBackground, // STRICT: Theme colors only
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: loading ? 'wait' : 'pointer',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px',
                                    width: '100%',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'PROCESSING...' : (mode === 'login' ? 'AUTHENTICATE' : 'REGISTER ID')}
                            </motion.button>

                            <div style={{ display: 'flex', justifyContent: 'center', fontSize: '0.8rem' }}>
                                <span onClick={!loading ? toggleMode : undefined} style={{ cursor: loading ? 'default' : 'pointer', color: theme.primary, fontWeight: 'bold', textDecoration: 'underline', opacity: loading ? 0.5 : 1 }}>
                                    {mode === 'login' ? 'Create New ID' : 'Back to Login'}
                                </span>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoginScreen;
