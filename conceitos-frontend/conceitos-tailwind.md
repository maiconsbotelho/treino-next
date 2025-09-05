# Resumo de Conceitos Tailwind CSS

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais do **Tailwind CSS** - framework CSS utility-first que permite criar interfaces modernas rapidamente com classes utilitárias, design systems e customizações avançadas:

### 🎨 Fundamentos Tailwind
- `Utility-First` - Abordagem baseada em classes utilitárias
- `Design Tokens` - Sistema de design integrado
- `Responsive Design` - Mobile-first por padrão
- `State Variants` - Hover, focus, active, etc.

### 🛠️ Configuração Avançada
- `tailwind.config.js` - Configuração personalizada
- `Custom Colors` - Paletas de cores customizadas
- `Typography` - Sistemas tipográficos
- `Spacing` - Escalas de espaçamento personalizadas

### 🎯 Componentes e Patterns
- `@apply` - Diretiva para reutilização
- `Component Classes` - Classes de componentes
- `Variants` - Variações responsivas e de estado
- `Plugins` - Extensões oficiais e customizadas

### 📱 Layout Avançado
- `Grid Layouts` - CSS Grid com Tailwind
- `Flexbox` - Layouts flexíveis
- `Container Queries` - Queries de container
- `Aspect Ratios` - Proporções responsivas

### 🎭 Temas e Customização
- `Dark Mode` - Modo escuro nativo
- `Custom Properties` - Variáveis CSS integradas
- `Dynamic Classes` - Classes dinâmicas com JavaScript
- `Theme Switching` - Alternância de temas

### ⚡ Performance e Otimização
- `Purge/Content` - Remoção de CSS não utilizado
- `JIT Mode` - Just-in-Time compilation
- `Bundle Size` - Otimização de tamanho
- `Critical CSS` - CSS crítico automático

### 🧩 Plugins Essenciais
- `@tailwindcss/forms` - Estilos de formulários
- `@tailwindcss/typography` - Tipografia para conteúdo
- `@tailwindcss/aspect-ratio` - Proporções de aspecto
- `@tailwindcss/container-queries` - Container queries

### 🎨 Design Systems
- `Design Tokens` - Tokens de design sistemáticos
- `Component Libraries` - Bibliotecas de componentes
- `Consistency` - Consistência visual automática
- `Scalability` - Escalabilidade de design

### 🔧 Integração Next.js
- `Setup` - Configuração com Next.js
- `SSR/SSG` - Server-side rendering
- `App Router` - Compatibilidade com App Router
- `CSS-in-JS` - Integração com styled-components

### 📊 Ferramentas e Workflow
- `Tailwind IntelliSense` - Autocomplete no VS Code
- `Prettier Plugin` - Formatação automática
- `Class Sorting` - Ordenação de classes
- `Design to Code` - Workflow de design para código

> **Nota**: Este arquivo complementa os conceitos de CSS puro com a abordagem utility-first do Tailwind

---

## Tailwind CSS

### Setup e Configuração no Next.js

#### Instalação e Setup Básico
```bash
# Instalação do Tailwind CSS com Next.js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instalar plugins essenciais
npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

```javascript
// tailwind.config.js - Configuração completa
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Dark mode configuration
  darkMode: 'class', // ou 'media' para usar preferência do sistema
  
  theme: {
    extend: {
      // Custom colors
      colors: {
        // Brand colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Primary brand color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Semantic colors
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          900: '#7f1d1d',
        },
        
        // Custom grays
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        }
      },
      
      // Custom fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      
      // Custom font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Custom border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // Custom shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'colored': '0 8px 30px rgba(59, 130, 246, 0.15)',
      },
      
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Custom breakpoints
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  
  // Plugins
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    
    // Plugin customizado para utilitários
    function({ addUtilities, addComponents, theme }) {
      // Utilitários customizados
      addUtilities({
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.12)',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
      });
      
      // Componentes customizados
      addComponents({
        '.btn': {
          padding: theme('spacing.2') + ' ' + theme('spacing.4'),
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.5'),
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:focus': {
            outline: '2px solid ' + theme('colors.blue.500'),
            outlineOffset: '2px',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.blue.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.blue.600'),
          },
        },
        '.btn-secondary': {
          backgroundColor: 'transparent',
          color: theme('colors.blue.500'),
          border: '1px solid ' + theme('colors.blue.500'),
          '&:hover': {
            backgroundColor: theme('colors.blue.50'),
          },
        },
      });
    },
  ],
};
```

```css
/* globals.css - Setup inicial */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS com @layer */
@layer base {
  html {
    font-family: theme('fontFamily.sans');
  }
  
  body {
    @apply bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100;
    @apply transition-colors duration-300;
  }
  
  /* Reset de formulários com classes Tailwind */
  input, textarea, select {
    @apply border-gray-300 dark:border-gray-600;
    @apply bg-white dark:bg-gray-800;
    @apply text-gray-900 dark:text-gray-100;
  }
}

@layer components {
  /* Componentes reutilizáveis */
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6;
    @apply border border-gray-200 dark:border-gray-700;
  }
  
  .input-primary {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md;
    @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    @apply dark:border-gray-600 dark:bg-gray-700 dark:text-white;
  }
  
  .link-primary {
    @apply text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300;
    @apply underline-offset-4 hover:underline transition-colors;
  }
}

@layer utilities {
  /* Utilitários customizados */
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-blue-600 to-purple-600;
    @apply bg-clip-text text-transparent;
  }
}
```

### Componentes com Tailwind

#### Sistema de Componentes Avançado
```jsx
// components/ui/Button.jsx
import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Class Variance Authority para variantes
const buttonVariants = cva(
  // Classes base
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  ...props 
}, ref) => {
  const Comp = asChild ? 'span' : 'button';
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };

// lib/utils.js - Utility para merge de classes
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

#### Grid Layouts Avançados com Tailwind
```jsx
// components/layouts/GridLayouts.jsx
export function ResponsiveGrid({ children, cols = { default: 1, sm: 2, lg: 3 } }) {
  const gridClasses = cn(
    'grid gap-6',
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

export function MasonryGrid({ children }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {children}
    </div>
  );
}

export function ComplexDashboardGrid() {
  return (
    <div className="grid grid-cols-12 gap-6 min-h-screen">
      {/* Sidebar */}
      <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
        <div className="sticky top-6 space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Navigation</h3>
            {/* Navigation items */}
          </div>
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="col-span-12 lg:col-span-6 xl:col-span-7">
        <div className="space-y-6">
          {/* Header stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    📊
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts area */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="font-semibold mb-4">Analytics Chart</h4>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="card">
              <h4 className="font-semibold mb-4">Performance Chart</h4>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Right sidebar */}
      <aside className="col-span-12 lg:col-span-3">
        <div className="sticky top-6 space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            {/* Activity items */}
          </div>
        </div>
      </aside>
    </div>
  );
}
```

### Dark Mode com Tailwind

#### Sistema de Dark Mode Robusto
```jsx
// components/ThemeProvider.jsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage?.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage?.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

// components/ui/ThemeToggle.jsx
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// app/layout.tsx - Integração com Next.js App Router
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Formulários Avançados com Tailwind

#### Componentes de Formulário Reutilizáveis
```jsx
// components/ui/Input.jsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helper, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helper && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// components/ui/Select.jsx
import { ChevronDown } from 'lucide-react';

export function Select({ 
  label, 
  options, 
  placeholder = 'Selecione uma opção',
  error,
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500'
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

// components/forms/ContactForm.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectOptions = [
    { value: 'general', label: 'Assunto Geral' },
    { value: 'support', label: 'Suporte Técnico' },
    { value: 'sales', label: 'Vendas' },
    { value: 'partnership', label: 'Parcerias' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    alert('Formulário enviado com sucesso!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Entre em Contato
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Seu nome completo"
              required
            />
            
            <Input
              label="E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <Select
            label="Assunto"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            error={errors.subject}
            options={subjectOptions}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mensagem
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Escreva sua mensagem aqui..."
              required
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                'Enviar Mensagem'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Animações com Tailwind

#### Animações Customizadas e Micro-interações
```jsx
// components/animations/AnimatedComponents.jsx
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        'border-2 border-current border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
    />
  );
}

export function PulsingDot({ className = '' }) {
  return (
    <div className={cn('relative', className)}>
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
    </div>
  );
}

export function GradientButton({ children, className = '', ...props }) {
  return (
    <button
      className={cn(
        'relative px-6 py-3 font-medium text-white transition-all duration-300',
        'bg-gradient-to-r from-purple-500 to-pink-500',
        'rounded-lg shadow-lg hover:shadow-xl',
        'transform hover:scale-105 active:scale-95',
        'before:absolute before:inset-0 before:rounded-lg',
        'before:bg-gradient-to-r before:from-purple-600 before:to-pink-600',
        'before:opacity-0 before:transition-opacity before:duration-300',
        'hover:before:opacity-100',
        'overflow-hidden',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function FloatingCard({ children, className = '' }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-lg',
        'transform transition-all duration-300 ease-out',
        'hover:scale-105 hover:shadow-2xl hover:-translate-y-1',
        'active:scale-95',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TypewriterText({ text, speed = 50 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// Componente de notificação com animação
export function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Aguardar animação de saída
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-500 text-white',
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg',
        'transform transition-all duration-300 ease-out',
        isVisible ? 'translate-x-0 scale-100' : 'translate-x-full scale-95',
        isVisible ? 'opacity-100' : 'opacity-0',
        typeStyles[type]
      )}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
}
```

### Performance e Otimização

#### Configurações de Performance
```javascript
// next.config.js - Otimizações para produção
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features
  experimental: {
    optimizeCss: true, // Otimizar CSS
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Configurações de build
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configurações do webpack para Tailwind
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Otimizações para produção
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          tailwind: {
            name: 'tailwind',
            test: /[\\/]node_modules[\\/]tailwindcss[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;

// tailwind.config.js - Otimizações de performance
module.exports = {
  content: [
    // Paths específicos para melhor tree-shaking
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Evitar glob patterns muito amplos
  ],
  
  // Configurações de JIT
  mode: 'jit',
  
  // Configurações de purge para produção
  purge: {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    // Whitelist para classes dinâmicas
    safelist: [
      'grid-cols-1',
      'grid-cols-2',
      'grid-cols-3',
      'grid-cols-4',
      'grid-cols-5',
      'grid-cols-6',
      'bg-red-500',
      'bg-green-500',
      'bg-blue-500',
      'text-red-500',
      'text-green-500',
      'text-blue-500',
    ],
    // Patterns para classes dinâmicas
    patterns: [
      /^grid-cols-(\d+)$/,
      /^bg-(red|green|blue|yellow|purple|pink|indigo)-(50|100|200|300|400|500|600|700|800|900)$/,
      /^text-(red|green|blue|yellow|purple|pink|indigo)-(50|100|200|300|400|500|600|700|800|900)$/,
    ],
  },
};
```

### Ferramentas e Workflow

#### Setup de Desenvolvimento Otimizado
```json
// .vscode/settings.json - Configurações do VS Code
{
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "typescript": "typescript"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "editor.quickSuggestions": {
    "strings": true
  },
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
}

// .prettierrc - Configuração do Prettier com plugin Tailwind
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindConfig": "./tailwind.config.js",
  "tailwindFunctions": ["clsx", "cn", "cva"]
}
```

```bash
# package.json scripts úteis
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    
    # Scripts específicos para Tailwind
    "tw:build": "tailwindcss -i ./app/globals.css -o ./dist/output.css --watch",
    "tw:build-prod": "tailwindcss -i ./app/globals.css -o ./dist/output.css --minify",
    "tw:analyze": "npx tailwindcss-analyzer",
    
    # Análise de bundle
    "analyze": "ANALYZE=true npm run build",
    "size-check": "npx size-limit"
  }
}
```

---

## 🎯 Resumo dos Conceitos Tailwind CSS

Este arquivo contém os principais conceitos do **Tailwind CSS** que todo desenvolvedor frontend deve dominar:

### Fundamentos Tailwind
- **Utility-First**: Abordagem baseada em classes utilitárias atômicas
- **Design System**: Sistema de design integrado com tokens consistentes
- **Mobile-First**: Responsive design por padrão
- **JIT Mode**: Compilação just-in-time para performance

### Configuração Avançada
- **Custom Config**: Personalização completa do sistema de design
- **Plugins**: Extensões para funcionalidades específicas
- **Next.js Integration**: Setup otimizado para Next.js
- **Performance**: Otimizações de bundle e purge

### Componentes e Patterns
- **Component Classes**: Criação de componentes reutilizáveis
- **Variants**: Sistema de variações com CVA
- **Dark Mode**: Implementação robusta de temas
- **Animations**: Animações e micro-interações

### Desenvolvimento Moderno
- **TypeScript**: Tipagem para props e variantes
- **Accessibility**: Padrões acessíveis por padrão
- **Performance**: Otimizações automáticas
- **Developer Experience**: Ferramentas e workflow otimizados
