
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'2xl': '1280px'
			}
		},
		extend: {
			colors: {
				// Nova paleta moderna SolveFlow - cores principais
				"blue-deep": "#1E3A8A", // Azul Profundo
				"turquoise-vibrant": "#06B6D4", // Turquesa Vibrante  
				"purple-intense": "#7C3AED", // Roxo Intenso
				"pink-accent": "#DB2777", // Rosa de Destaque
				
				// Cores de suporte
				"gray-dark": "#1E293B", // Cinza Escuro
				"gray-medium": "#64748B", // Cinza Médio
				"gray-light": "#F1F5F9", // Cinza Claro
				"green-success": "#10B981", // Verde Success
				"red-alert": "#EF4444", // Vermelho Alerta
				
				// Sistema de cores atualizado - CORRIGIDO
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))"
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))"
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))"
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))"
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))"
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))"
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					'primary-foreground': "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					'accent-foreground': "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))"
				}
			},
			fontFamily: {
				outfit: ['Outfit', 'sans-serif'], // Fonte principal para títulos
				inter: ['Inter', 'sans-serif'], // Fonte secundária para texto
			},
			fontSize: {
				'h1': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 56px
				'h2': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 40px
				'h3': ['1.75rem', { lineHeight: '1.3', letterSpacing: '0' }], // 28px
				'h4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }], // 20px
				'body': ['1rem', { lineHeight: '1.6' }], // 16px
				'small': ['0.875rem', { lineHeight: '1.5' }], // 14px
			},
			letterSpacing: {
				'heading': '-0.02em',
				'tight': '-0.01em',
			},
			borderRadius: {
				lg: '12px',
				md: '10px',
				sm: '8px',
				pill: '9999px',
			},
			boxShadow: {
				'modern': '0 10px 25px rgba(6, 182, 212, 0.1)',
				'modern-lg': '0 20px 40px rgba(6, 182, 212, 0.1)',
				'glow': '0 0 20px rgba(6, 182, 212, 0.3)',
				'glow-intense': '0 0 40px rgba(6, 182, 212, 0.6)',
			},
			transitionDuration: {
				'default': '300ms',
			},
			spacing: {
				'section': '6rem',
			},
			keyframes: {
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)' },
				},
				'gradient-move': {
					'0%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
					'100%': { 'background-position': '0% 50%' },
				},
				'slide-in-up': {
					'from': {
						opacity: '0',
						transform: 'translateY(30px)',
					},
					'to': {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
				'scale-in': {
					'from': {
						opacity: '0',
						transform: 'scale(0.9)',
					},
					'to': {
						opacity: '1',
						transform: 'scale(1)',
					},
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				}
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'gradient': 'gradient-move 4s ease infinite',
				'slide-in-up': 'slide-in-up 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #1E3A8A 0%, #06B6D4 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
				'gradient-neutral': 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
