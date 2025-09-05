# Resumo de Conceitos Next.js

## 📚 Sobre este arquivo
Este arquivo contém conceitos específicos do **Next.js** - um framework React para produção que adiciona funcionalidades como SSR, SSG, roteamento automático e otimizações:

### 🛠️ Gerenciamento de Estado e Validação
- `Zustand` - Estado global simples e performático
- `Zod` - Validação e tipagem de dados TypeScript/JavaScript

### 🛤️ Sistema de Roteamento
- Sistema de rotas baseado em arquivos
- App Router (Next.js 13+) vs Pages Router
- Rotas dinâmicas e catch-all routes
- Navegação com Link e useRouter

### 🎨 SEO e Otimização
- Meta tags e componente Head
- JSON-LD para dados estruturados
- Otimização de imagens com Image
- Web Vitals e análise de performance

### ⚡ Estratégias de Renderização
- `SSG` (Static Site Generation)
- `SSR` (Server-Side Rendering)  
- `ISR` (Incremental Static Regeneration)
- `getStaticProps`, `getStaticPaths`, `getServerSideProps`

### 🔌 APIs e Backend
- API Routes (Pages Router)
- Route Handlers (App Router)
- Middleware para interceptação de requisições
- Server Actions para execução no servidor

### 📱 Layouts e Componentes Especiais
- Layouts aninhados (App Router)
- Templates que re-renderizam
- Loading e Error UI
- Componentes de Not Found

### 📊 Data Fetching Moderno
- Server Components vs Client Components
- Fetch com cache e revalidação
- Streaming com Suspense
- Cache tags e revalidação seletiva

### 🌐 Funcionalidades Avançadas
- Internacionalização (i18n)
- Autenticação com NextAuth.js
- Bundle analysis e otimização
- Configurações de Testing (Jest, Cypress)

### ⚙️ Configuração e Deploy
- `next.config.js` personalizado
- Variáveis de ambiente
- Webpack customização
- Configurações de produção

> **Nota**: Para conceitos básicos de React, consulte o arquivo `conceitos-react.md`

---

## Next.js

### Zustand
Zustand é uma biblioteca de gerenciamento de estado para React/Next.js. Serve para armazenar e compartilhar estados globais de forma simples e performática, sem boilerplate.
```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Uso em componente
function Counter() {
  const { count, increment, decrement, reset } = useStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Zod
Zod é uma biblioteca de validação e tipagem de dados TypeScript/JavaScript. Serve para validar objetos, strings, arrays, etc., garantindo que os dados estejam no formato esperado.
```typescript
import { z } from 'zod';

// Schema de validação
const UserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Deve ser maior de idade').max(120),
  isActive: z.boolean().optional(),
});

// Uso
try {
  const userData = UserSchema.parse({ 
    name: 'João', 
    email: 'joao@email.com', 
    age: 25 
  });
  console.log('Dados válidos:', userData);
} catch (error) {
  console.error('Dados inválidos:', error.errors);
}

// Para formulários Next.js
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(UserSchema)
  });

  const onSubmit = (data) => {
    console.log('Dados válidos:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Nome" />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Sistema de Rotas Baseado em Arquivos
Next.js usa rotas automáticas baseadas na estrutura de pastas na pasta `pages` ou `app`.

#### App Router (Next.js 13+)
```jsx
// app/page.tsx - Página inicial (/)
export default function HomePage() {
  return <h1>Página Inicial</h1>;
}

// app/about/page.tsx - Página sobre (/about)
export default function AboutPage() {
  return <h1>Sobre Nós</h1>;
}

// app/blog/[slug]/page.tsx - Rota dinâmica (/blog/meu-post)
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>;
}

// app/products/[category]/[id]/page.tsx - Múltiplos parâmetros
export default function Product({ params }) {
  return (
    <div>
      <h1>Categoria: {params.category}</h1>
      <p>ID do Produto: {params.id}</p>
    </div>
  );
}
```

#### Pages Router (Next.js 12 e anteriores)
```jsx
// pages/index.js - Página inicial (/)
export default function HomePage() {
  return <h1>Página Inicial</h1>;
}

// pages/about.js - Página sobre (/about)
export default function AboutPage() {
  return <h1>Sobre Nós</h1>;
}

// pages/blog/[slug].js - Rota dinâmica
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  return <h1>Post: {slug}</h1>;
}

// pages/products/[...params].js - Catch-all routes
export default function Products() {
  const router = useRouter();
  const { params } = router.query; // Array de parâmetros
  
  return <h1>Produtos: {params?.join('/')}</h1>;
}
```

### Navegação no Next.js
```jsx
import Link from 'next/link';
import { useRouter } from 'next/router';

function Navigation() {
  const router = useRouter();
  
  const handleProgrammaticNavigation = () => {
    router.push('/dashboard');
    // ou router.replace('/dashboard') para substituir na história
  };
  
  return (
    <nav>
      {/* Navegação declarativa */}
      <Link href="/">Home</Link>
      <Link href="/about">Sobre</Link>
      <Link href="/blog/meu-post">Meu Post</Link>
      
      {/* Navegação com objeto */}
      <Link href={{
        pathname: '/products/[category]',
        query: { category: 'electronics' }
      }}>
        Eletrônicos
      </Link>
      
      {/* Navegação programática */}
      <button onClick={handleProgrammaticNavigation}>
        Ir para Dashboard
      </button>
    </nav>
  );
}
```

### SEO e Meta Tags
Next.js facilita a otimização para motores de busca com o componente Head.
```jsx
import Head from 'next/head';

function HomePage() {
  return (
    <>
      <Head>
        <title>Minha Página - Site Exemplo</title>
        <meta name="description" content="Descrição da página para SEO" />
        <meta name="keywords" content="react, nextjs, javascript" />
        <meta name="author" content="Seu Nome" />
        
        {/* Open Graph para redes sociais */}
        <meta property="og:title" content="Minha Página" />
        <meta property="og:description" content="Descrição para redes sociais" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://meusite.com" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Minha Página" />
        <meta name="twitter:description" content="Descrição para Twitter" />
        <meta name="twitter:image" content="/twitter-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://meusite.com/pagina" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <h1>Conteúdo da página</h1>
        <p>Página otimizada para SEO</p>
      </main>
    </>
  );
}

// JSON-LD para dados estruturados
function BlogPost({ post }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.publishedAt,
    "image": post.image
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <article>
        <h1>{post.title}</h1>
        <p>Por {post.author}</p>
        <div>{post.content}</div>
      </article>
    </>
  );
}
```

### SSG e SSR (Server-Side Rendering)
Next.js oferece diferentes estratégias de renderização para otimizar performance e SEO.

#### Static Site Generation (SSG)
```jsx
// Página estática gerada no build time
export default function BlogIndex({ posts }) {
  return (
    <div>
      <h1>Blog</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

// Busca dados no build time
export async function getStaticProps() {
  const posts = await fetch('https://api.exemplo.com/posts').then(r => r.json());
  
  return {
    props: { posts },
    revalidate: 3600 // Revalida a cada 1 hora (ISR)
  };
}
```

#### SSG com rotas dinâmicas
```jsx
// pages/blog/[slug].js
export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}

// Define quais rotas devem ser geradas estaticamente
export async function getStaticPaths() {
  const posts = await fetch('https://api.exemplo.com/posts').then(r => r.json());
  
  const paths = posts.map(post => ({
    params: { slug: post.slug }
  }));
  
  return {
    paths,
    fallback: 'blocking' // ou true, false
  };
}

// Busca dados para cada rota
export async function getStaticProps({ params }) {
  const post = await fetch(`https://api.exemplo.com/posts/${params.slug}`)
    .then(r => r.json());
  
  if (!post) {
    return { notFound: true };
  }
  
  return {
    props: { post },
    revalidate: 60 // Revalida a cada 1 minuto
  };
}
```

#### Server-Side Rendering (SSR)
```jsx
export default function UserProfile({ user, posts }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Posts recentes:</p>
      {posts.map(post => (
        <article key={post.id}>
          <h3>{post.title}</h3>
        </article>
      ))}
    </div>
  );
}

// Executa a cada requisição no servidor
export async function getServerSideProps(context) {
  const { req, res, params, query } = context;
  
  // Acessar cookies, headers, etc.
  const token = req.cookies.token;
  
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  // Buscar dados baseados na requisição
  const [user, posts] = await Promise.all([
    fetch(`https://api.exemplo.com/users/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()),
    fetch(`https://api.exemplo.com/users/${params.id}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json())
  ]);
  
  return {
    props: { user, posts }
  };
}
```

### API Routes
Next.js permite criar APIs no mesmo projeto, funcionando como backend.
```javascript
// pages/api/users.js
export default function handler(req, res) {
  const { method } = req;
  
  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req, res) {
  const { page = 1, limit = 10 } = req.query;
  
  try {
    const users = await getUsersFromDatabase({ page, limit });
    res.status(200).json({ users, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function handlePost(req, res) {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Nome e email são obrigatórios' 
    });
  }
  
  try {
    const newUser = await createUser({ name, email });
    res.status(201).json({ user: newUser, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

// pages/api/users/[id].js - Rota dinâmica
export default function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    // Buscar usuário por ID
    const user = getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json({ user });
  }
  
  if (req.method === 'DELETE') {
    // Deletar usuário
    deleteUser(id);
    res.status(204).end();
  }
}
```

### Middleware
```javascript
// middleware.js (na raiz do projeto)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Verificar autenticação
  const token = request.cookies.get('token');
  
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Adicionar headers customizados
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'my-value');
  
  return response;
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Otimização de Imagens
```jsx
import Image from 'next/image';

function Gallery() {
  return (
    <div>
      {/* Imagem otimizada automaticamente */}
      <Image
        src="/hero-image.jpg"
        alt="Imagem hero"
        width={800}
        height={400}
        priority // Carrega com prioridade alta
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..." // Placeholder blur
      />
      
      {/* Imagem responsiva */}
      <Image
        src="/gallery-image.jpg"
        alt="Imagem da galeria"
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Imagem externa */}
      <Image
        src="https://exemplo.com/imagem.jpg"
        alt="Imagem externa"
        width={400}
        height={300}
        loader={({ src, width, quality }) => {
          return `https://exemplo.com/${src}?w=${width}&q=${quality || 75}`;
        }}
      />
    </div>
  );
}
```

### Configuração do Next.js
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuração de imagens
  images: {
    domains: ['exemplo.com', 'api.exemplo.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Redirecionamentos
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
  
  // Rewrites (proxy)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.exemplo.com/:path*',
      },
    ];
  },
  
  // Headers customizados
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  
  // Variáveis de ambiente
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack customização
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Configuração customizada do webpack
    return config;
  },
};

module.exports = nextConfig;
```

### Layouts e Templates (App Router)
Sistema de layouts aninhados para compartilhar UI entre páginas.
```jsx
// app/layout.tsx - Layout raiz
import './globals.css';

export const metadata = {
  title: 'Minha Aplicação',
  description: 'Descrição da aplicação',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header>
          <nav>Navegação global</nav>
        </header>
        <main>{children}</main>
        <footer>Rodapé global</footer>
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx - Layout específico do dashboard
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/users">Usuários</a>
          <a href="/dashboard/settings">Configurações</a>
        </nav>
      </aside>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

// app/dashboard/template.tsx - Template que re-renderiza em navegação
'use client';
import { motion } from 'framer-motion';

export default function DashboardTemplate({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Loading e Error UI (App Router)
Componentes especiais para estados de carregamento e erro.
```jsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Carregando dashboard...</p>
    </div>
  );
}

// app/dashboard/error.tsx
'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Algo deu errado!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}

// app/dashboard/not-found.tsx
export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <a href="/dashboard">Voltar ao dashboard</a>
    </div>
  );
}
```

### Data Fetching Moderno (App Router)
Fetch de dados com Server Components e Client Components.
```jsx
// app/posts/page.tsx - Server Component
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Cache por 1 hora
  });
  
  if (!res.ok) {
    throw new Error('Falha ao buscar posts');
  }
  
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

// app/posts/[id]/page.tsx - Server Component com parâmetros
async function getPost(id) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { tags: [`post-${id}`] } // Cache tags para revalidação seletiva
  });
  
  if (!res.ok) {
    throw new Error('Post não encontrado');
  }
  
  return res.json();
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <PostInteractions postId={post.id} />
    </article>
  );
}

// Componente cliente para interações
'use client';
function PostInteractions({ postId }) {
  const [likes, setLikes] = useState(0);
  
  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      });
      const data = await response.json();
      setLikes(data.likes);
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };
  
  return (
    <div>
      <button onClick={handleLike}>
        👍 {likes} curtidas
      </button>
    </div>
  );
}
```

### Streaming e Suspense
Carregamento progressivo de conteúdo para melhor UX.
```jsx
import { Suspense } from 'react';

// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Conteúdo que carrega imediatamente */}
      <div className="quick-stats">
        <StatCard title="Usuários Online" value="1,234" />
      </div>
      
      {/* Conteúdo que carrega com Suspense */}
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

// Componente que busca dados de forma assíncrona
async function RevenueChart() {
  const data = await fetch('https://api.example.com/revenue', {
    next: { revalidate: 300 } // 5 minutos
  }).then(res => res.json());
  
  return (
    <div className="chart">
      <h2>Receita</h2>
      {/* Componente de gráfico */}
      <Chart data={data} />
    </div>
  );
}

async function RecentOrders() {
  const orders = await fetch('https://api.example.com/orders/recent')
    .then(res => res.json());
  
  return (
    <div className="recent-orders">
      <h2>Pedidos Recentes</h2>
      <table>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.amount}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

// Skeletons para loading states
function ChartSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-title"></div>
      <div className="skeleton-chart"></div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-title"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-row"></div>
      ))}
    </div>
  );
}
```

### Route Handlers (App Router API)
Nova forma de criar APIs no App Router.
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

// GET /api/users
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  
  try {
    const users = await getUsersFromDB({ 
      page: parseInt(page), 
      limit: parseInt(limit) 
    });
    
    return NextResponse.json({ 
      users, 
      pagination: { page, limit, total: users.length } 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateUserSchema.parse(body);
    
    const newUser = await createUser(validatedData);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteUser(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar usuário' },
      { status: 500 }
    );
  }
}
```

### Server Actions
Execução de código no servidor diretamente de componentes.
```jsx
// app/actions.js
'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  // Validação
  if (!title || !content) {
    return { error: 'Título e conteúdo são obrigatórios' };
  }
  
  try {
    const post = await savePostToDB({ title, content });
    
    // Revalidar cache
    revalidateTag('posts');
    revalidatePath('/blog');
    
    // Redirecionar
    redirect(`/blog/${post.slug}`);
  } catch (error) {
    return { error: 'Erro ao criar post' };
  }
}

export async function updatePost(id, formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  try {
    await updatePostInDB(id, { title, content });
    
    revalidateTag(`post-${id}`);
    revalidatePath(`/blog/${id}`);
    
    return { success: true };
  } catch (error) {
    return { error: 'Erro ao atualizar post' };
  }
}

// app/blog/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPost() {
  return (
    <form action={createPost}>
      <div>
        <label htmlFor="title">Título:</label>
        <input type="text" id="title" name="title" required />
      </div>
      
      <div>
        <label htmlFor="content">Conteúdo:</label>
        <textarea id="content" name="content" required />
      </div>
      
      <button type="submit">Criar Post</button>
    </form>
  );
}

// Com useFormState para feedback
'use client';
import { useFormState } from 'react-dom';
import { createPost } from '@/app/actions';

export default function NewPostWithState() {
  const [state, formAction] = useFormState(createPost, null);
  
  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">Título:</label>
        <input type="text" id="title" name="title" required />
      </div>
      
      <div>
        <label htmlFor="content">Conteúdo:</label>
        <textarea id="content" name="content" required />
      </div>
      
      {state?.error && (
        <div className="error">{state.error}</div>
      )}
      
      <button type="submit">Criar Post</button>
    </form>
  );
}
```

### Internacionalização (i18n)
Suporte a múltiplos idiomas.
```javascript
// next.config.js
module.exports = {
  i18n: {
    locales: ['pt-BR', 'en', 'es'],
    defaultLocale: 'pt-BR',
    localeDetection: true,
  },
};

// pages/index.js
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

export default function HomePage({ messages }) {
  const { locale, push } = useRouter();
  const intl = useIntl();
  
  const changeLanguage = (newLocale) => {
    push('/', '/', { locale: newLocale });
  };
  
  return (
    <div>
      <h1>{intl.formatMessage({ id: 'welcome' })}</h1>
      <p>{intl.formatMessage({ id: 'description' })}</p>
      
      <div>
        <button onClick={() => changeLanguage('pt-BR')}>Português</button>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('es')}>Español</button>
      </div>
      
      <p>Idioma atual: {locale}</p>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  const messages = await import(`../locales/${locale}.json`);
  
  return {
    props: {
      messages: messages.default,
    },
  };
}

// locales/pt-BR.json
{
  "welcome": "Bem-vindo ao nosso site!",
  "description": "Esta é uma aplicação Next.js com suporte a múltiplos idiomas."
}

// locales/en.json
{
  "welcome": "Welcome to our website!",
  "description": "This is a Next.js application with multi-language support."
}
```

### Autenticação com NextAuth.js
Sistema completo de autenticação.
```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validar credenciais
        const user = await validateUser(credentials);
        
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        return null;
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  
  session: {
    strategy: 'jwt',
  },
});

// components/LoginButton.jsx
import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Carregando...</p>;
  
  if (session) {
    return (
      <div>
        <p>Olá, {session.user.name}!</p>
        <button onClick={() => signOut()}>Sair</button>
      </div>
    );
  }
  
  return (
    <div>
      <p>Você não está logado</p>
      <button onClick={() => signIn()}>Entrar</button>
    </div>
  );
}

// pages/_app.js
import { SessionProvider } from 'next-auth/react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

// Proteção de rotas
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'loading') return; // Ainda carregando
    
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);
  
  if (status === 'loading') {
    return <div>Carregando...</div>;
  }
  
  if (!session) {
    return null;
  }
  
  return (
    <div>
      <h1>Página Protegida</h1>
      <p>Apenas usuários autenticados podem ver isso.</p>
    </div>
  );
}

// Proteção no lado do servidor
export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session },
  };
}
```

### Performance e Bundle Analysis
Análise e otimização de performance.
```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Outras configurações
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lodash', 'date-fns'],
  },
  
  // Configurações de compilação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configurações de build
  output: 'standalone', // Para Docker
});

// Análise de performance com Web Vitals
// pages/_app.js
export function reportWebVitals(metric) {
  // Enviar métricas para serviço de analytics
  if (metric.label === 'web-vital') {
    console.log(metric);
    
    // Enviar para Google Analytics
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
}

// Hook para medir performance de componentes
import { useEffect } from 'react';

export function usePerformanceMetrics(componentName) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`${componentName} render time: ${duration.toFixed(2)}ms`);
      
      // Enviar métricas se necessário
      if (duration > 100) {
        console.warn(`Slow component: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  });
}

// Uso do hook
function ExpensiveComponent() {
  usePerformanceMetrics('ExpensiveComponent');
  
  // Componente com renderização pesada
  return <div>Conteúdo complexo</div>;
}
```

### Testing no Next.js
Configuração e estratégias de teste.
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);

// jest.setup.js
import '@testing-library/jest-dom';

// __tests__/pages/index.test.js
import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      isFallback: false,
    };
  },
}));

describe('Home page', () => {
  it('renders welcome message', () => {
    render(<Home />);
    
    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js/i,
    });
    
    expect(heading).toBeInTheDocument();
  });
});

// __tests__/api/users.test.js
import handler from '@/pages/api/users';
import { createMocks } from 'node-mocks-http';

describe('/api/users', () => {
  it('returns users list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('users');
    expect(Array.isArray(data.users)).toBe(true);
  });
  
  it('creates new user', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'João',
        email: 'joao@email.com',
      },
    });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(201);
    
    const data = JSON.parse(res._getData());
    expect(data.user).toHaveProperty('name', 'João');
  });
});

// cypress/e2e/navigation.cy.js
describe('Navigation', () => {
  it('should navigate between pages', () => {
    cy.visit('/');
    
    cy.contains('About').click();
    cy.url().should('include', '/about');
    
    cy.contains('Home').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
  
  it('should handle authentication flow', () => {
    cy.visit('/login');
    
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });
});
```

---

## 🎯 Resumo dos Conceitos Next.js

Este arquivo contém os principais conceitos do **Next.js** (framework) que todo desenvolvedor frontend deve dominar:

### Framework Essenciais
- **App Router**: Sistema moderno de roteamento com layouts aninhados
- **Pages Router**: Sistema tradicional de roteamento baseado em arquivos
- **Server/Client Components**: Renderização híbrida para performance otimizada
- **Route Handlers**: APIs modernas com tipagem TypeScript
- **Server Actions**: Execução de código servidor diretamente de componentes

### Renderização e Performance
- **SSG/SSR/ISR**: Estratégias de renderização para SEO e performance
- **Streaming**: Carregamento progressivo com Suspense
- **Image Optimization**: Otimização automática de imagens
- **Bundle Analysis**: Análise e otimização de bundles
- **Web Vitals**: Monitoramento de métricas de performance

### Funcionalidades Avançadas
- **Middleware**: Interceptação e modificação de requisições
- **Internationalization**: Suporte a múltiplos idiomas
- **Authentication**: Integração com NextAuth.js
- **Testing**: Configuração completa de testes
- **Deployment**: Configurações para produção
