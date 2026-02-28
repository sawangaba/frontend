import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveFace = ({ state = 'idle', theme }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Use specific Jarvis theme props or fallbacks
    const faceColor = theme?.jarvisFace || '#2c3e50';
    const eyeColor = theme?.jarvisEyes || '#00f3ff';
    const mouthColor = theme?.jarvisMouth || '#ffffff';
    const glow = theme?.jarvisGlow || `0 0 20px #00f3ff`;

    // New Creative Props
    const shape = theme?.jarvisShape || '50%';
    const border = theme?.jarvisBorder || '5px solid #00f3ff';
    const eyeShape = theme?.jarvisEyeShape || '50%';

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 30;
            const y = (e.clientY - window.innerHeight / 2) / 30;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const styles = {
        container: {
            position: 'fixed',
            bottom: '50px',
            right: '50px',
            width: '150px',
            height: '150px',
            zIndex: 1000,
            cursor: 'pointer'
        },
        face: {
            width: '100%',
            height: '100%',
            background: faceColor,
            borderRadius: shape,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: glow,
            border: border,
            position: 'relative',
            flexDirection: 'column',
            // CRITICAL FIX: Only transition theme properties, NOT transform/scale
            transition: 'background 0.5s ease, border-radius 0.5s ease, border 0.5s ease, box-shadow 0.5s ease'
        },
        eyesContainer: {
            display: 'flex',
            gap: '25px',
            marginBottom: '15px'
        },
        eye: {
            width: '25px',
            height: '25px',
            backgroundColor: eyeColor,
            borderRadius: eyeShape,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 0 10px ${eyeColor}`,
            transition: 'background-color 0.5s ease, border-radius 0.5s ease, box-shadow 0.5s ease'
        },
        pupil: {
            width: '10px',
            height: '10px',
            backgroundColor: '#000',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
        mouth: {
            width: '40px',
            height: '6px',
            backgroundColor: mouthColor,
            borderRadius: '10px',
            boxShadow: `0 0 5px ${mouthColor}`,
            transition: 'background-color 0.5s ease, box-shadow 0.5s ease'
        }
    };

    const variants = {
        idle: { scale: 1 },
        thinking: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } },
        speaking: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.2 } }
    };

    return (
        <div style={styles.container}>
            <motion.div
                style={styles.face}
                variants={variants}
                animate={state}
                whileHover={{ scale: 1.1, rotate: 5 }}
            >
                <div style={styles.eyesContainer}>
                    <div style={styles.eye}>
                        <motion.div
                            style={styles.pupil}
                            animate={{ x: mousePos.x, y: mousePos.y }}
                        />
                    </div>
                    <div style={styles.eye}>
                        <motion.div
                            style={styles.pupil}
                            animate={{ x: mousePos.x, y: mousePos.y }}
                        />
                    </div>
                </div>
                <motion.div
                    style={styles.mouth}
                    animate={state === 'speaking' ? { height: [6, 20, 6], width: [40, 35, 40] } : { height: 6 }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                />
            </motion.div>
        </div>
    );
};

export default InteractiveFace;
