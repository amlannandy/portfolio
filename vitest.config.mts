import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve the @portfolio/* alias from tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    // Playwright specs live in e2e/ and must not be picked up by Vitest.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
