
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { KpiCard } from '../KpiCard';

describe('KpiCard', () => {
  it('should render as a link with correct ARIA attributes', () => {
    render(
      <MemoryRouter>
        <KpiCard
          title="Test Card"
          value="123"
          description="Test description"
          href="/test-link"
          ariaLabel="Test aria label"
        />
      </MemoryRouter>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-link');
    expect(link).toHaveAttribute('aria-label', 'Test aria label');
    expect(link).toHaveAttribute('title', 'Ver detalhes de Test Card');
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
