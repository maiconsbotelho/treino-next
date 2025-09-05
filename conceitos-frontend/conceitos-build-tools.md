# Resumo de Conceitos Build Tools e Ferramentas Modernas

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais de **Build Tools e Ferramentas Modernas** que todo desenvolvedor frontend deve dominar para criar, otimizar e entregar aplicações eficientemente:

### 🏗️ Build Tools Fundamentais
- `Vite` - Build tool moderno e ultra-rápido
- `Webpack` - Bundler mais usado no mercado
- `esbuild` - Bundler extremamente rápido
- `Rollup` - Bundler para bibliotecas

### 📦 Package Managers
- `npm` - Node Package Manager padrão
- `yarn` - Package manager performático
- `pnpm` - Package manager com economia de espaço
- `bun` - Runtime e package manager ultra-rápido

### 🔧 Ferramentas de Desenvolvimento
- `ESLint` - Linting e qualidade de código
- `Prettier` - Formatação automática de código
- `Husky` - Git hooks para automação
- `lint-staged` - Lint apenas arquivos modificados

### 🎨 CSS e Styling Tools
- `PostCSS` - Processamento moderno de CSS
- `Tailwind CSS` - Framework utility-first
- `Sass/SCSS` - Preprocessador CSS
- `CSS Modules` - CSS escopo local

### ⚡ Performance e Otimização
- Code splitting e lazy loading
- Tree shaking para remover código morto
- Bundle analysis e otimização
- Cache strategies e service workers

### 🚀 DevOps e Deploy
- `Docker` - Containerização de aplicações
- `Vercel/Netlify` - Deploy de frontend
- `GitHub Actions` - CI/CD automation
- Environment variables e configuração

### 🛡️ Monitoramento e Debugging
- Error tracking com Sentry
- Performance monitoring
- Browser DevTools avançados
- Lighthouse e Web Vitals

### 📱 Ferramentas Mobile
- Progressive Web Apps (PWA)
- Mobile debugging e testing
- App shell e service workers
- Responsive design tools

### 🔍 Análise e Métricas
- Bundle analyzers
- Performance profiling
- User analytics e tracking
- A/B testing tools

### 🌐 Ferramentas Modernas
- `Storybook` - Desenvolvimento de componentes
- `Figma/Sketch` - Design systems
- `Chrome DevTools` - Debugging avançado
- `VS Code` - Editor e extensões

> **Nota**: Este arquivo complementa os conceitos de JavaScript, React, Next.js, TypeScript e Testing

---

## Build Tools e Ferramentas Modernas

### Vite - Build Tool Moderno

#### Configuração e Setup do Vite
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // React Fast Refresh
      fastRefresh: true,
      // Babel configuration
      babel: {
        plugins: ['@babel/plugin-transform-react-jsx'],
      },
    }),
  ],
  
  // Alias para imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  
  // Configurações de servidor de desenvolvimento
  server: {
    port: 3000,
    open: true, // Abre browser automaticamente
    hmr: {
      overlay: false, // Desabilita overlay de erros
    },
    proxy: {
      // Proxy para API durante desenvolvimento
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // Configurações de build
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Configurações de otimização
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns'],
        },
      },
    },
    // Limites de chunk size
    chunkSizeWarningLimit: 1000,
  },
  
  // Variáveis de ambiente
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // CSS configuration
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});

// vite.config.ts (TypeScript)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Suporte para importação de arquivos TypeScript
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[jt]sx?$/,
  },
});
```

#### Vite com React e Hot Module Replacement
```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Desenvolvimento com HMR
if (import.meta.env.DEV) {
  console.log('Modo desenvolvimento ativo');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.accept('./App.jsx', () => {
    // Re-renderizar quando App.jsx mudar
  });
}

// src/App.jsx
import { useState } from 'react';
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  // Usando import.meta.env para variáveis de ambiente
  const apiUrl = import.meta.env.VITE_API_URL;
  const isDev = import.meta.env.DEV;
  const mode = import.meta.env.MODE;

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      {isDev && (
        <div className="dev-info">
          <p>Modo: {mode}</p>
          <p>API URL: {apiUrl}</p>
        </div>
      )}
    </div>
  );
}

export default App;
```

### Package Managers Modernos

#### pnpm - Package Manager Eficiente
```bash
# Instalação do pnpm
npm install -g pnpm

# Comandos básicos
pnpm install                    # Instalar dependências
pnpm add react react-dom       # Adicionar dependências
pnpm add -D typescript         # Adicionar dev dependencies
pnpm remove lodash             # Remover dependência
pnpm update                    # Atualizar dependências

# Workspaces (monorepo)
pnpm install --recursive       # Instalar em todos os workspaces
pnpm run build --recursive     # Executar script em todos
pnpm --filter app build        # Executar apenas em um workspace
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'libs/*'

# package.json (root)
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "pnpm run --recursive build",
    "test": "pnpm run --recursive test",
    "lint": "pnpm run --recursive lint"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0"
  }
}
```

#### Bun - Runtime Ultra-Rápido
```bash
# Instalação do Bun
curl -fsSL https://bun.sh/install | bash

# Comandos básicos
bun install                    # Instalar dependências
bun add react                  # Adicionar dependência
bun remove react               # Remover dependência
bun run dev                    # Executar script
bun test                       # Executar testes

# Executar arquivos diretamente
bun run app.tsx               # Executar TypeScript sem compilar
```

```javascript
// bun.config.js
export default {
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'browser',
  format: 'esm',
  splitting: true,
  plugins: [],
};

// Servidor HTTP com Bun
// server.ts
import { serve } from 'bun';

const server = serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/') {
      return new Response('Hello Bun!', {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    
    if (url.pathname === '/api/users') {
      return Response.json([
        { id: 1, name: 'João' },
        { id: 2, name: 'Maria' },
      ]);
    }
    
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Server running on http://localhost:${server.port}`);
```

### ESLint e Prettier - Qualidade de Código

#### Configuração Moderna do ESLint
```javascript
// eslint.config.js (ESLint 9+ Flat Config)
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsx_a11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsx_a11y,
      prettier,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      
      // React rules
      'react/react-in-jsx-scope': 'off', // Next.js 13+ não precisa
      'react/prop-types': 'off', // TypeScript já faz validação
      'react/jsx-key': 'error',
      'react/jsx-no-target-blank': 'error',
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      
      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Prettier integration
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
```

#### Configuração do Prettier
```javascript
// prettier.config.js
export default {
  // Configurações básicas
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  tabWidth: 2,
  useTabs: false,
  
  // Quebra de linha
  printWidth: 80,
  endOfLine: 'lf',
  
  // JSX
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  
  // Outros
  arrowParens: 'avoid',
  bracketSpacing: true,
  proseWrap: 'preserve',
  
  // Configurações específicas por arquivo
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 100,
      },
    },
  ],
};

// .prettierignore
# Build outputs
dist/
build/
.next/

# Dependencies
node_modules/

# Generated files
*.log
.env*

# Documentation
CHANGELOG.md
```

### Husky e lint-staged - Git Hooks

#### Configuração de Git Hooks
```bash
# Instalação
npm install --save-dev husky lint-staged

# Inicializar husky
npx husky install

# Adicionar script no package.json
npm pkg set scripts.prepare="husky install"

# Criar hooks
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg "npx commitlint --edit $1"
npx husky add .husky/pre-push "npm run test"
```

```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,json,css,md}",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ],
    "*.{ts,tsx}": [
      "tsc --noEmit"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running lint-staged..."
npx lint-staged

echo "🧪 Running type check..."
npm run type-check

echo "✅ Pre-commit checks passed!"
```

### PostCSS e CSS Moderno

#### Configuração do PostCSS
```javascript
// postcss.config.js
export default {
  plugins: {
    // Importação de arquivos CSS
    'postcss-import': {},
    
    // Variáveis CSS personalizadas
    'postcss-custom-properties': {
      preserve: false,
    },
    
    // Nesting CSS
    'postcss-nesting': {},
    
    // Autoprefixer para compatibilidade
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11',
      ],
    },
    
    // Minificação em produção
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: false,
        }],
      },
    }),
    
    // Tailwind CSS (se usado)
    tailwindcss: {},
  },
};

// tailwind.config.js (se usando Tailwind)
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

#### CSS Modules e Styled Components
```css
/* styles/Button.module.css */
.button {
  @apply px-4 py-2 rounded transition-colors;
  background: var(--color-primary);
  color: white;
}

.button:hover {
  background: var(--color-primary-dark);
}

.button.secondary {
  background: var(--color-secondary);
}

.button.large {
  @apply px-6 py-3 text-lg;
}

/* Usando custom properties */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #6b7280;
}
```

```jsx
// components/Button.jsx
import styles from './Button.module.css';
import clsx from 'clsx';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className,
  ...props 
}) {
  const buttonClass = clsx(
    styles.button,
    styles[variant],
    styles[size],
    className
  );

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}

// Com Styled Components (alternativa)
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${props => props.size === 'large' ? '12px 24px' : '8px 16px'};
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#6b7280'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#4b5563'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

### Docker e Containerização

#### Dockerfile para Aplicações Frontend
```dockerfile
# Dockerfile
# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm e dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm run build

# Estágio 2: Produção
FROM nginx:alpine AS production

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta
EXPOSE 80

# Comando para iniciar
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Configurações de compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate max-age=0;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Configuração para SPA (Single Page Application)
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache para assets estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped

  # Serviço para desenvolvimento
  frontend-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: pnpm run dev
```

### Storybook - Desenvolvimento de Componentes

#### Setup do Storybook
```bash
# Instalação
npx storybook@latest init

# Executar Storybook
npm run storybook
```

```javascript
// .storybook/main.js
export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-design-tokens',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: 'tag',
  },
};

// .storybook/preview.js
import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    toc: true,
  },
};

export const globalTypes = {
  theme: {
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      title: 'Theme',
      icon: 'circlehollow',
      items: ['light', 'dark'],
    },
  },
};
```

```jsx
// src/components/Button/Button.stories.jsx
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Componente de botão reutilizável com múltiplas variações.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    onClick: { action: 'clicked' },
  },
};

// Template para reutilizar
const Template = (args) => <Button {...args} />;

// Stories
export const Primary = Template.bind({});
Primary.args = {
  children: 'Button Primary',
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Button Secondary',
  variant: 'secondary',
};

export const Large = Template.bind({});
Large.args = {
  children: 'Large Button',
  size: 'large',
};

export const AllVariants = () => (
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="danger">Danger</Button>
  </div>
);

AllVariants.parameters = {
  docs: {
    description: {
      story: 'Todas as variações do componente Button.',
    },
  },
};
```

### Progressive Web Apps (PWA)

#### Configuração de PWA
```javascript
// vite-plugin-pwa configuration
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Minha Aplicação PWA',
        short_name: 'MinhaApp',
        description: 'Descrição da minha aplicação PWA',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

```jsx
// src/hooks/usePWA.js
import { useEffect, useState } from 'react';

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listener para quando a app é instalada
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }

    return result.outcome === 'accepted';
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
  };
}

// Componente InstallButton
export function InstallButton() {
  const { isInstallable, installApp } = usePWA();

  if (!isInstallable) return null;

  return (
    <button
      onClick={installApp}
      className="pwa-install-button"
    >
      📱 Instalar App
    </button>
  );
}
```

### Performance Monitoring e Analytics

#### Web Vitals e Performance
```javascript
// src/utils/performance.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Função para enviar métricas
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  
  // Usar sendBeacon se disponível
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', {
      method: 'POST',
      body,
      keepalive: true,
    });
  }
}

// Configurar Web Vitals
export function setupWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

// Hook para monitorar performance de componentes
export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log performance
      if (duration > 100) {
        console.warn(`Slow component: ${componentName} (${duration.toFixed(2)}ms)`);
        
        // Enviar métrica se muito lento
        sendToAnalytics({
          name: 'component-performance',
          componentName,
          duration,
          timestamp: Date.now(),
        });
      }
    };
  });
}
```

```javascript
// src/utils/lighthouse.js
// Integração com Lighthouse CI
export async function runLighthouseAudit() {
  try {
    const response = await fetch('/api/lighthouse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: window.location.href,
        device: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      }),
    });
    
    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Lighthouse audit failed:', error);
    return null;
  }
}

// Função para verificar Core Web Vitals
export function checkCoreWebVitals() {
  return new Promise((resolve) => {
    const vitals = {};
    let collected = 0;
    const total = 3; // CLS, FID, LCP
    
    function checkComplete() {
      collected++;
      if (collected === total) {
        resolve(vitals);
      }
    }
    
    getCLS((metric) => {
      vitals.cls = metric;
      checkComplete();
    });
    
    getFID((metric) => {
      vitals.fid = metric;
      checkComplete();
    });
    
    getLCP((metric) => {
      vitals.lcp = metric;
      checkComplete();
    });
  });
}
```

---

## 🎯 Resumo dos Conceitos Build Tools e Ferramentas

Este arquivo contém os principais conceitos de **Build Tools e Ferramentas Modernas** que todo desenvolvedor frontend deve dominar:

### Ferramentas Fundamentais
- **Vite**: Build tool moderno com HMR ultra-rápido
- **Package Managers**: pnpm, yarn, bun para gestão eficiente
- **ESLint/Prettier**: Qualidade e formatação automática de código
- **Husky/lint-staged**: Automação com Git hooks

### Performance e Otimização
- **Bundle Analysis**: Análise e otimização de bundles
- **Code Splitting**: Carregamento inteligente de código
- **Web Vitals**: Monitoramento de métricas de performance
- **PWA**: Progressive Web Apps para experiências nativas

### DevOps e Deploy
- **Docker**: Containerização para deploy consistente
- **CI/CD**: Automação com GitHub Actions
- **Storybook**: Desenvolvimento isolado de componentes
- **Monitoring**: Tracking de erros e performance

### Desenvolvimento Moderno
- **TypeScript**: Configuração otimizada para produtividade
- **CSS Tools**: PostCSS, Tailwind, CSS Modules
- **Testing Integration**: Ferramentas integradas ao workflow
- **Browser DevTools**: Debugging avançado e profiling
