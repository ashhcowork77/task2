import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['var(--font-lato)', 'Lato', 'sans-serif'],
      },
      colors: {
        // Tenant branding colors can be configured per-tenant
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          900: 'var(--color-primary-900)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
