import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'heading': ['var(--font-heading)', 'Inter', 'sans-serif'],
                'body': ['var(--font-body)', 'Source Sans 3', 'sans-serif'],
                'mono': ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
                'sans': ['var(--font-body)', 'Source Sans 3', 'sans-serif'], // Default sans
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
            letterSpacing: {
                'tight': '-0.025em',
                'tighter': '-0.03em',
                'tightest': '-0.05em',
            }
        },
    },
    plugins: [],
}

export default config
