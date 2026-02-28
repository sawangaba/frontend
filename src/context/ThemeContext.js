import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Helper to generate HSL string
    const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;
    const hsla = (h, s, l, a) => `hsla(${h}, ${s}%, ${l}%, ${a})`;

    // Default "Sci-Fi" Theme
    const defaultTheme = {
        primary: '#00f3ff',
        secondary: '#000000',
        accent: '#00f3ff',
        background: 'radial-gradient(circle at 50% 50%, #0a192f 0%, #000 100%)',
        text: '#00f3ff',
        textSecondary: 'rgba(0, 243, 255, 0.7)',
        font: '"Inter", "Segoe UI", "Roboto", sans-serif', // Modern Font

        // UI Elements
        panelBg: 'rgba(0, 20, 40, 0.8)',
        border: '#00f3ff',
        buttonBg: 'rgba(0, 243, 255, 0.1)',
        buttonText: '#00f3ff',

        // Jarvis Specific
        jarvisFace: '#2c3e50',
        jarvisEyes: '#ffffff',
        jarvisMouth: '#ffffff',
        jarvisGlow: '0 0 20px rgba(0, 243, 255, 0.6)',
        jarvisShape: '50%',
        jarvisBorder: '5px solid #00f3ff',
        jarvisEyeShape: '50%'
    };

    const [theme, setTheme] = useState(defaultTheme);

    const generateRandomTheme = () => {
        // 1. Base Colors
        const hue = Math.floor(Math.random() * 360);
        const primarySat = 85 + Math.floor(Math.random() * 15);
        const primaryLight = 60 + Math.floor(Math.random() * 10);
        const primary = hsl(hue, primarySat, primaryLight);

        const shift = Math.random() > 0.5 ? 180 : 120;
        const secHue = (hue + shift) % 360;
        const secondaryColor = hsl(secHue, 80, 60);

        // 2. Background
        const bgHue = hue;
        const background = `radial-gradient(circle at 50% 50%, ${hsl(bgHue, 30, 15)} 0%, ${hsl(bgHue, 30, 2)} 100%)`;

        // 3. Jarvis Creative Randomization - TRUE CHAOS

        // Generate a random "blob" shape using 8 values
        const r = () => 30 + Math.floor(Math.random() * 40); // 30% to 70%
        const randomBlob = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;

        // Sometimes perfect shapes, sometimes blobs
        const shapes = ['50%', '0px', '10px', randomBlob, randomBlob, randomBlob];
        const finalShape = shapes[Math.floor(Math.random() * shapes.length)];

        const borderStyles = ['solid', 'dashed', 'double', 'dotted', 'groove', 'ridge'];
        const randomBorderStyle = borderStyles[Math.floor(Math.random() * borderStyles.length)];
        // Border width 2px to 10px
        const randomBorderWidth = 2 + Math.floor(Math.random() * 8) + 'px';

        const randomEyeShape = Math.random() > 0.5 ? '50%' : (Math.random() > 0.5 ? '0px' : '5px');

        // Jarvis Face Color - Can be solid or gradient
        const faceIsGradient = Math.random() > 0.3;
        const jarvisFaceColor = faceIsGradient
            ? `linear-gradient(${Math.floor(Math.random() * 360)}deg, ${hsla(bgHue, 50, 20, 1)}, ${hsla(secHue, 50, 10, 1)})`
            : hsla(bgHue, 40, 15, 1);

        setTheme({
            primary: primary,
            secondary: '#000000',
            accent: secondaryColor,
            background: background,
            text: primary,
            textSecondary: hsla(hue, primarySat, primaryLight, 0.7),
            font: '"Inter", "Segoe UI", "Roboto", sans-serif', // Modern Font

            panelBg: hsla(bgHue, 20, 5, 0.85),
            border: primary,
            buttonBg: hsla(hue, primarySat, primaryLight, 0.15),
            buttonText: primary,

            // Jarvis Advanced Styling
            jarvisFace: jarvisFaceColor,
            jarvisEyes: primary,
            jarvisMouth: secondaryColor,
            jarvisGlow: `0 0 30px ${primary}, 0 0 60px ${secondaryColor}`,
            jarvisShape: finalShape,
            jarvisBorder: `${randomBorderWidth} ${randomBorderStyle} ${primary}`,
            jarvisEyeShape: randomEyeShape
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, generateRandomTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
