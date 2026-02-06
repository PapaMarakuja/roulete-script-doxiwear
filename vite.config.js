import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: "dist",
        lib: {
            entry: "src/index.js",
            name: "RouletteWidget",
            fileName: () => "roulette.js",
            formats: ["iife"]
        },
        cssCodeSplit: false,
        minify: true
    },
    server: {
        host: true,
    },
});
