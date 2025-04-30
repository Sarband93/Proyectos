import { fileURLToPath, URL } from 'node:url';
import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

const buildVersion = JSON.stringify(process.env.npm_package_version);

// https://vite.dev/config/
export default defineConfig({
    base: '/app/',
    plugins: [
        vue(),
        VueI18nPlugin({
            compositionOnly: true,
            fullInstall: false,
            // locale messages resource pre-compile option
            include: path.resolve(__dirname, 'locales/**.json')
        }),
        vueDevTools()
    ],
    define: {
        __VERSION__: buildVersion
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        cssCodeSplit: false,
        rollupOptions: {
            output: {
                manualChunks() {
                    return 'main';
                },
                sourcemap: false,
                entryFileNames: 'assets/[name].[hash].js',
                assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
                chunkFileNames: 'js/[name].[hash].js',
                footer: `/* Vesion ${buildVersion} */`
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler' // or "modern"
            }
        }
    }
});
