import React from 'react';
import { motion } from 'framer-motion';

const JarvisFace = ({ state, theme }) => {
    // State: 'idle', 'listening', 'thinking', 'speaking'

    // Theme Fallbacks
    const primary = theme?.primary || '#00f3ff';
    const secondary = theme?.secondary || '#000000';
    const accent = theme?.accent || '#00f3ff';

    // Advanced Creative Props
    const shape = theme?.jarvisShape || '50%';
    const border = theme?.jarvisBorder || `2px dashed ${primary}44`;
    const glow = theme?.jarvisGlow || `0 0 15px ${primary}22`;
    const faceBg = theme?.jarvisFace || 'transparent';

    // Waveform bar variants - Enhanced Speaking
    const barVariants = {
        idle: {
            height: [10, 20, 10],
            transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        },
        speaking: {
            height: [10, 60, 20, 80, 30, 10], // More vigorous movement
            backgroundColor: [primary, accent, '#ff00ff', primary], // Color cycling during speech
            transition: { repeat: Infinity, duration: 0.3, ease: "easeInOut" }
        },
        thinking: {
            height: [10, 15, 10],
            transition: { repeat: Infinity, duration: 0.5 }
        },
        listening: {
            height: 40,
            transition: { duration: 0.2 }
        }
    };

    // Reactor ring rotation
    const ringVariants = {
        idle: { rotate: 360, transition: { repeat: Infinity, duration: 20, ease: "linear" } },
        thinking: { rotate: -360, transition: { repeat: Infinity, duration: 2, ease: "linear" } },
        speaking: { rotate: 360, scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.5, ease: "linear" } }, // Pulse while speaking
        listening: { rotate: 360, scale: 1.1, transition: { duration: 0.5 } }
    };

    const color = state === 'thinking' ? '#f1c40f' : primary;

    return (
        <motion.div
            // Lively Color Animation: Slowly rotate hue to make it feel "alive"
            animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{
                position: 'relative',
                width: '200px',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}
        >

            {/* Main Face Container (Applies Shape, Border, Background) */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: faceBg,
                    borderRadius: shape,
                    border: border,
                    boxShadow: glow,
                    zIndex: 0,
                    transition: 'background 0.5s ease, border-radius 0.5s ease, border 0.5s ease, box-shadow 0.5s ease'
                }}
            />

            {/* Outer Reactor Ring */}
            <motion.div
                variants={ringVariants}
                animate={state}
                style={{
                    position: 'absolute',
                    width: '90%', height: '90%',
                    borderRadius: shape,
                    border: `1px dashed ${color}44`,
                    zIndex: 1,
                    transition: 'border-radius 0.5s ease'
                }}
            />

            {/* Inner Reactor Ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                style={{
                    position: 'absolute',
                    width: '70%', height: '70%',
                    borderRadius: shape,
                    border: `2px solid ${color}11`,
                    borderTop: `2px solid ${color}`,
                    borderBottom: `2px solid ${color}`,
                    zIndex: 2,
                    transition: 'border-radius 0.5s ease'
                }}
            />

            {/* Central Waveform */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '60px', zIndex: 3 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        variants={barVariants}
                        animate={state}
                        custom={i}
                        style={{
                            width: '8px',
                            backgroundColor: color,
                            borderRadius: '4px',
                            boxShadow: `0 0 10px ${color}`
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export default JarvisFace;
