import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env from .env, .env.local, .env.[mode] in the project dir
  const env = loadEnv(mode, process.cwd(), '');
  // Also pull REACT_APP_* from the actual process env (Docker ENV / shell).
  // Shell env wins over .env file values so Dockerfile ARG/ENV can override.
  const reactAppEnv = {
    ...Object.fromEntries(
      Object.entries(env).filter(([k]) => k.startsWith('REACT_APP_'))
    ),
    ...Object.fromEntries(
      Object.entries(process.env).filter(
        ([k, v]) => k.startsWith('REACT_APP_') && v !== undefined
      )
    ),
  };
  // Build the define map: one key per REACT_APP_* var (not a blanket
  // process.env override, which would wipe everything else).
  const defineMap: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(mode),
  };
  for (const [k, v] of Object.entries(reactAppEnv)) {
    defineMap[`process.env.${k}`] = JSON.stringify(v);
  }
  const apiTarget = env.VITE_API_URL || env.REACT_APP_API_URL || 'http://localhost:8000';
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'build',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
    },
    define: defineMap,
  };
});
