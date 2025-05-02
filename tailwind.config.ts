
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
				// Primary colors
				"primary-a": "#08C4AE", // Teal 500
				"primary-b": "#8F5BFF", // Roxo 500
				"primary-b-600": "#7841F0", // Roxo 600 (for hover states)
				"primary-a-50": "#E3FAF6", // Teal 50
				
				// Neutral colors
				"neutral-900": "#1E1E23",
				"neutral-700": "#6A6E73", 
				"neutral-200": "#E1E3E5",
				"neutral-100": "#F5F6F7",
				
				// Status colors
				"success": "#2EC977", // Green 500
				"error": "#FF4B4B", // Red 500
				
				// System-required colors (mapping to our new palette)
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
				manrope: ['Manrope', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
			},
			fontSize: {
				'h1': '1.875rem', // 30px
				'h2': '1.5rem',   // 24px
				'body': '1rem',   // 16px
				'small': '0.875rem', // 14px
			},
			letterSpacing: {
				'heading': '-0.01em', // -1%
			},
			borderRadius: {
				lg: '1rem', // 16px
				md: 'calc(1rem - 2px)', // 14px
				sm: 'calc(1rem - 4px)', // 12px
				pill: '0.75rem', // 12px
			},
			boxShadow: {
				'card': '0 8px 16px rgba(0,0,0,0.04)',
			},
			transitionDuration: {
				'default': '200ms',
			},
			spacing: {
				'base': '0.5rem', // 8px
			},
			keyframes: {
				'logo-spin': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' },
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
				'logo-spin': 'logo-spin 1s ease-in-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
