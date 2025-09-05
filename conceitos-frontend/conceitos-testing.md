# Resumo de Conceitos de Testing Frontend

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais de **Testing** que todo desenvolvedor frontend deve dominar para garantir qualidade, confiabilidade e manutenibilidade do código:

### 🧪 Tipos de Teste
- Testes Unitários - Funções e componentes isolados
- Testes de Integração - Interação entre módulos
- Testes E2E (End-to-End) - Fluxos completos do usuário
- Testes de Performance - Velocidade e otimização

### 🎯 Ferramentas Essenciais
- `Jest` - Framework de testes JavaScript
- `Testing Library` - Testes centrados no usuário
- `Cypress` - Testes E2E modernos
- `Vitest` - Testes rápidos para Vite

### ⚛️ Testes React/Next.js
- Renderização de componentes
- Hooks e Context testing
- Mocking de APIs e módulos
- Snapshot testing

### 🌐 Testes de APIs
- Requisições HTTP/REST
- Mocking de endpoints
- Testes de autenticação
- Validação de responses

### 🎭 Mocking e Stubs
- Mock de funções e módulos
- Fake data generation
- Service workers para testes
- Environment mocking

### 📊 Coverage e Métricas
- Code coverage reports
- Test-driven development (TDD)
- Behavior-driven development (BDD)
- Continuous Integration (CI)

### 🔍 Debugging e Troubleshooting
- Debug de testes falhando
- Async testing patterns
- Error boundary testing
- Performance testing

### ⚡ Otimização de Testes
- Parallel test execution
- Test setup e teardown
- Shared test utilities
- Custom matchers

### 🚀 Testes Avançados
- Visual regression testing
- Accessibility testing
- Cross-browser testing
- Mobile testing

### 🛠️ Setup e Configuração
- Configuração de ambiente de testes
- CI/CD pipeline integration
- Pre-commit hooks
- Test automation

> **Nota**: Para conceitos específicos de frameworks, consulte `conceitos-react.md`, `conceitos-nextjs.md` e `conceitos-typescript.md`

---

## Testing Frontend

### Jest - Framework de Testes JavaScript

#### Configuração Básica do Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
};

// src/setupTests.js
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};
```

#### Testes Unitários com Jest
```javascript
// utils/math.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

// utils/formatters.js
export const formatCurrency = (amount, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date, locale = 'pt-BR') => {
  return new Date(date).toLocaleDateString(locale);
};

// __tests__/utils/math.test.js
import { add, multiply, divide } from '../utils/math';

describe('Math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should handle zero', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should return zero when multiplying by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});

// __tests__/utils/formatters.test.js
import { formatCurrency, formatDate } from '../utils/formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format BRL currency', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });

    it('should format USD currency', () => {
      expect(formatCurrency(1234.56, 'USD')).toContain('$');
    });
  });

  describe('formatDate', () => {
    it('should format date in pt-BR locale', () => {
      const date = '2023-12-25';
      const formatted = formatDate(date);
      expect(formatted).toBe('25/12/2023');
    });
  });
});
```

### React Testing Library

#### Testando Componentes React
```jsx
// components/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  loading = false,
  ...props 
}) => {
  const className = `btn btn-${variant} ${disabled ? 'disabled' : ''}`;
  
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={loading ? 'Carregando...' : undefined}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};

export default Button;

// components/__tests__/Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show loading state', () => {
    render(<Button loading>Click me</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByLabelText('Carregando...')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn btn-secondary');
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

#### Testando Hooks Customizados
```jsx
// hooks/useCounter.js
import { useState, useCallback } from 'react';

export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
};

// hooks/__tests__/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter hook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(12);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });

  it('should set specific value', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.setValue(42);
    });
    
    expect(result.current.count).toBe(42);
  });
});
```

#### Testando Context e Providers
```jsx
// contexts/AuthContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    loading: false,
  });

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simular API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const user = await response.json();
      dispatch({ type: 'LOGIN', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// contexts/__tests__/AuthContext.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';

// Componente de teste
const TestComponent = () => {
  const { isAuthenticated, user, login, logout, loading } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <div data-testid="user-info">
        {user ? user.name : 'No user'}
      </div>
      <div data-testid="loading">
        {loading ? 'Loading' : 'Not loading'}
      </div>
      <button onClick={() => login('test@email.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Mock fetch
global.fetch = jest.fn();

describe('AuthContext', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should provide initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const mockUser = { id: 1, name: 'John Doe', email: 'test@email.com' };
    
    fetch.mockResolvedValueOnce({
      json: async () => mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('John Doe');
    });

    expect(fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@email.com', password: 'password' }),
    });
  });

  it('should handle logout', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Primeiro fazer login
    fetch.mockResolvedValueOnce({
      json: async () => ({ id: 1, name: 'John Doe' }),
    });

    await user.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Depois fazer logout
    await user.click(screen.getByText('Logout'));

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
  });

  it('should throw error when useAuth is used outside provider', () => {
    // Suprimir console.error para este teste
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within AuthProvider');

    spy.mockRestore();
  });
});
```

### Testes de API e Requisições HTTP

#### Mocking de APIs com MSW (Mock Service Worker)
```javascript
// __tests__/setup/server.js
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const handlers = [
  // Mock para buscar usuários
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ])
    );
  }),

  // Mock para criar usuário
  rest.post('/api/users', async (req, res, ctx) => {
    const newUser = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        ...newUser,
        createdAt: new Date().toISOString(),
      })
    );
  }),

  // Mock para erro de API
  rest.get('/api/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ message: 'Internal server error' })
    );
  }),

  // Mock para autenticação
  rest.post('/api/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    if (email === 'test@email.com' && password === 'password') {
      return res(
        ctx.json({
          id: 1,
          name: 'Test User',
          email: 'test@email.com',
          token: 'fake-jwt-token',
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ message: 'Invalid credentials' })
    );
  }),
];

export const server = setupServer(...handlers);

// services/userService.js
export const userService = {
  async getUsers() {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  async createUser(userData) {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    return response.json();
  },

  async login(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  },
};

// services/__tests__/userService.test.js
import { userService } from '../userService';
import { server } from '../../__tests__/setup/server';

// Configurar MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('userService', () => {
  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      const users = await userService.getUsers();
      
      expect(users).toHaveLength(2);
      expect(users[0]).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should throw error on failed request', async () => {
      server.use(
        rest.get('/api/users', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      await expect(userService.getUsers()).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const newUser = { name: 'Bob Johnson', email: 'bob@example.com' };
      const createdUser = await userService.createUser(newUser);
      
      expect(createdUser).toMatchObject({
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
      });
      expect(createdUser.createdAt).toBeDefined();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const result = await userService.login('test@email.com', 'password');
      
      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@email.com',
        token: 'fake-jwt-token',
      });
    });

    it('should throw error with invalid credentials', async () => {
      await expect(
        userService.login('wrong@email.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### Testes E2E com Cypress

#### Configuração do Cypress
```javascript
// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});

// cypress/support/commands.js
// Comando customizado para login
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password') => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
  });
});

// Comando para limpar dados de teste
Cypress.Commands.add('clearTestData', () => {
  cy.request('DELETE', '/api/test/clear-data');
});

// Comando para criar dados de teste
Cypress.Commands.add('seedTestData', () => {
  cy.request('POST', '/api/test/seed-data');
});

// Comando para aguardar carregamento
Cypress.Commands.add('waitForLoadingToFinish', () => {
  cy.get('[data-testid="loading"]').should('not.exist');
});

// cypress/support/e2e.js
import './commands';

// Executar antes de cada teste
beforeEach(() => {
  cy.clearTestData();
  cy.seedTestData();
});
```

#### Testes E2E Práticos
```javascript
// cypress/e2e/auth.cy.js
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('contain', 'Test User');
  });

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('should validate required fields', () => {
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="email-error"]').should('contain', 'Email is required');
    cy.get('[data-testid="password-error"]').should('contain', 'Password is required');
  });

  it('should logout successfully', () => {
    cy.login();
    cy.visit('/dashboard');

    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();

    cy.url().should('include', '/login');
    cy.get('[data-testid="login-form"]').should('be.visible');
  });
});

// cypress/e2e/user-management.cy.js
describe('User Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/users');
  });

  it('should display list of users', () => {
    cy.waitForLoadingToFinish();
    
    cy.get('[data-testid="user-list"]').should('be.visible');
    cy.get('[data-testid="user-item"]').should('have.length.greaterThan', 0);
  });

  it('should create new user', () => {
    cy.get('[data-testid="add-user-button"]').click();

    cy.get('[data-testid="user-form"]').should('be.visible');
    cy.get('[data-testid="name-input"]').type('New User');
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'User created successfully');

    cy.get('[data-testid="user-list"]').should('contain', 'New User');
  });

  it('should edit existing user', () => {
    cy.get('[data-testid="user-item"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });

    cy.get('[data-testid="user-form"]').should('be.visible');
    cy.get('[data-testid="name-input"]').clear().type('Updated Name');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'User updated successfully');

    cy.get('[data-testid="user-list"]').should('contain', 'Updated Name');
  });

  it('should delete user with confirmation', () => {
    cy.get('[data-testid="user-item"]').first().within(() => {
      cy.get('[data-testid="delete-button"]').click();
    });

    cy.get('[data-testid="confirm-modal"]').should('be.visible');
    cy.get('[data-testid="confirm-delete"]').click();

    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'User deleted successfully');
  });

  it('should search and filter users', () => {
    cy.get('[data-testid="search-input"]').type('John');
    
    cy.get('[data-testid="user-item"]').each(($el) => {
      cy.wrap($el).should('contain.text', 'John');
    });

    cy.get('[data-testid="search-input"]').clear();
    cy.get('[data-testid="user-item"]').should('have.length.greaterThan', 1);
  });
});

// cypress/e2e/responsive.cy.js
describe('Responsive Design', () => {
  const viewports = [
    { device: 'mobile', width: 375, height: 667 },
    { device: 'tablet', width: 768, height: 1024 },
    { device: 'desktop', width: 1440, height: 900 },
  ];

  viewports.forEach(({ device, width, height }) => {
    context(`${device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit('/');
      });

      it('should display navigation correctly', () => {
        if (device === 'mobile') {
          cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
          cy.get('[data-testid="desktop-menu"]').should('not.be.visible');
        } else {
          cy.get('[data-testid="desktop-menu"]').should('be.visible');
          cy.get('[data-testid="mobile-menu-button"]').should('not.be.visible');
        }
      });

      it('should have readable text and clickable elements', () => {
        cy.get('button, a').each(($el) => {
          cy.wrap($el).should('have.css', 'min-height').and('match', /\d+/);
        });
      });
    });
  });
});
```

### Testes de Performance

#### Lighthouse CI e Web Vitals
```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000', 'http://localhost:3000/about'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

// __tests__/performance/webVitals.test.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Mock para testes de Web Vitals
const mockWebVitals = () => {
  const metrics = {};
  
  const mockMetric = (name, value) => {
    metrics[name] = value;
  };

  // Mock das funções do web-vitals
  jest.mock('web-vitals', () => ({
    getCLS: jest.fn((callback) => callback({ name: 'CLS', value: 0.05 })),
    getFID: jest.fn((callback) => callback({ name: 'FID', value: 80 })),
    getFCP: jest.fn((callback) => callback({ name: 'FCP', value: 1200 })),
    getLCP: jest.fn((callback) => callback({ name: 'LCP', value: 2100 })),
    getTTFB: jest.fn((callback) => callback({ name: 'TTFB', value: 300 })),
  }));

  return metrics;
};

describe('Web Vitals Performance', () => {
  it('should have acceptable Core Web Vitals scores', () => {
    const metrics = mockWebVitals();

    // Simular coleta de métricas
    getCLS((metric) => {
      expect(metric.value).toBeLessThan(0.1); // Good CLS
    });

    getFID((metric) => {
      expect(metric.value).toBeLessThan(100); // Good FID
    });

    getLCP((metric) => {
      expect(metric.value).toBeLessThan(2500); // Good LCP
    });
  });
});

// utils/performanceMonitor.js
export class PerformanceMonitor {
  static measureComponentRender(componentName) {
    return {
      start() {
        performance.mark(`${componentName}-start`);
      },
      end() {
        performance.mark(`${componentName}-end`);
        performance.measure(
          `${componentName}-render`,
          `${componentName}-start`,
          `${componentName}-end`
        );
        
        const measure = performance.getEntriesByName(`${componentName}-render`)[0];
        return measure.duration;
      },
    };
  }

  static measureApiCall(apiName) {
    return {
      start() {
        performance.mark(`${apiName}-start`);
      },
      end() {
        performance.mark(`${apiName}-end`);
        performance.measure(
          `${apiName}-call`,
          `${apiName}-start`,
          `${apiName}-end`
        );
        
        const measure = performance.getEntriesByName(`${apiName}-call`)[0];
        return measure.duration;
      },
    };
  }
}

// __tests__/performance/performanceMonitor.test.js
import { PerformanceMonitor } from '../../utils/performanceMonitor';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    // Clear performance entries
    performance.clearMarks();
    performance.clearMeasures();
  });

  it('should measure component render time', () => {
    const monitor = PerformanceMonitor.measureComponentRender('TestComponent');
    
    monitor.start();
    
    // Simular renderização
    const startTime = performance.now();
    while (performance.now() - startTime < 50) {
      // Simular trabalho
    }
    
    const duration = monitor.end();
    
    expect(duration).toBeGreaterThan(40);
    expect(duration).toBeLessThan(100);
  });

  it('should measure API call duration', () => {
    const monitor = PerformanceMonitor.measureApiCall('getUserData');
    
    monitor.start();
    
    // Simular delay da API
    const startTime = performance.now();
    while (performance.now() - startTime < 30) {
      // Simular trabalho
    }
    
    const duration = monitor.end();
    
    expect(duration).toBeGreaterThan(20);
    expect(duration).toBeLessThan(60);
  });
});
```

### Testes de Acessibilidade

#### Testing com Jest-Axe
```javascript
// __tests__/accessibility/a11y.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Adicionar matcher customizado
expect.extend(toHaveNoViolations);

// Componente de exemplo
const AccessibleForm = () => (
  <form>
    <label htmlFor="name">Nome:</label>
    <input id="name" type="text" required />
    
    <label htmlFor="email">Email:</label>
    <input id="email" type="email" required />
    
    <button type="submit">Enviar</button>
  </form>
);

const InaccessibleForm = () => (
  <form>
    <div>Nome:</div>
    <input type="text" />
    
    <div>Email:</div>
    <input type="email" />
    
    <div onClick={() => {}}>Enviar</div>
  </form>
);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations - accessible form', async () => {
    const { container } = render(<AccessibleForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should detect accessibility violations - inaccessible form', async () => {
    const { container } = render(<InaccessibleForm />);
    const results = await axe(container);
    
    // Esperar que existam violações
    expect(results.violations.length).toBeGreaterThan(0);
  });

  it('should have proper heading hierarchy', async () => {
    const Component = () => (
      <div>
        <h1>Título Principal</h1>
        <h2>Subtítulo</h2>
        <h3>Sub-subtítulo</h3>
      </div>
    );

    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper color contrast', async () => {
    const Component = () => (
      <div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
        Texto com bom contraste
      </div>
    );

    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// cypress/e2e/accessibility.cy.js
describe('Accessibility E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe(); // Plugin cypress-axe
  });

  it('should not have accessibility violations on homepage', () => {
    cy.checkA11y();
  });

  it('should be navigable by keyboard', () => {
    cy.get('body').tab();
    cy.focused().should('have.attr', 'href'); // Primeiro link

    cy.focused().tab();
    cy.focused().should('be.visible');
  });

  it('should have proper ARIA labels', () => {
    cy.get('[aria-label]').each(($el) => {
      cy.wrap($el).should('have.attr', 'aria-label').and('not.be.empty');
    });
  });

  it('should have proper heading structure', () => {
    cy.get('h1').should('have.length', 1);
    
    let lastLevel = 0;
    cy.get('h1, h2, h3, h4, h5, h6').each(($heading) => {
      const level = parseInt($heading.prop('tagName').substring(1));
      expect(level).to.be.at.most(lastLevel + 1);
      lastLevel = level;
    });
  });
});
```

### Setup de CI/CD para Testes

#### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage --watchAll=false
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm start &
        
      - name: Wait for application
        run: npx wait-on http://localhost:3000
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          wait-on: 'http://localhost:3000'
          wait-on-timeout: 120
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}

  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm start &
        
      - name: Wait for application
        run: npx wait-on http://localhost:3000
      
      - name: Run Lighthouse CI
        run: npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

# package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=__tests__",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "lighthouse": "lhci autorun"
  }
}
```

### Utilitários de Teste

#### Test Utilities Personalizados
```javascript
// __tests__/utils/testUtils.jsx
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Wrapper customizado para testes
const AllTheProviders = ({ children, initialEntries = ['/'] }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

// Função render customizada
const customRender = (ui, options = {}) => {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders {...options}>{children}</AllTheProviders>
    ),
    ...options,
  });
};

// Factory para criar dados de teste
export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  createdAt: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

export const createMockPost = (overrides = {}) => ({
  id: 1,
  title: 'Test Post',
  content: 'This is a test post content.',
  authorId: 1,
  published: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

// Helpers para testes assíncronos
export const waitForLoadingToFinish = () => {
  return screen.findByText(/loading/i).then(() => {
    return waitForElementToBeRemoved(screen.queryByText(/loading/i));
  }).catch(() => {
    // Loading pode não aparecer se for muito rápido
  });
};

// Mock para IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  window.IntersectionObserverEntry = mockIntersectionObserver;
};

// Mock para ResizeObserver
export const mockResizeObserver = () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Mock para LocalStorage
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  return localStorageMock;
};

// Matchers customizados
export const customMatchers = {
  toBeInTheViewport(received) {
    const rect = received.getBoundingClientRect();
    const pass = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );

    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in viewport`,
      pass,
    };
  },

  toHaveBeenCalledWithObjectContaining(received, expected) {
    const pass = received.mock.calls.some(call =>
      call.some(arg => 
        typeof arg === 'object' && 
        Object.keys(expected).every(key => arg[key] === expected[key])
      )
    );

    return {
      message: () => `expected function ${pass ? 'not ' : ''}to have been called with object containing ${JSON.stringify(expected)}`,
      pass,
    };
  },
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// __tests__/setup.js
import { customMatchers } from './utils/testUtils';

// Adicionar matchers customizados
expect.extend(customMatchers);

// Mock global do console para suprimir warnings em testes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps has been renamed')
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
```

---

## 🎯 Resumo dos Conceitos de Testing

Este arquivo contém os principais conceitos de **Testing Frontend** que todo desenvolvedor deve dominar:

### Ferramentas Fundamentais
- **Jest**: Framework de testes JavaScript completo
- **Testing Library**: Testes centrados na experiência do usuário
- **Cypress**: Testes E2E modernos e confiáveis
- **MSW**: Mock Service Worker para APIs

### Tipos de Teste Essenciais
- **Unitários**: Funções, componentes e hooks isolados
- **Integração**: Interação entre módulos e componentes
- **E2E**: Fluxos completos da aplicação
- **Acessibilidade**: Conformidade com padrões a11y

### Estratégias Avançadas
- **Mocking**: APIs, módulos e dependências externas
- **Performance**: Web Vitals e métricas de velocidade
- **Visual**: Regression testing e screenshots
- **Coverage**: Métricas de cobertura de código

### Integração e Automação
- **CI/CD**: Pipelines de teste automatizados
- **Hooks**: Pre-commit e pre-push testing
- **Monitoring**: Alertas e relatórios de qualidade
- **Documentation**: Living documentation através de testes
