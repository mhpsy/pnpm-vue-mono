import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssPresetsEnv from 'postcss-preset-env';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer,
                postcssPresetsEnv({
                    browsers: ['> 0.2% and not dead'],
                }),
            ],
        },
    },
    server: {
        port: 80,
        host: true,
        proxy: {
            // https://cn.vitejs.dev/config/#server-proxy
            '/dev-api': {
                target: 'http://192.168.80.35:8000/api',
                changeOrigin: true,
                rewrite: (p) => {
                    console.log(p);
                    return p.replace(/^\/dev-api/, '');
                },
                bypass: (req, res, options) => {
                    const proxyUrl = new URL(options.rewrite(req.url) || '', options.target as string)?.href || '';
                    res.setHeader('m-proxy-url', proxyUrl);
                },
            },
            '/dev-ai': {
                target: 'http://192.168.80.35:8997',
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/dev-ai/, ''),
            },
        },
    },
    define: {
        'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
        'process.env.TUSIMPLE': !!process.env.TUSIMPLE,
        __DEV__: process.env.NODE_ENV !== 'production'
    },
});
