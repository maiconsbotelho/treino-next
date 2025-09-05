# Conceitos Docker

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais do **Docker** - plataforma de containerização que permite empacotar aplicações com suas dependências em containers portáteis e isolados:

### 🐳 Fundamentos Docker
- `Container` - Ambiente isolado e portátil para executar aplicações
- `Image` - Template imutável usado para criar containers
- `Dockerfile` - Script com instruções para construir images
- `Docker Compose` - Ferramenta para definir e executar aplicações multi-container

### 📦 Conceitos de Containerização
- Isolamento de processos e recursos
- Portabilidade entre ambientes
- Versionamento e distribuição de aplicações
- Eficiência de recursos comparado a VMs

### 🛠️ Docker com Next.js
- Configuração de Dockerfile para aplicações Next.js
- Multi-stage builds para otimização
- Configuração de ambiente de desenvolvimento
- Deploy de aplicações containerizadas

### 🔧 Docker Compose
- Orquestração de múltiplos serviços
- Configuração de redes e volumes
- Variáveis de ambiente
- Profiles para diferentes ambientes

### 🚀 Best Practices
- Otimização de images
- Segurança em containers
- Monitoramento e logs
- CI/CD com Docker

> **Nota**: Para conceitos de Kubernetes (orquestração), consulte o arquivo `conceitos-kubernetes.md`

---

## Docker

### O que é Docker?
Docker é uma plataforma que usa containerização para empacotar aplicações e suas dependências em containers leves, portáteis e isolados.

#### Vantagens do Docker:
- **Portabilidade**: Funciona igual em desenvolvimento, teste e produção
- **Isolamento**: Cada container tem seu próprio ambiente
- **Eficiência**: Compartilha o kernel do OS, mais leve que VMs
- **Escalabilidade**: Fácil de escalar horizontalmente
- **Versionamento**: Images versionadas e distribuíveis

### Conceitos Fundamentais

#### Container vs Virtual Machine
```
Virtual Machine:
App A | App B | App C
OS    | OS    | OS
      Hypervisor
    Host Operating System
       Hardware

Container:
App A | App B | App C
    Docker Engine
   Host Operating System
       Hardware
```

#### Docker Image
Template imutável usado para criar containers. Construída em camadas (layers).

```bash
# Listar images locais
docker images

# Baixar image do registry
docker pull node:18-alpine

# Construir image a partir de Dockerfile
docker build -t minha-app .

# Remover image
docker rmi image-name
```

#### Docker Container
Instância executável de uma image.

```bash
# Criar e executar container
docker run -d -p 3000:3000 --name minha-app-container minha-app

# Listar containers em execução
docker ps

# Listar todos os containers
docker ps -a

# Parar container
docker stop minha-app-container

# Iniciar container parado
docker start minha-app-container

# Remover container
docker rm minha-app-container

# Executar comando dentro do container
docker exec -it minha-app-container /bin/sh

# Ver logs do container
docker logs minha-app-container

# Seguir logs em tempo real
docker logs -f minha-app-container
```

### Dockerfile para Next.js

#### Dockerfile Básico
```dockerfile
# Dockerfile
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Construir a aplicação
RUN npm run build

# Expor porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
```

#### Dockerfile Multi-stage (Otimizado)
```dockerfile
# Dockerfile.optimized
# Estágio 1: Dependências
FROM node:18-alpine AS deps
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci --frozen-lockfile

# Estágio 2: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependências do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Variáveis de ambiente para build
ENV NEXT_TELEMETRY_DISABLED 1

# Construir aplicação
RUN npm run build

# Estágio 3: Produção
FROM node:18-alpine AS runner
WORKDIR /app

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copiar arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Mudar proprietário dos arquivos
USER nextjs

# Expor porta
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando de inicialização
CMD ["node", "server.js"]
```

#### Dockerfile com TypeScript
```dockerfile
# Dockerfile.typescript
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Adicionar TypeScript como dependência de build
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### .dockerignore
Arquivo para ignorar arquivos desnecessários no build.

```gitignore
# .dockerignore
node_modules
npm-debug.log
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.git
.gitignore
.dockerignore
Dockerfile
.next
.vercel
coverage
.nyc_output
.cache
dist
```

### Docker Compose

#### docker-compose.yml Básico
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Docker Compose Completo (Desenvolvimento)
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Aplicação Next.js
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@database:5432/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - database
      - redis
    restart: unless-stopped

  # Banco de dados PostgreSQL
  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  # Redis para cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Nginx como reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    driver: bridge
```

#### Docker Compose para Produção
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: always
    depends_on:
      - database
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: always

volumes:
  postgres_data:
```

### Dockerfile para Desenvolvimento
```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Instalar dependências globais para desenvolvimento
RUN npm install -g nodemon

# Copiar package.json
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando de desenvolvimento com hot reload
CMD ["npm", "run", "dev"]
```

### Configuração do Next.js para Docker
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar standalone output para Docker
  output: 'standalone',
  
  // Configuração para funcionar em containers
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  
  // Configuração de imagens para Docker
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  // Configuração de headers para containers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Scripts de Build e Deploy
```json
{
  "scripts": {
    "docker:build": "docker build -t nextjs-app .",
    "docker:build:dev": "docker build -f Dockerfile.dev -t nextjs-app:dev .",
    "docker:run": "docker run -p 3000:3000 nextjs-app",
    "docker:run:dev": "docker run -p 3000:3000 -v $(pwd):/app nextjs-app:dev",
    "compose:up": "docker-compose up -d",
    "compose:up:dev": "docker-compose -f docker-compose.dev.yml up -d",
    "compose:down": "docker-compose down",
    "compose:logs": "docker-compose logs -f",
    "compose:build": "docker-compose build --no-cache"
  }
}
```

### Variáveis de Ambiente
```bash
# .env.docker
DATABASE_URL=postgresql://user:password@database:5432/myapp
REDIS_URL=redis://redis:6379
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=production
```

### Configuração do Nginx
```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream nextjs {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://nextjs;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Configuração para assets estáticos
        location /_next/static/ {
            proxy_pass http://nextjs;
            proxy_cache_valid 200 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Health Checks
```dockerfile
# Adicionando health check ao Dockerfile
FROM node:18-alpine AS runner
WORKDIR /app

# ... outras configurações ...

# Instalar curl para health check
RUN apk add --no-cache curl

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

```javascript
// pages/api/health.js ou app/api/health/route.js
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

### Docker Compose com Health Checks
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    depends_on:
      database:
        condition: service_healthy

  database:
    image: postgres:15-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Otimização de Images Docker

#### Usando Alpine Linux
```dockerfile
# Mais leve que a image padrão
FROM node:18-alpine

# Instalar dependências do sistema se necessário
RUN apk add --no-cache libc6-compat
```

#### Multi-stage com Cache
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app

# Aproveitar cache do Docker
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile && npm cache clean --force

FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build apenas o necessário
RUN npm run build && \
    npm prune --production && \
    npm cache clean --force

FROM node:18-alpine AS runner
WORKDIR /app

# Remover ferramentas desnecessárias
RUN apk del npm

# Copiar apenas arquivos necessários
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

CMD ["node", "server.js"]
```

### Secrets e Segurança
```yaml
# docker-compose.yml com secrets
version: '3.8'

services:
  app:
    image: nextjs-app
    secrets:
      - db_password
      - jwt_secret
    environment:
      - DATABASE_PASSWORD_FILE=/run/secrets/db_password
      - JWT_SECRET_FILE=/run/secrets/jwt_secret

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### Monitoramento e Logs
```yaml
services:
  app:
    image: nextjs-app
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=nextjs"
    
  # Container para coleta de logs
  fluentd:
    image: fluent/fluentd:v1.14-1
    volumes:
      - ./fluentd/conf:/fluentd/etc
      - /var/log:/var/log
    ports:
      - "24224:24224"
```

### CI/CD com Docker
```yaml
# .github/workflows/docker.yml
name: Docker Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: |
        docker build -t nextjs-app:${{ github.sha }} .
        docker tag nextjs-app:${{ github.sha }} nextjs-app:latest
    
    - name: Run tests in container
      run: |
        docker run --rm nextjs-app:${{ github.sha }} npm test
    
    - name: Push to registry
      run: |
        echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
        docker push nextjs-app:${{ github.sha }}
        docker push nextjs-app:latest
```

### Comandos Úteis Docker

#### Limpeza e Manutenção
```bash
# Remover containers parados
docker container prune

# Remover images não utilizadas
docker image prune

# Remover volumes não utilizados
docker volume prune

# Limpeza completa do sistema
docker system prune -a

# Ver uso de espaço
docker system df
```

#### Debugging
```bash
# Entrar no container em execução
docker exec -it container-name /bin/sh

# Inspecionar container
docker inspect container-name

# Ver estatísticas em tempo real
docker stats

# Copiar arquivos do container
docker cp container-name:/app/logs ./logs
```

#### Backup e Restore
```bash
# Backup de volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore de volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data

# Export/Import de containers
docker export container-name > container.tar
docker import container.tar new-image-name
```

---

## 🎯 Resumo dos Conceitos Docker

Este arquivo contém os principais conceitos do **Docker** que todo desenvolvedor deve dominar:

### Fundamentos Essenciais
- **Containerização**: Isolamento e portabilidade de aplicações
- **Images vs Containers**: Templates imutáveis vs instâncias executáveis
- **Dockerfile**: Scripts para construir images customizadas
- **Multi-stage Builds**: Otimização de size e segurança

### Docker com Next.js
- **Configuração Otimizada**: Dockerfile específico para aplicações Next.js
- **Environment Variables**: Gestão segura de configurações
- **Static Output**: Configuração para deploy containerizado
- **Health Checks**: Monitoramento da saúde da aplicação

### Docker Compose
- **Orquestração**: Gerenciamento de múltiplos serviços
- **Networking**: Comunicação entre containers
- **Volumes**: Persistência de dados
- **Profiles**: Configurações para diferentes ambientes

### Produção e DevOps
- **Otimização**: Redução de size e melhoria de performance
- **Segurança**: Gestão de secrets e boas práticas
- **Monitoramento**: Logs e métricas de containers
- **CI/CD**: Integração com pipelines de deploy
