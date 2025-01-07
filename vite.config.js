import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { insertHtml,h } from 'vite-plugin-insert-html';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      '@popperjs/core',
      'hoist-non-react-statics',
      '@emotion/react', 
      '@emotion/styled', 
      '@mui/material/Tooltip'
    ],
  },
  server: {
    host: true,
    port: 5173, 
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    insertHtml({
      head:[
        h('script',{src:'./xtracker.js'}),
      ],
    })
  ],
  base:'./'
});

