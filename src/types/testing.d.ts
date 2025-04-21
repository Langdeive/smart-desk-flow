
/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attribute: string, value?: string): R;
      // You can add more matchers here if needed
    }
  }
}

declare global {
  namespace jest {
    interface Expect {
      toBeInTheDocument(): any;
      toHaveAttribute(attribute: string, value?: string): any;
      // You can add more matchers here if needed
    }
  }
}

export {};
