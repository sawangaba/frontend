import React, { useRef, useEffect, useState } from 'react';

const AdvancedBackgrounds = ({ mode, theme, chaosSeed, isExiting }) => {
    const canvasRef = useRef(null);
    const [chaosParams, setChaosParams] = useState(null);

    // --- GENERATIVE CHAOS ENGINE ---
    useEffect(() => {
        if (mode === 'chaos') {
            const movements = ['linear', 'wander', 'flow', 'vibrate', 'bounce', 'crossflow'];
            const shapes = ['circle', 'square', 'triangle', 'line', 'cross', 'ring'];
            const interactions = ['repel', 'attract', 'swirl', 'explode', 'size'];
            const connections = ['distance', 'nearest', 'none'];

            setChaosParams({
                movement: movements[Math.floor(Math.random() * movements.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                interaction: interactions[Math.floor(Math.random() * interactions.length)],
                connection: connections[Math.floor(Math.random() * connections.length)],
                speed: Math.random() * 2 + 0.5,
                size: Math.random() * 4 + 1,
                count: Math.floor(Math.random() * 100) + 50,
                colorVar: Math.random() > 0.5,
                dash: Math.random() > 0.7,
                fill: Math.random() > 0.3
            });
        }
    }, [mode, chaosSeed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: 0, y: 0 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // --- EFFECT LOGIC ---

        // 1. NEURAL NETWORK
        const initNeural = () => {
            particles = [];
            for (let i = 0; i < 150; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const r = 300 + Math.random() * 100;
                particles.push({
                    x: r * Math.sin(phi) * Math.cos(theta),
                    y: r * Math.sin(phi) * Math.sin(theta),
                    z: r * Math.cos(phi),
                    size: Math.random() * 2 + 1,
                    vx: 0, vy: 0, vz: 0 // For warp
                });
            }
        };

        const drawNeural = (time) => {
            if (theme.background.includes('gradient')) ctx.clearRect(0, 0, canvas.width, canvas.height);
            else { ctx.fillStyle = theme.background; ctx.fillRect(0, 0, canvas.width, canvas.height); }

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // WARP LOGIC
            if (isExiting) {
                particles.forEach(p => {
                    p.z += 50; // Fly towards camera
                    if (p.z > 1000) p.z = -1000;
                });
            }

            const rotX = (mouse.y - cy) * 0.000005; // SLOWED DOWN NEURAL BACKGROUND
            const rotY = (mouse.x - cx) * 0.000005; // SLOWED DOWN NEURAL BACKGROUND

            particles.forEach(p => {
                if (!isExiting) {
                    let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
                    let z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);
                    let y1 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
                    let z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);
                    p.x = x1; p.y = y1; p.z = z2;
                }

                const scale = 500 / (500 + (isExiting ? -p.z + 500 : p.z)); // Invert Z for warp effect
                const x2d = cx + p.x * scale;
                const y2d = cy + p.y * scale;

                ctx.beginPath();
                ctx.arc(x2d, y2d, p.size * scale * (isExiting ? 5 : 1), 0, Math.PI * 2);
                ctx.fillStyle = theme.primary;
                ctx.fill();

                if (!isExiting) {
                    particles.forEach(p2 => {
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dz = p.z - p2.z;
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        if (dist < 100) {
                            ctx.beginPath();
                            ctx.moveTo(x2d, y2d);
                            const scale2 = 500 / (500 + p2.z);
                            ctx.lineTo(cx + p2.x * scale2, cy + p2.y * scale2);
                            ctx.strokeStyle = theme.primary;
                            ctx.globalAlpha = (1 - dist / 100) * 0.3;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                            ctx.globalAlpha = 1;
                        }
                    });
                }
            });
        };

        // 2. CONSTELLATION
        const initConstellation = () => {
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1
                });
            }
        };

        const drawConstellation = () => {
            if (theme.background.includes('gradient')) ctx.clearRect(0, 0, canvas.width, canvas.height);
            else { ctx.fillStyle = theme.background; ctx.fillRect(0, 0, canvas.width, canvas.height); }

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            particles.forEach(p => {
                if (isExiting) {
                    // Warp outwards
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    p.x += (dx / dist) * 50;
                    p.y += (dy / dist) * 50;

                    // Draw streak
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - (dx / dist) * 100, p.y - (dy / dist) * 100);
                    ctx.strokeStyle = theme.primary;
                    ctx.lineWidth = p.size;
                    ctx.stroke();
                } else {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = theme.primary;
                    ctx.fill();

                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = theme.primary;
                        ctx.globalAlpha = (1 - dist / 200);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            });
        };

        // 3. QUANTUM FLUX
        const initQuantum = () => {
            particles = [];
            for (let i = 0; i < 150; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    state: Math.random(),
                    entangled: Math.floor(Math.random() * 150)
                });
            }
        };

        const drawQuantum = (time) => {
            if (theme.background.includes('gradient')) ctx.clearRect(0, 0, canvas.width, canvas.height);
            else { ctx.fillStyle = theme.background; ctx.fillRect(0, 0, canvas.width, canvas.height); }

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            particles.forEach((p, i) => {
                if (isExiting) {
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    p.x += (dx / dist) * 60;
                    p.y += (dy / dist) * 60;

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - (dx / dist) * 50, p.y - (dy / dist) * 50);
                    ctx.strokeStyle = theme.primary;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    p.x += (Math.random() - 0.5) * 2;
                    p.y += (Math.random() - 0.5) * 2;

                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    let size = 1.5;
                    let alpha = 0.5;

                    if (dist < 150) {
                        size = 3;
                        alpha = 1;
                        p.x -= dx * 0.02;
                        p.y -= dy * 0.02;
                    }

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                    ctx.fillStyle = theme.primary;
                    ctx.globalAlpha = alpha;
                    ctx.fill();
                    ctx.globalAlpha = 1;

                    if (Math.random() > 0.95) {
                        const partner = particles[p.entangled];
                        if (partner) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(partner.x, partner.y);
                            ctx.strokeStyle = theme.primary;
                            ctx.globalAlpha = 0.1;
                            ctx.stroke();
                            ctx.globalAlpha = 1;
                        }
                    }
                }
            });
        };

        // 4. NET
        const initNet = () => {
            particles = [];
            const rows = 15;
            const cols = 25;
            const xSpace = canvas.width / cols;
            const ySpace = canvas.height / rows;

            for (let r = 0; r <= rows; r++) {
                for (let c = 0; c <= cols; c++) {
                    particles.push({
                        x: c * xSpace,
                        y: r * ySpace,
                        originX: c * xSpace,
                        originY: r * ySpace,
                        vx: 0,
                        vy: 0
                    });
                }
            }
        };

        const drawNet = () => {
            if (theme.background.includes('gradient')) ctx.clearRect(0, 0, canvas.width, canvas.height);
            else { ctx.fillStyle = theme.background; ctx.fillRect(0, 0, canvas.width, canvas.height); }

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            particles.forEach(p => {
                if (isExiting) {
                    // Warp: Break the net and fly
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    p.x += (dx / dist) * 40;
                    p.y += (dy / dist) * 40;

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - (dx / dist) * 20, p.y - (dy / dist) * 20);
                    ctx.strokeStyle = theme.primary;
                    ctx.stroke();
                } else {
                    const k = 0.05;
                    const ax = (p.originX - p.x) * k;
                    const ay = (p.originY - p.y) * k;
                    p.vx += ax; p.vy += ay;
                    p.vx *= 0.9; p.vy *= 0.9;

                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const force = (150 - dist) / 150;
                        p.vx -= (dx / dist) * force * 2;
                        p.vy -= (dy / dist) * force * 2;
                    }

                    p.x += p.vx; p.y += p.vy;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = theme.primary;
                    ctx.fill();
                }
            });

            if (!isExiting) {
                ctx.beginPath();
                particles.forEach((p, i) => {
                    if ((i + 1) % 26 !== 0 && particles[i + 1]) {
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[i + 1].x, particles[i + 1].y);
                    }
                    if (particles[i + 26]) {
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[i + 26].x, particles[i + 26].y);
                    }
                });
                ctx.strokeStyle = theme.primary;
                ctx.globalAlpha = 0.2;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        };

        // 5. CIRCUIT
        const initCircuit = () => {
            particles = [];
            for (let i = 0; i < 80; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.random() > 0.5 ? (Math.random() > 0.5 ? 2 : -2) : 0,
                    vy: 0,
                    history: []
                });
                if (particles[i].vx === 0) particles[i].vy = Math.random() > 0.5 ? 2 : -2;
            }
        };

        const drawCircuit = () => {
            if (theme.background.includes('gradient')) ctx.clearRect(0, 0, canvas.width, canvas.height);
            else { ctx.fillStyle = theme.background; ctx.fillRect(0, 0, canvas.width, canvas.height); }

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            particles.forEach(p => {
                if (isExiting) {
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    p.x += (dx / dist) * 80; // Super fast
                    p.y += (dy / dist) * 80;

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - (dx / dist) * 200, p.y - (dy / dist) * 200); // Long trails
                    ctx.strokeStyle = theme.primary;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                } else {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (Math.random() < 0.02) {
                        if (p.vx !== 0) {
                            p.vx = 0;
                            p.vy = Math.random() > 0.5 ? 2 : -2;
                        } else {
                            p.vy = 0;
                            p.vx = Math.random() > 0.5 ? 2 : -2;
                        }
                    }

                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;

                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    let alpha = 0.5;
                    let size = 2;

                    if (dist < 150) {
                        alpha = 1;
                        size = 4;
                        if (p.vx !== 0) p.y += (mouse.y - p.y) * 0.05;
                        else p.x += (mouse.x - p.x) * 0.05;
                    }

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                    ctx.fillStyle = theme.primary;
                    ctx.globalAlpha = alpha;
                    ctx.fill();

                    p.history.push({ x: p.x, y: p.y });
                    if (p.history.length > 20) p.history.shift();

                    ctx.beginPath();
                    p.history.forEach((pos, i) => {
                        if (i === 0) ctx.moveTo(pos.x, pos.y);
                        else ctx.lineTo(pos.x, pos.y);
                    });
                    ctx.strokeStyle = theme.primary;
                    ctx.lineWidth = size / 2;
                    ctx.globalAlpha = alpha * 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            });
        };

        // 6. CHAOS
        const initChaos = () => {
            particles = [];
            const count = chaosParams?.count || 100;
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * (chaosParams?.speed || 1),
                    vy: (Math.random() - 0.5) * (chaosParams?.speed || 1),
                    size: chaosParams?.size || 2,
                    angle: Math.random() * Math.PI * 2,
                    radius: Math.random() * 200,
                    offset: Math.random() * 100
                });
            }
        };

        const drawChaos = (time) => {
            if (theme.background.includes('gradient')) ctx.clearRect(0, 0, canvas.width, canvas.height);
            else { ctx.fillStyle = theme.background; ctx.fillRect(0, 0, canvas.width, canvas.height); }

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const { movement, shape, interaction, connection, speed, colorVar, dash, fill } = chaosParams || {};

            particles.forEach(p => {
                if (isExiting) {
                    // Universal Warp for Chaos
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    p.x += (dx / dist) * 50;
                    p.y += (dy / dist) * 50;

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - (dx / dist) * 50, p.y - (dy / dist) * 50);
                    ctx.strokeStyle = theme.primary;
                    ctx.lineWidth = p.size;
                    ctx.stroke();
                } else {
                    // Normal Chaos Logic (Simplified for brevity, same as before)
                    if (movement === 'linear') {
                        p.x += p.vx; p.y += p.vy;
                        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    } else if (movement === 'wander') {
                        p.vx += (Math.random() - 0.5) * 0.1; p.vy += (Math.random() - 0.5) * 0.1;
                        p.vx = Math.max(-2, Math.min(2, p.vx)); p.vy = Math.max(-2, Math.min(2, p.vy));
                        p.x += p.vx * speed; p.y += p.vy * speed;
                        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
                        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
                    } else if (movement === 'flow') {
                        p.x += speed; p.y += Math.sin(p.x * 0.01 + time * 0.001) * 0.5;
                        if (p.x > canvas.width) p.x = 0;
                    } else if (movement === 'vibrate') {
                        p.x += (Math.random() - 0.5) * 2 * speed; p.y += (Math.random() - 0.5) * 2 * speed;
                    } else if (movement === 'bounce') {
                        p.y += p.vy * speed; if (p.y > canvas.height || p.y < 0) p.vy *= -1;
                    } else if (movement === 'crossflow') {
                        if (p.size > 2) p.x += speed; else p.x -= speed;
                        if (p.x > canvas.width) p.x = 0; if (p.x < 0) p.x = canvas.width;
                    }

                    // Interaction
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 250) {
                        if (interaction === 'repel') { p.x -= dx * 0.08; p.y -= dy * 0.08; }
                        else if (interaction === 'attract') { p.x += dx * 0.08; p.y += dy * 0.08; }
                        else if (interaction === 'swirl') { p.x -= dy * 0.08; p.y += dx * 0.08; }
                        else if (interaction === 'explode') { p.x -= dx * 0.2; p.y -= dy * 0.2; }
                        else if (interaction === 'push') { if (dist < 150) { p.vx += dx * 0.02; p.vy += dy * 0.02; } }
                    }

                    // Draw
                    ctx.beginPath();
                    let drawSize = p.size;
                    if (interaction === 'size' && dist < 250) drawSize *= 3;

                    if (shape === 'square') ctx.rect(p.x, p.y, drawSize * 2, drawSize * 2);
                    else if (shape === 'triangle') {
                        ctx.moveTo(p.x, p.y - drawSize); ctx.lineTo(p.x + drawSize, p.y + drawSize); ctx.lineTo(p.x - drawSize, p.y + drawSize); ctx.closePath();
                    } else if (shape === 'line') {
                        ctx.moveTo(p.x - drawSize * 2, p.y); ctx.lineTo(p.x + drawSize * 2, p.y);
                    } else if (shape === 'cross') {
                        ctx.moveTo(p.x - drawSize, p.y); ctx.lineTo(p.x + drawSize, p.y); ctx.moveTo(p.x, p.y - drawSize); ctx.lineTo(p.x, p.y + drawSize);
                    } else if (shape === 'ring') {
                        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
                    } else {
                        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
                    }

                    ctx.fillStyle = theme.primary;
                    ctx.strokeStyle = theme.primary;
                    if (colorVar) ctx.globalAlpha = Math.random() * 0.5 + 0.5;
                    if (fill && shape !== 'line' && shape !== 'cross') ctx.fill(); else ctx.stroke();
                    ctx.globalAlpha = 1;

                    if (connection !== 'none') {
                        particles.forEach(p2 => {
                            const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                            if (d < 100) {
                                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
                                ctx.strokeStyle = theme.primary; ctx.globalAlpha = (1 - d / 100) * 0.3;
                                if (dash) ctx.setLineDash([5, 5]); else ctx.setLineDash([]);
                                ctx.stroke(); ctx.globalAlpha = 1; ctx.setLineDash([]);
                            }
                        });
                    }
                }
            });
        };

        const render = (time) => {
            if (mode === 'neural') drawNeural(time);
            else if (mode === 'constellation') drawConstellation();
            else if (mode === 'quantum') drawQuantum(time);
            else if (mode === 'net') drawNet();
            else if (mode === 'circuit') drawCircuit();
            else if (mode === 'chaos' && chaosParams) drawChaos(time);

            animationFrameId = requestAnimationFrame(render);
        };

        if (mode === 'neural') initNeural();
        if (mode === 'constellation') initConstellation();
        if (mode === 'quantum') initQuantum();
        if (mode === 'net') initNet();
        if (mode === 'circuit') initCircuit();
        if (mode === 'chaos') initChaos();

        render(0);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mode, theme, chaosParams, chaosSeed, isExiting]);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
};

export default AdvancedBackgrounds;
