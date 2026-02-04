// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,                    // use expect/describe/test as globals
    environment: 'jsdom',             // important — enables document/window
    setupFiles: './src/setupTests.ts',// run this before each test run
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    // you can add other options like isolate: true, silent, etc.
  },
})
