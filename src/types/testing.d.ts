
import '@testing-library/jest-dom';

declare module '@testing-library/jest-dom/matchers' {
  interface TestingLibraryMatchers<R, E> {
    toBeInTheDocument(): R;
    toHaveAttribute(attribute: string, value?: string): R;
  }
}
