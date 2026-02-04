// src/setupTests.ts

// for React 18 + testing-library (enable the new act environment)
;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

// add jest-dom matchers to vitest's expect
import '@testing-library/jest-dom'