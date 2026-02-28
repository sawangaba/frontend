import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ isImploding, isExploding }) => {
    const canvasRef = useRef(null);
    const isImplodingRef = useRef(isImploding);
    const isExplodingRef = useRef(isExploding);

    useEffect(() => {
        isImplodingRef.current = isImploding;
    }, [isImploding]);

    useEffect(() => {
        isExplodingRef.current = isExploding;
    }, [isExploding]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        };

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#000000'; // Black particles
                ctx.fill();
            }

            update() {
                let centerX = canvas.width / 2;
                let centerY = canvas.height / 2;

                if (isExplodingRef.current) {
                    // Explosion logic: Blast AWAY from center
                    let dx = this.x - centerX;
                    let dy = this.y - centerY;

                    // Avoid division by zero
                    if (dx === 0) dx = Math.random() - 0.5;
                    if (dy === 0) dy = Math.random() - 0.5;

                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Accelerate outwards
                    this.x += (dx / distance) * 40;
                    this.y += (dy / distance) * 40;

                } else if (isImplodingRef.current) {
                    // Implosion logic: Move rapidly TOWARDS center
                    let dx = centerX - this.x;
                    let dy = centerY - this.y;

                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Normalize and accelerate
                    if (distance > 5) {
                        this.x += (dx / distance) * 30; // High speed suction
                        this.y += (dy / distance) * 30;
                    } else {
                        this.size = 0;
                    }

                } else {
                    // Normal logic
                    if (this.x > canvas.width || this.x < 0) {
                        this.directionX = -this.directionX;
                    }
                    if (this.y > canvas.height || this.y < 0) {
                        this.directionY = -this.directionY;
                    }

                    // Check collision detection - mouse position / particle position
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius + this.size) {
                        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                            this.x += 10;
                        }
                        if (mouse.x > this.x && this.x > this.size * 10) {
                            this.x -= 10;
                        }
                        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                            this.y += 10;
                        }
                        if (mouse.y > this.y && this.y > this.size * 10) {
                            this.y -= 10;
                        }
                    }

                    // Move particle
                    this.x += this.directionX;
                    this.y += this.directionY;
                }

                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 3) + 1;
                let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 2) - 1; // Speed
                let directionY = (Math.random() * 2) - 1;
                let color = '#000000';

                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            // Don't connect if imploding or exploding
            if (isImplodingRef.current || isExplodingRef.current) return;

            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                        + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(0,0,0,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />;
};

export default ParticleBackground;
