# Resumo de Git, Testing e DevOps

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais de versionamento, testes e deploy que todo desenvolvedor deve dominar.

## Git - Versionamento com Git
Ferramenta para controlar versões do código, colaborar e reverter mudanças.

### Comandos Básicos
```bash
# Configuração inicial
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Inicialização e commits
git init                    # Inicializar repositório
git add .                   # Adicionar arquivos
git add arquivo.js          # Adicionar arquivo específico
git commit -m "mensagem"    # Confirmar mudanças
git status                  # Ver status dos arquivos
git log                     # Ver histórico de commits
git log --oneline          # Histórico resumido
```

### Branching e Merging
```bash
# Criação e navegação entre branches
git branch                              # Listar branches
git branch nova-feature                 # Criar nova branch
git checkout nova-feature              # Mudar para branch
git checkout -b feature/login          # Criar e mudar para branch

# Merging
git checkout main                      # Voltar para main
git merge feature/login               # Fazer merge da feature
git branch -d feature/login           # Deletar branch após merge

# Resolução de conflitos
git status                            # Ver arquivos com conflito
# Editar arquivos para resolver conflitos
git add arquivo-resolvido.js
git commit -m "Resolve conflito de merge"
```

### Trabalhando com Remotos
```bash
# Configuração de remote
git remote add origin https://github.com/usuario/repo.git
git remote -v                         # Ver remotes configurados

# Push e Pull
git push origin main                  # Enviar para repositório remoto
git push -u origin main              # Enviar e configurar upstream
git pull origin main                 # Buscar e fazer merge
git fetch origin                     # Apenas buscar (sem merge)

# Clonagem
git clone https://github.com/usuario/repo.git
```

### Histórico e Desfazer
```bash
# Ver mudanças
git diff                             # Ver mudanças não commitadas
git diff --staged                    # Ver mudanças no stage
git show HEAD                        # Ver último commit

# Desfazer mudanças
git checkout -- arquivo.js          # Desfazer mudanças no arquivo
git reset HEAD arquivo.js           # Tirar arquivo do stage
git reset --soft HEAD~1             # Desfazer último commit (manter mudanças)
git reset --hard HEAD~1             # Desfazer último commit (perder mudanças)
git revert HEAD                     # Criar commit que desfaz o anterior

# Stash (guardar mudanças temporariamente)
git stash                           # Guardar mudanças
git stash pop                       # Recuperar mudanças
git stash list                      # Listar stashes
git stash drop                      # Deletar stash
```

### Git Flow Básico
```bash
# Feature branch workflow
git checkout main
git pull origin main
git checkout -b feature/nova-funcionalidade
# ... desenvolver ...
git add .
git commit -m "Adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
# ... criar Pull Request ...
git checkout main
git pull origin main
git branch -d feature/nova-funcionalidade
```

## Testing - Testes (Unitários, Integração, End-to-End)
Garantem que o código funciona como esperado, desde funções isoladas até fluxos completos.

### Testes Unitários com Jest
```javascript
// math.js
export function soma(a, b) {
  return a + b;
}

export function dividir(a, b) {
  if (b === 0) {
    throw new Error('Divisão por zero');
  }
  return a / b;
}

// math.test.js
import { soma, dividir } from './math.js';

describe('Funções matemáticas', () => {
  test('deve somar dois números', () => {
    expect(soma(2, 3)).toBe(5);
    expect(soma(-1, 1)).toBe(0);
  });

  test('deve dividir dois números', () => {
    expect(dividir(10, 2)).toBe(5);
    expect(dividir(7, 2)).toBeCloseTo(3.5);
  });

  test('deve lançar erro ao dividir por zero', () => {
    expect(() => dividir(5, 0)).toThrow('Divisão por zero');
  });
});

// Mocks
const mockCallback = jest.fn();
test('mock implementation', () => {
  [1, 2, 3].forEach(mockCallback);
  
  expect(mockCallback).toHaveBeenCalledTimes(3);
  expect(mockCallback).toHaveBeenCalledWith(1);
});
```

### Testes de Componente React (Testing Library)
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Counter.test.js
test('botão deve incrementar contador', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  const button = screen.getByText('Incrementar');
  const counter = screen.getByText('0');
  
  await user.click(button);
  
  expect(screen.getByText('1')).toBeInTheDocument();
});

// Testando formulários
test('deve submeter formulário com dados válidos', async () => {
  const user = userEvent.setup();
  const mockSubmit = jest.fn();
  
  render(<LoginForm onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@email.com');
  await user.type(screen.getByLabelText(/senha/i), 'senha123');
  await user.click(screen.getByRole('button', { name: /entrar/i }));
  
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@email.com',
      senha: 'senha123'
    });
  });
});

// Testando requisições (com MSW)
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'João' }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Testes E2E com Cypress
```javascript
// cypress/e2e/login.cy.js
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('deve fazer login com credenciais válidas', () => {
    cy.get('[data-testid="email"]').type('user@email.com');
    cy.get('[data-testid="password"]').type('senha123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Bem-vindo').should('be.visible');
  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.get('[data-testid="email"]').type('invalid@email.com');
    cy.get('[data-testid="password"]').type('senhaerrada');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Credenciais inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('deve validar campos obrigatórios', () => {
    cy.get('button[type="submit"]').click();
    
    cy.contains('Email é obrigatório').should('be.visible');
    cy.contains('Senha é obrigatória').should('be.visible');
  });
});

// Comandos customizados (cypress/support/commands.js)
Cypress.Commands.add('login', (email, password) => {
  cy.get('[data-testid="email"]').type(email);
  cy.get('[data-testid="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Uso do comando customizado
it('deve acessar página protegida após login', () => {
  cy.login('user@email.com', 'senha123');
  cy.visit('/profile');
  cy.contains('Meu Perfil').should('be.visible');
});
```

## DevOps - Deploy e CI/CD Básico
Processos para publicar aplicações e automatizar testes/builds em servidores.

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
```

### Docker Básico
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json primeiro (para cache de layers)
COPY package*.json ./
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
```

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
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "type-check": "tsc --noEmit",
    "pre-commit": "npm run lint && npm run type-check && npm run test"
  }
}
```

### Husky (Git Hooks)
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```
