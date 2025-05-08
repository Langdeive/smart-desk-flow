
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 shadow-sm' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Logo variant="full" />

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-foreground hover:text-primary-b transition-colors">
            Funcionalidades
          </a>
          <a href="#plans" className="text-sm font-medium text-foreground hover:text-primary-b transition-colors">
            Planos
          </a>
          <a href="#faq" className="text-sm font-medium text-foreground hover:text-primary-b transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <RouterLink 
            to="/login"
            className="text-sm font-medium text-primary-a hover:text-primary-a/80 transition-colors"
          >
            Login
          </RouterLink>
          <Button asChild variant="default" size="sm" className="bg-primary-b hover:bg-primary-b-600 text-white transition-colors">
            <RouterLink to="/register">Cadastrar</RouterLink>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
