
import '@testing-library/jest-dom';

// Extend the global namespace with Testing Library Jest-DOM matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attribute: string, value?: string): R;
    }
  }
}

// Augment the global expect type to include our custom matchers
declare global {
  namespace jest {
    interface Expect {
      toBeInTheDocument(): any;
      toHaveAttribute(attribute: string, value?: string): any;
    }
  }
}

export {};
