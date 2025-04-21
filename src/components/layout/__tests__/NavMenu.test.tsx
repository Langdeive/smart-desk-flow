
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavMenu } from '../NavMenu';
import { ThemeProvider } from '@/hooks/use-theme';

// Mock useTheme hook
vi.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

describe('NavMenu', () => {
  it('should render login and register buttons when user is not logged in', async () => {
    render(
      <MemoryRouter>
        <NavMenu />
      </MemoryRouter>
    );
    
    // Initially show login/register buttons (user is null)
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
    
    // Wait for the mocked login effect to run
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // After login simulation, these should be replaced by avatar menu
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Cadastrar')).not.toBeInTheDocument();
    
    // Avatar menu and new ticket button should be visible
    expect(screen.getByText('Novo Ticket')).toBeInTheDocument();
  });
});
