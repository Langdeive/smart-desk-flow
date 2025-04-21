
import '@testing-library/jest-dom';
import { expect } from 'vitest';

// Extend expect with jest-dom matchers
expect.extend({
  toBeInTheDocument: (received) => ({
    pass: received != null,
    message: () => `expected element to be in the document`,
  }),
  toHaveAttribute: (received, attribute, value) => ({
    pass: received.hasAttribute(attribute) && 
           (value ? received.getAttribute(attribute) === value : true),
    message: () => `expected element to have attribute ${attribute}${value ? ` with value ${value}` : ''}`,
  }),
});
