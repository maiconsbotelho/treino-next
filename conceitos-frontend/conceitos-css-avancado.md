# Resumo de Conceitos CSS Avançado e UI/UX

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais de **CSS Avançado e UI/UX** que todo desenvolvedor frontend deve dominar para criar interfaces modernas, acessíveis e performáticas:

### 🎨 CSS Moderno e Layouts
- `CSS Grid` - Layouts bidimensionais complexos
- `Flexbox` - Layouts unidimensionais flexíveis
- `Container Queries` - Queries baseadas no container
- `CSS Subgrid` - Grids aninhados

### 🎭 Animações e Transições
- `CSS Animations` - Animações nativas performáticas
- `Framer Motion` - Animações React avançadas
- `GSAP` - Animações profissionais
- `Lottie` - Animações vetoriais

### 🎯 Design Systems
- `Atomic Design` - Metodologia de componentes
- `Design Tokens` - Variáveis de design sistemáticas
- `Component Libraries` - Bibliotecas reutilizáveis
- `Style Guides` - Guias de estilo consistentes

### 📱 Responsive Design Avançado
- `Fluid Typography` - Tipografia fluida
- `Intrinsic Web Design` - Design intrínseco
- `Mobile-First` - Abordagem mobile primeiro
- `Progressive Enhancement` - Melhoria progressiva

### 🌙 Temas e Customização
- `CSS Custom Properties` - Variáveis CSS dinâmicas
- `Dark Mode` - Modo escuro automático
- `Dynamic Theming` - Temas dinâmicos
- `CSS-in-JS` - Estilos em JavaScript

### ♿ Acessibilidade (a11y)
- `ARIA` - Atributos de acessibilidade
- `Focus Management` - Gerenciamento de foco
- `Screen Reader Support` - Suporte a leitores de tela
- `Color Contrast` - Contraste de cores

### ⚡ Performance CSS
- `Critical CSS` - CSS crítico inline
- `CSS Containment` - Isolamento de estilos
- `Layer Management` - Gerenciamento de camadas
- `Paint Optimization` - Otimização de renderização

### 🎪 Efeitos Visuais
- `CSS Masks` - Máscaras e recortes
- `Clip Path` - Recortes personalizados
- `Backdrop Filter` - Filtros de fundo
- `CSS Shapes` - Formas personalizadas

### 📐 Metodologias CSS
- `BEM` - Block Element Modifier
- `OOCSS` - Object Oriented CSS
- `SMACSS` - Scalable and Modular CSS
- `Atomic CSS` - CSS atômico/utilitário

### 🛠️ Ferramentas Modernas
- `PostCSS` - Processamento moderno de CSS
- `Tailwind CSS` - Framework utility-first
- `Styled Components` - CSS-in-JS para React
- `Emotion` - CSS-in-JS performático

> **Nota**: Este arquivo foca em técnicas avançadas de CSS e padrões de UI/UX modernos

---

## CSS Avançado e UI/UX

### CSS Grid Avançado

#### Layouts Complexos com Grid
```css
/* Grid container avançado */
.advanced-grid {
  display: grid;
  grid-template-columns: 
    [sidebar-start] 250px 
    [content-start] 1fr 
    [aside-start] 300px 
    [aside-end];
  grid-template-rows: 
    [header-start] 80px 
    [main-start] 1fr 
    [footer-start] 60px 
    [footer-end];
  grid-template-areas:
    "sidebar header header"
    "sidebar content aside"
    "sidebar footer footer";
  gap: 20px;
  min-height: 100vh;
}

/* Grid items com posicionamento específico */
.header {
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  padding: 0 20px;
}

.sidebar {
  grid-area: sidebar;
  background: var(--sidebar-bg);
  padding: 20px;
  overflow-y: auto;
}

.main-content {
  grid-area: content;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
}

.aside {
  grid-area: aside;
  display: grid;
  grid-template-rows: repeat(auto-fit, minmax(200px, auto));
  gap: 15px;
}

/* Subgrid para componentes internos */
.card-grid {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  gap: inherit;
}

/* Grid responsivo com container queries */
@container (max-width: 768px) {
  .advanced-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "content"
      "aside"
      "sidebar"
      "footer";
  }
}
```

#### CSS Container Queries
```css
/* Container query setup */
.component-container {
  container-type: inline-size;
  container-name: component;
}

/* Queries baseadas no tamanho do container */
@container component (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
  }
  
  .card-image {
    width: 120px;
    height: 120px;
  }
}

@container component (min-width: 600px) {
  .card {
    grid-template-columns: auto 1fr auto;
  }
  
  .card-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

/* Container queries para diferentes orientações */
@container (orientation: portrait) {
  .media-container {
    aspect-ratio: 3/4;
  }
}

@container (orientation: landscape) {
  .media-container {
    aspect-ratio: 16/9;
  }
}
```

### Animações CSS Avançadas

#### Animações Performáticas
```css
/* Animações com transform e opacity (performance otimizada) */
@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulseScale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Animação com cubic-bezier personalizado */
@keyframes smoothBounce {
  0% {
    transform: translateY(-100%);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  20% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  40% {
    transform: translateY(-30%);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  60% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  80% {
    transform: translateY(-15%);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }
  100% {
    transform: translateY(0);
  }
}

/* Classe para animações com will-change */
.animate-element {
  will-change: transform, opacity;
  animation: slideInFromRight 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

/* Remover will-change após animação */
.animate-element.animation-complete {
  will-change: auto;
}

/* Animações com CSS custom properties */
.morphing-button {
  --button-color: #3b82f6;
  --hover-scale: 1.05;
  --transition-duration: 0.3s;
  
  background: var(--button-color);
  transition: 
    transform var(--transition-duration) ease-out,
    box-shadow var(--transition-duration) ease-out;
}

.morphing-button:hover {
  transform: scale(var(--hover-scale));
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
```

#### Framer Motion Patterns
```jsx
// components/AnimatedComponents.jsx
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

// Variantes de animação reutilizáveis
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const slideInFromSide = (direction = 'left') => ({
  hidden: {
    x: direction === 'left' ? -100 : 100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
});

// Componente com animação de scroll
export function ScrollTriggeredAnimation({ children }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  );
}

// Lista com stagger animation
export function StaggeredList({ items }) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="staggered-list"
    >
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="list-item"
        >
          {item.content}
        </motion.li>
      ))}
    </motion.ul>
  );
}

// Modal com backdrop animation
export function AnimatedModal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Drag and drop component
export function DraggableCard({ children }) {
  return (
    <motion.div
      className="draggable-card"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.05, rotate: 5 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}
```

### Design Systems com CSS Custom Properties

#### Design Tokens Sistema
```css
/* design-tokens.css */
:root {
  /* Color Tokens */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;
  
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-500: #6b7280;
  --color-neutral-900: #111827;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Typography Tokens */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  
  /* Spacing Tokens */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  
  /* Border Radius Tokens */
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-base: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-full: 9999px;
  
  /* Shadow Tokens */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Transition Tokens */
  --transition-fast: 150ms ease-out;
  --transition-base: 250ms ease-out;
  --transition-slow: 350ms ease-out;
  
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Dark Mode Tokens */
[data-theme="dark"] {
  --color-neutral-50: #1f2937;
  --color-neutral-100: #374151;
  --color-neutral-200: #4b5563;
  --color-neutral-500: #9ca3af;
  --color-neutral-900: #f9fafb;
  
  --color-primary-50: #1e3a8a;
  --color-primary-100: #1d4ed8;
  --color-primary-500: #60a5fa;
  --color-primary-900: #dbeafe;
}
```

#### Component System baseado em Tokens
```css
/* components/Button.css */
.btn {
  /* Base styles usando tokens */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  
  transition: all var(--transition-base) var(--easing-ease-out);
  
  /* Prevent layout shift */
  box-sizing: border-box;
}

/* Size variants */
.btn--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  min-height: 2rem;
}

.btn--md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  min-height: 2.5rem;
}

.btn--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-lg);
  min-height: 3rem;
}

/* Color variants */
.btn--primary {
  background-color: var(--color-primary-500);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn--primary:hover {
  background-color: var(--color-primary-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn--primary:active {
  background-color: var(--color-primary-600);
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn--secondary {
  background-color: transparent;
  color: var(--color-primary-500);
  border-color: var(--color-primary-500);
}

.btn--secondary:hover {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-600);
}

/* State variants */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Icon button variant */
.btn--icon {
  padding: var(--space-2);
  min-width: 2.5rem;
}

.btn--icon.btn--sm {
  min-width: 2rem;
}

.btn--icon.btn--lg {
  min-width: 3rem;
}
```

### Fluid Typography e Responsive Design

#### Typography Responsiva com clamp()
```css
/* Fluid typography system */
.heading-1 {
  font-size: clamp(2rem, 5vw + 1rem, 4rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.heading-2 {
  font-size: clamp(1.5rem, 4vw + 0.5rem, 2.5rem);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.heading-3 {
  font-size: clamp(1.25rem, 3vw + 0.25rem, 1.875rem);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}

.body-large {
  font-size: clamp(1rem, 2vw + 0.25rem, 1.25rem);
  line-height: var(--line-height-relaxed);
}

.body-base {
  font-size: clamp(0.875rem, 1.5vw + 0.125rem, 1rem);
  line-height: var(--line-height-normal);
}

/* Fluid spacing */
.section {
  padding-block: clamp(3rem, 8vw, 8rem);
}

.container {
  max-width: min(90%, 1200px);
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2rem);
}

/* Responsive grid with auto-fit */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

/* Intrinsic web design patterns */
.flexible-card {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Permite shrinking */
}

@container (min-width: 300px) {
  .flexible-card {
    flex-direction: row;
  }
  
  .flexible-card__image {
    aspect-ratio: 1;
    flex: 0 0 auto;
    width: 120px;
  }
}

@container (min-width: 500px) {
  .flexible-card {
    align-items: center;
  }
  
  .flexible-card__content {
    flex: 1;
  }
}
```

### Dark Mode e Theming Dinâmico

#### Sistema de Temas Robusto
```javascript
// utils/themeManager.js
class ThemeManager {
  constructor() {
    this.currentTheme = this.getInitialTheme();
    this.subscribers = new Set();
    this.init();
  }

  getInitialTheme() {
    // Verificar localStorage primeiro
    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    // Verificar preferência do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.watchSystemPreference();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === 'dark' ? '#1f2937' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('theme', theme);
    this.notifySubscribers();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  watchSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Só aplicar se não houver preferência salva
      if (!localStorage.getItem('theme')) {
        const systemTheme = e.matches ? 'dark' : 'light';
        this.setTheme(systemTheme);
      }
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.currentTheme));
  }

  getTheme() {
    return this.currentTheme;
  }
}

export const themeManager = new ThemeManager();

// React Hook para tema
export function useTheme() {
  const [theme, setTheme] = useState(themeManager.getTheme());

  useEffect(() => {
    return themeManager.subscribe(setTheme);
  }, []);

  return {
    theme,
    setTheme: themeManager.setTheme.bind(themeManager),
    toggleTheme: themeManager.toggleTheme.bind(themeManager),
  };
}
```

```css
/* CSS com transições suaves entre temas */
:root {
  /* Definir transições para propriedades que mudam com tema */
  --theme-transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

* {
  transition: var(--theme-transition);
}

/* Desabilitar transições durante carregamento inicial */
.no-transition * {
  transition: none !important;
}

/* Tema light (padrão) */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}

/* Tema dark */
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}

/* Componentes usando variáveis de tema */
.theme-aware-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* Media query para respeitar preferência do sistema */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --border-color: #334155;
  }
}

/* Override quando tema específico é definido */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
```

### Acessibilidade Avançada

#### ARIA e Screen Reader Support
```jsx
// components/AccessibleComponents.jsx
import { useId, useRef, useState, useEffect } from 'react';

// Dialog/Modal acessível
export function AccessibleModal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  initialFocus 
}) {
  const titleId = useId();
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Salvar foco anterior
      previousFocusRef.current = document.activeElement;
      
      // Focar no modal ou elemento específico
      if (initialFocus) {
        initialFocus.current?.focus();
      } else {
        modalRef.current?.focus();
      }

      // Trap focus no modal
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
        
        if (e.key === 'Tab') {
          trapFocus(e, modalRef.current);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restaurar foco anterior
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose, initialFocus]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="modal-content">
        <header className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="modal-close"
          >
            ×
          </button>
        </header>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

// Função para trap focus
function trapFocus(e, container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
}

// Combobox/Select acessível
export function AccessibleCombobox({ 
  options, 
  value, 
  onChange, 
  placeholder = "Selecione uma opção",
  label 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const comboboxId = useId();
  const listboxId = useId();
  const labelId = useId();
  
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            Math.min(prev + 1, options.length - 1)
          );
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => Math.max(prev - 1, 0));
        }
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex]);
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
    }
  };

  return (
    <div className="combobox-container">
      {label && (
        <label id={labelId} htmlFor={comboboxId}>
          {label}
        </label>
      )}
      
      <button
        ref={buttonRef}
        id={comboboxId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        aria-controls={isOpen ? listboxId : undefined}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
        className="combobox-button"
      >
        {value?.label || placeholder}
        <span aria-hidden="true">▼</span>
      </button>
      
      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="combobox-list"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value?.value === option.value}
              className={`combobox-option ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Hook para announcements acessíveis
export function useScreenReaderAnnouncement() {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message, priority = 'polite') => {
    setAnnouncement(''); // Limpar primeiro
    setTimeout(() => setAnnouncement(message), 10);
  };

  return {
    announce,
    announcement: (
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    ),
  };
}
```

### Performance CSS Avançada

#### Critical CSS e Otimizações
```css
/* Critical CSS inline - above the fold content */
.critical-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Use contain para otimização */
  contain: layout style paint;
}

/* Non-critical CSS - carregado de forma lazy */
.non-critical-component {
  /* Lazy loaded styles */
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.non-critical-component.loaded {
  opacity: 1;
  transform: translateY(0);
}

/* CSS Containment para isolamento */
.independent-component {
  contain: layout style paint;
}

.size-contained {
  contain: size layout style paint;
}

/* Otimizações de paint */
.gpu-accelerated {
  transform: translateZ(0); /* Force GPU layer */
  will-change: transform; /* Hint browser for optimization */
}

/* Remover will-change após animação */
.gpu-accelerated.animation-complete {
  will-change: auto;
}

/* Otimização de reflow/repaint */
.optimized-animation {
  /* Use transform/opacity instead of width/height/top/left */
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Pseudo-elements para elementos decorativos */
.decorated-element::before {
  content: '';
  position: absolute;
  /* Decorative elements via CSS instead of DOM */
}

/* Content-visibility para lazy rendering */
.long-content-section {
  content-visibility: auto;
  contain-intrinsic-size: 1000px; /* Estimated height */
}

/* Custom scrollbar otimizado */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary-300) var(--color-neutral-100);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--color-neutral-100);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-primary-300);
  border-radius: 4px;
}
```

---

## 🎯 Resumo dos Conceitos CSS Avançado e UI/UX

Este arquivo contém os principais conceitos de **CSS Avançado e UI/UX** que todo desenvolvedor frontend deve dominar:

### Layouts Modernos
- **CSS Grid Avançado**: Layouts complexos com subgrid e named lines
- **Container Queries**: Queries baseadas no tamanho do container
- **Intrinsic Web Design**: Design que se adapta ao conteúdo
- **Flexbox Avançado**: Layouts flexíveis com gap e order

### Design Systems
- **Design Tokens**: Sistema de variáveis CSS organizadas
- **Component Architecture**: Componentes modulares e reutilizáveis
- **Atomic Design**: Metodologia de design sistemática
- **Theming**: Sistemas de temas dinâmicos e dark mode

### Animações e Performance
- **CSS Animations**: Animações nativas performáticas
- **Framer Motion**: Animações React avançadas
- **Performance Optimization**: GPU acceleration e containment
- **Critical CSS**: Estratégias de carregamento otimizado

### Acessibilidade (A11y)
- **ARIA Patterns**: Implementação de padrões acessíveis
- **Focus Management**: Gerenciamento de foco para screen readers
- **Semantic HTML**: HTML semântico para acessibilidade
- **Color Contrast**: Garantia de contraste adequado
