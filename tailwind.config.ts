import type { Config } from 'tailwindcss'

/**
 * Design System — Premium Fintech Trading Dashboard
 * -----------------------------------------------
 * 色彩: Primary #0F172A, 背景 #020617 (OLED 纯黑)
 * 效果: 玻璃拟态 (Glassmorphism) + 微光 (Minimal Glow)
 * 字体: Fira Code, Fira Sans
 * -----------------------------------------------
 * 注: 主色采用设计规范 #0F172A（若需 #00F172A 请确认是否为品牌色）
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ---------- 色彩 ----------
      colors: {
        background: '#020617',
        primary: '#0F172A',
        secondary: '#1E293B',
        cta: '#22C55E',
        foreground: '#F8FAFC',
        muted: '#94A3B8',
        'muted-foreground': '#64748B',
        border: 'rgba(248, 250, 252, 0.1)',
        input: 'rgba(248, 250, 252, 0.08)',
        ring: 'rgba(248, 250, 252, 0.2)',
        // 玻璃拟态专用
        glass: {
          DEFAULT: 'rgba(15, 23, 42, 0.65)',
          light: 'rgba(30, 41, 59, 0.5)',
          border: 'rgba(248, 250, 252, 0.08)',
          borderStrong: 'rgba(248, 250, 252, 0.12)',
        },
      },
      // ---------- 字体 ----------
      fontFamily: {
        sans: ['Fira Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'SF Mono', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // ---------- 玻璃拟态 (Glassmorphism) ----------
      backgroundColor: {
        glass: 'rgba(15, 23, 42, 0.65)',
        'glass-light': 'rgba(30, 41, 59, 0.5)',
        'glass-card': 'rgba(15, 23, 42, 0.55)',
      },
      backgroundImage: {
        'glass-gradient':
          'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.45) 100%)',
        'glass-gradient-card':
          'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%)',
      },
      backdropBlur: {
        glass: '12px',
        'glass-sm': '8px',
        'glass-lg': '16px',
      },
      borderColor: {
        glass: 'rgba(248, 250, 252, 0.08)',
        'glass-strong': 'rgba(248, 250, 252, 0.12)',
      },
      // ---------- 微光 (Minimal Glow) ----------
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.25)',
        'glass-inner': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        glow: '0 0 10px currentColor',
        'glow-sm': '0 0 6px currentColor',
        'glow-md': '0 0 12px currentColor',
        'glow-lg': '0 0 16px currentColor',
        'glow-green': '0 0 12px rgba(34, 197, 94, 0.4)',
        'glow-text': '0 0 10px currentColor',
      },
      textShadow: {
        glow: '0 0 10px currentColor',
        'glow-sm': '0 0 6px currentColor',
        'glow-md': '0 0 12px currentColor',
      },
      // ---------- 动效 (150–300ms) ----------
      transitionDuration: {
        DEFAULT: '200ms',
        fast: '150ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
