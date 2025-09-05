# Resumo de Conceitos de Arquitetura e Padrões Modernos

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais de **Arquitetura e Padrões Modernos** que todo desenvolvedor frontend deve dominar para criar aplicações escaláveis, maintíveis e robustas:

### 🏗️ Arquiteturas Frontend
- `Micro-frontends` - Arquitetura distribuída
- `JAMstack` - JavaScript, APIs e Markup
- `Server Components` - Componentes híbridos
- `Islands Architecture` - Hidratação seletiva

### 🎯 Padrões de Design
- `Component Composition` - Composição de componentes
- `Render Props` - Compartilhamento de lógica
- `Higher-Order Components` - Componentes de ordem superior
- `Custom Hooks` - Lógica reutilizável

### 📊 Gerenciamento de Estado
- `Flux/Redux` - Fluxo unidirecional
- `Zustand/Jotai` - Estado atômico
- `TanStack Query` - Cache de servidor
- `Context + Reducer` - Estado local complexo

### 🌐 Arquitetura de APIs
- `GraphQL` - Query language flexível
- `tRPC` - Type-safe APIs
- `BFF (Backend for Frontend)` - APIs especializadas
- `Serverless Functions` - Funções como serviço

### 🔄 Data Flow Patterns
- `CQRS` - Separação de comando e consulta
- `Event Sourcing` - Armazenamento baseado em eventos
- `Optimistic Updates` - Atualizações otimistas
- `Real-time Sync` - Sincronização em tempo real

### 🛡️ Padrões de Segurança
- `Authentication/Authorization` - Autenticação e autorização
- `CSRF/XSS Protection` - Proteção contra ataques
- `Content Security Policy` - Políticas de segurança
- `Secure Storage` - Armazenamento seguro

### 📱 Responsive Patterns
- `Mobile-First Design` - Design mobile first
- `Progressive Enhancement` - Melhoria progressiva
- `Adaptive Loading` - Carregamento adaptativo
- `Responsive Images` - Imagens responsivas

### ⚡ Performance Patterns
- `Code Splitting` - Divisão inteligente de código
- `Lazy Loading` - Carregamento tardio
- `Virtualization` - Virtualização de listas
- `Caching Strategies` - Estratégias de cache

### 🧪 Testing Patterns
- `Test-Driven Development` - Desenvolvimento orientado a testes
- `Behavior-Driven Development` - Desenvolvimento orientado a comportamento
- `Integration Testing` - Testes de integração
- `Visual Regression Testing` - Testes de regressão visual

### 🎨 UI/UX Patterns
- `Design Systems` - Sistemas de design
- `Atomic Design` - Design atômico
- `Accessibility First` - Acessibilidade primeiro
- `Dark Mode` - Modo escuro

> **Nota**: Este arquivo complementa os conceitos técnicos com padrões arquiteturais e de design

---

## Arquitetura e Padrões Modernos

### Micro-frontends - Arquitetura Distribuída

#### Implementação com Module Federation
```javascript
// webpack.config.js (Container App)
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3000,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        header: 'header@http://localhost:3001/remoteEntry.js',
        sidebar: 'sidebar@http://localhost:3002/remoteEntry.js',
        products: 'products@http://localhost:3003/remoteEntry.js',
      },
    }),
  ],
};

// webpack.config.js (Micro-frontend - Header)
module.exports = {
  mode: 'development',
  devServer: {
    port: 3001,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'header',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/components/Header',
        './Navigation': './src/components/Navigation',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

```jsx
// Container App
import React, { Suspense } from 'react';

// Importação dinâmica de micro-frontends
const Header = React.lazy(() => import('header/Header'));
const Sidebar = React.lazy(() => import('sidebar/Sidebar'));
const Products = React.lazy(() => import('products/ProductList'));

// Componente de erro para micro-frontends
function MicroFrontendErrorBoundary({ children, fallback }) {
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error, errorInfo) => {
        console.error('Micro-frontend error:', error, errorInfo);
        // Enviar erro para serviço de monitoramento
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// App principal
function App() {
  return (
    <div className="app">
      <MicroFrontendErrorBoundary fallback={<div>Header unavailable</div>}>
        <Suspense fallback={<div>Loading header...</div>}>
          <Header />
        </Suspense>
      </MicroFrontendErrorBoundary>

      <main className="main-content">
        <MicroFrontendErrorBoundary fallback={<div>Sidebar unavailable</div>}>
          <Suspense fallback={<div>Loading sidebar...</div>}>
            <Sidebar />
          </Suspense>
        </MicroFrontendErrorBoundary>

        <MicroFrontendErrorBoundary fallback={<div>Products unavailable</div>}>
          <Suspense fallback={<div>Loading products...</div>}>
            <Products />
          </Suspense>
        </MicroFrontendErrorBoundary>
      </main>
    </div>
  );
}

// Hook para comunicação entre micro-frontends
function useMicroFrontendCommunication() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const handleEvent = (event) => {
      if (event.origin !== window.location.origin) return;
      setEvents(prev => [...prev, event.data]);
    };

    window.addEventListener('message', handleEvent);
    return () => window.removeEventListener('message', handleEvent);
  }, []);

  const sendEvent = (type, payload) => {
    window.postMessage({ type, payload, timestamp: Date.now() }, '*');
  };

  return { events, sendEvent };
}
```

### JAMstack e Static Site Generation

#### Implementação com Next.js e Headless CMS
```jsx
// pages/blog/[...slug].js - Rotas dinâmicas
import { getAllPosts, getPostBySlug } from '../../lib/cms';

export default function BlogPost({ post, relatedPosts }) {
  return (
    <article className="blog-post">
      <header>
        <h1>{post.title}</h1>
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString()}
        </time>
      </header>

      <div 
        className="content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <aside>
        <h3>Posts Relacionados</h3>
        {relatedPosts.map(related => (
          <Link key={related.slug} href={`/blog/${related.slug}`}>
            <a>{related.title}</a>
          </Link>
        ))}
      </aside>
    </article>
  );
}

// ISG com revalidação
export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug.join('/'));
  
  if (!post) {
    return { notFound: true };
  }

  const relatedPosts = await getRelatedPosts(post.id, 3);

  return {
    props: { post, relatedPosts },
    revalidate: 60, // Revalida a cada 1 minuto
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts(['slug']);
  
  const paths = posts.map(post => ({
    params: { slug: post.slug.split('/') },
  }));

  return {
    paths,
    fallback: 'blocking', // Gera páginas sob demanda
  };
}
```

```javascript
// lib/cms.js - Integração com Headless CMS
class CMSClient {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async request(query, variables = {}) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        throw new Error(errors[0].message);
      }

      return data;
    } catch (error) {
      console.error('CMS request failed:', error);
      throw error;
    }
  }

  async getAllPosts(fields = []) {
    const query = `
      query GetAllPosts {
        posts {
          ${fields.join('\n')}
        }
      }
    `;

    const data = await this.request(query);
    return data.posts;
  }

  async getPostBySlug(slug) {
    const query = `
      query GetPostBySlug($slug: String!) {
        post(where: { slug: $slug }) {
          id
          title
          content
          slug
          publishedAt
          author {
            name
            avatar
          }
          tags {
            name
            slug
          }
        }
      }
    `;

    const data = await this.request(query, { slug });
    return data.post;
  }
}

export const cmsClient = new CMSClient(
  process.env.CMS_API_URL,
  process.env.CMS_API_KEY
);
```

### TanStack Query - Server State Management

#### Configuração e Uso Avançado
```jsx
// lib/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error) => {
        // Não tentar novamente em erros 4xx
        if (error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
        // Mostrar notificação de erro
      },
    },
  },
});

// hooks/useApiQuery.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Hook genérico para queries
export function useApiQuery(key, fetcher, options = {}) {
  return useQuery({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  });
}

// Hook para usuários
export function useUsers() {
  return useApiQuery(
    ['users'],
    () => fetch('/api/users').then(res => res.json()),
    {
      staleTime: 2 * 60 * 1000, // 2 minutos
    }
  );
}

// Hook para usuário específico
export function useUser(userId) {
  return useApiQuery(
    ['users', userId],
    () => fetch(`/api/users/${userId}`).then(res => res.json()),
    {
      enabled: !!userId, // Só executa se userId existir
    }
  );
}

// Hook para mutações de usuário
export function useUserMutations() {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: (userData) => 
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }).then(res => res.json()),
    onSuccess: () => {
      // Invalidar cache de usuários
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ userId, userData }) =>
      fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }).then(res => res.json()),
    onSuccess: (data, variables) => {
      // Atualizar cache específico
      queryClient.setQueryData(['users', variables.userId], data);
      // Invalidar lista de usuários
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (userId) =>
      fetch(`/api/users/${userId}`, { method: 'DELETE' }),
    onSuccess: (_, userId) => {
      // Remover do cache
      queryClient.removeQueries({ queryKey: ['users', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { createUser, updateUser, deleteUser };
}
```

#### Optimistic Updates e Background Sync
```jsx
// hooks/useOptimisticUpdates.js
export function useOptimisticTodos() {
  const queryClient = useQueryClient();

  const addTodo = useMutation({
    mutationFn: async (todo) => {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      return response.json();
    },
    
    // Optimistic update
    onMutate: async (newTodo) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot do estado anterior
      const previousTodos = queryClient.getQueryData(['todos']);

      // Atualização otimista
      queryClient.setQueryData(['todos'], (old) => [
        ...old,
        { ...newTodo, id: Date.now(), status: 'pending' },
      ]);

      return { previousTodos };
    },
    
    // Em caso de erro, reverter
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    
    // Sempre sincronizar no final
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return { addTodo };
}

// Background sync com Service Worker
export function useBackgroundSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Retry todas as queries falhadas
      queryClient.resumePausedMutations();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  return { isOnline };
}
```

### Design Patterns Avançados

#### Compound Components Pattern
```jsx
// components/Accordion/index.jsx
import React, { createContext, useContext, useState } from 'react';

// Context para comunicação entre componentes
const AccordionContext = createContext();

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion');
  }
  return context;
}

// Componente principal
export function Accordion({ children, allowMultiple = false, ...props }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggle = (id) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      
      return newSet;
    });
  };

  const value = {
    openItems,
    toggle,
    allowMultiple,
  };

  return (
    <AccordionContext.Provider value={value}>
      <div className="accordion" {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// Sub-componentes
export function AccordionItem({ id, children, ...props }) {
  const { openItems } = useAccordion();
  const isOpen = openItems.has(id);

  return (
    <div 
      className={`accordion-item ${isOpen ? 'open' : ''}`}
      data-testid={`accordion-item-${id}`}
      {...props}
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { id, isOpen })
      )}
    </div>
  );
}

export function AccordionTrigger({ id, children, ...props }) {
  const { toggle } = useAccordion();

  return (
    <button
      className="accordion-trigger"
      onClick={() => toggle(id)}
      aria-expanded={props.isOpen}
      aria-controls={`accordion-content-${id}`}
      {...props}
    >
      {children}
      <span className={`accordion-icon ${props.isOpen ? 'rotated' : ''}`}>
        ▼
      </span>
    </button>
  );
}

export function AccordionContent({ id, isOpen, children, ...props }) {
  return (
    <div
      id={`accordion-content-${id}`}
      className={`accordion-content ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      {...props}
    >
      {children}
    </div>
  );
}

// Uso do Compound Component
function MyAccordion() {
  return (
    <Accordion allowMultiple>
      <AccordionItem id="item1">
        <AccordionTrigger>Primeira Seção</AccordionTrigger>
        <AccordionContent>
          Conteúdo da primeira seção...
        </AccordionContent>
      </AccordionItem>

      <AccordionItem id="item2">
        <AccordionTrigger>Segunda Seção</AccordionTrigger>
        <AccordionContent>
          Conteúdo da segunda seção...
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

#### Render Props e Function as Children
```jsx
// components/DataFetcher.jsx
export function DataFetcher({ url, children, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        
        const result = await response.json();
        
        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  const state = { data, loading, error };

  // Suporte para render prop ou children como função
  if (typeof render === 'function') {
    return render(state);
  }

  if (typeof children === 'function') {
    return children(state);
  }

  // Fallback para children normal
  return children;
}

// Uso com render prop
function UserList() {
  return (
    <DataFetcher
      url="/api/users"
      render={({ data, loading, error }) => {
        if (loading) return <div>Carregando usuários...</div>;
        if (error) return <div>Erro: {error}</div>;
        
        return (
          <ul>
            {data?.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        );
      }}
    />
  );
}

// Uso com children como função
function ProductList() {
  return (
    <DataFetcher url="/api/products">
      {({ data, loading, error }) => {
        if (loading) return <ProductSkeleton />;
        if (error) return <ErrorMessage error={error} />;
        
        return (
          <div className="product-grid">
            {data?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        );
      }}
    </DataFetcher>
  );
}
```

### GraphQL e Type-Safe APIs

#### GraphQL com Code Generation
```typescript
// codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: 'src/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  },
};

export default config;

// queries/users.graphql
query GetUsers($limit: Int, $offset: Int) {
  users(limit: $limit, offset: $offset) {
    id
    name
    email
    avatar
    createdAt
  }
}

query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    avatar
    posts {
      id
      title
      publishedAt
    }
  }
}

mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```

```tsx
// hooks/useUsers.ts (gerado automaticamente)
import { useQuery, useMutation } from '@apollo/client';
import { 
  GetUsersQuery, 
  GetUsersQueryVariables,
  CreateUserMutation,
  CreateUserMutationVariables,
} from '../generated/graphql';

// Hook tipado para buscar usuários
export function useUsers(variables?: GetUsersQueryVariables) {
  return useQuery<GetUsersQuery, GetUsersQueryVariables>(GET_USERS, {
    variables,
    errorPolicy: 'all',
  });
}

// Hook tipado para criar usuário
export function useCreateUser() {
  return useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CREATE_USER,
    {
      update: (cache, { data }) => {
        if (data?.createUser) {
          // Atualizar cache Apollo
          cache.modify({
            fields: {
              users: (existingUsers = []) => [
                ...existingUsers,
                cache.writeFragment({
                  data: data.createUser,
                  fragment: gql`
                    fragment NewUser on User {
                      id
                      name
                      email
                    }
                  `,
                }),
              ],
            },
          });
        }
      },
    }
  );
}
```

### Authentication e Authorization Patterns

#### JWT com Refresh Token Pattern
```typescript
// lib/auth.ts
interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    if (typeof window === 'undefined') return;
    
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private saveTokensToStorage(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('expiresAt', tokens.expiresAt.toString());
  }

  private clearTokensFromStorage() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
  }

  async login(email: string, password: string): Promise<User> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { user, tokens } = await response.json();
    
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.saveTokensToStorage(tokens);

    return user;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    }

    this.accessToken = null;
    this.refreshToken = null;
    this.clearTokensFromStorage();
  }

  async refreshAccessToken(): Promise<string> {
    // Prevenir múltiplas chamadas simultâneas
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._refreshAccessToken();
    
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async _refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      this.logout(); // Token refresh falhou, fazer logout
      throw new Error('Token refresh failed');
    }

    const tokens = await response.json();
    
    this.accessToken = tokens.accessToken;
    this.saveTokensToStorage(tokens);

    return tokens.accessToken;
  }

  async getValidAccessToken(): Promise<string | null> {
    if (!this.accessToken) return null;

    // Verificar se o token está próximo do vencimento
    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt) {
      const expirationTime = parseInt(expiresAt);
      const now = Date.now();
      const timeUntilExpiry = expirationTime - now;
      
      // Renovar se falta menos de 5 minutos para expirar
      if (timeUntilExpiry < 5 * 60 * 1000) {
        try {
          return await this.refreshAccessToken();
        } catch (error) {
          return null;
        }
      }
    }

    return this.accessToken;
  }

  hasRole(role: string, user: User): boolean {
    return user.roles.includes(role);
  }

  hasAnyRole(roles: string[], user: User): boolean {
    return roles.some(role => user.roles.includes(role));
  }
}

export const authService = new AuthService();
```

#### Protected Routes e Role-Based Access
```tsx
// components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [],
  fallback = <Navigate to="/login" replace />
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return fallback;
  }

  if (requiredRoles.length > 0 && !authService.hasAnyRole(requiredRoles, user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// components/RoleBasedComponent.tsx
interface RoleBasedComponentProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleBasedComponent({ 
  roles, 
  children, 
  fallback = null 
}: RoleBasedComponentProps) {
  const { user } = useAuth();

  if (!user || !authService.hasAnyRole(roles, user)) {
    return fallback;
  }

  return <>{children}</>;
}

// Uso em rotas
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
```

### Virtualization e Performance

#### React Window para Listas Grandes
```tsx
// components/VirtualizedList.tsx
import { FixedSizeList as List } from 'react-window';
import { memo, useMemo } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  getItemKey = (_, index) => index,
}: VirtualizedListProps<T>) {
  
  // Memoizar o componente de item para performance
  const ItemComponent = memo(({ index, style }) => {
    const item = items[index];
    
    return (
      <div style={style}>
        {renderItem(item, index)}
      </div>
    );
  });

  // Função para obter chave do item
  const itemKey = useMemo(() => {
    return (index: number) => getItemKey(items[index], index);
  }, [items, getItemKey]);

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemKey={itemKey}
    >
      {ItemComponent}
    </List>
  );
}

// Exemplo de uso
function UserList() {
  const [users] = useState(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
    }))
  );

  const renderUser = (user, index) => (
    <div className="user-item">
      <img src={`/avatars/${user.id}.jpg`} alt={user.name} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );

  return (
    <VirtualizedList
      items={users}
      itemHeight={80}
      height={600}
      renderItem={renderUser}
      getItemKey={(user) => user.id}
    />
  );
}
```

### Real-time Communication

#### WebSocket Integration
```typescript
// hooks/useWebSocket.ts
interface UseWebSocketOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (data: any) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  
  const {
    onOpen,
    onClose,
    onError,
    onMessage,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setIsConnected(true);
        setReconnectCount(0);
        onOpen?.();
      };

      ws.onclose = () => {
        setIsConnected(false);
        onClose?.();
        
        // Tentar reconectar
        if (reconnectCount < reconnectAttempts) {
          setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, onOpen, onClose, onError, onMessage, reconnectCount, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();

    return () => {
      socket?.close();
    };
  }, [connect]);

  const send = useCallback((data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
    }
  }, [socket, isConnected]);

  const disconnect = useCallback(() => {
    socket?.close();
  }, [socket]);

  return {
    isConnected,
    send,
    disconnect,
    reconnectCount,
  };
}

// Exemplo de uso para chat
function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const { isConnected, send } = useWebSocket(
    `ws://localhost:8080/chat/${roomId}`,
    {
      onMessage: (data) => {
        if (data.type === 'message') {
          setMessages(prev => [...prev, data.message]);
        }
      },
    }
  );

  const sendMessage = () => {
    if (newMessage.trim() && isConnected) {
      send({
        type: 'message',
        content: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-room">
      <div className="connection-status">
        Status: {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
      </div>
      
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.author}:</strong> {message.content}
          </div>
        ))}
      </div>
      
      <div className="message-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Digite sua mensagem..."
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>
          Enviar
        </button>
      </div>
    </div>
  );
}
```

---

## 🎯 Resumo dos Conceitos de Arquitetura e Padrões

Este arquivo contém os principais conceitos de **Arquitetura e Padrões Modernos** que todo desenvolvedor frontend deve dominar:

### Arquiteturas Escaláveis
- **Micro-frontends**: Arquitetura distribuída com Module Federation
- **JAMstack**: Aplicações estáticas com APIs dinâmicas
- **Component Composition**: Padrões de composição reutilizáveis
- **Server/Client Patterns**: Renderização híbrida otimizada

### Gerenciamento de Estado Avançado
- **TanStack Query**: Cache inteligente de servidor
- **Optimistic Updates**: Atualizações otimistas para UX
- **Real-time Sync**: Sincronização em tempo real
- **Background Sync**: Sincronização offline/online

### Padrões de Design Modernos
- **Compound Components**: Componentes compostos flexíveis
- **Render Props**: Compartilhamento de lógica entre componentes
- **GraphQL Integration**: APIs type-safe com code generation
- **Authentication Patterns**: JWT, refresh tokens, RBAC

### Performance e Escalabilidade
- **Virtualization**: Renderização eficiente de listas grandes
- **Code Splitting**: Carregamento inteligente de código
- **Lazy Loading**: Carregamento sob demanda
- **WebSocket Integration**: Comunicação real-time eficiente
