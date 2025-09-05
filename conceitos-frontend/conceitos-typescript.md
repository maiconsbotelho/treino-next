# Resumo de Conceitos TypeScript

## 📚 Sobre este arquivo
Este arquivo contém conceitos específicos do **TypeScript** - superset do JavaScript que adiciona tipagem estática e funcionalidades avançadas para desenvolvimento mais seguro e produtivo:

### 🎯 Sistema de Tipos
- Tipos primitivos (`string`, `number`, `boolean`)
- Arrays tipados e Tuplas
- Enums e Literais
- `any`, `unknown`, `never`, `void`

### 🏗️ Estruturas Avançadas
- `interface` - Contratos de objetos
- `type` - Aliases e união de tipos
- `class` - Orientação a objetos com tipos
- `namespace` - Organização de código

### 🔗 Tipos Compostos
- Union Types (`|`) e Intersection Types (`&`)
- Conditional Types e Mapped Types
- Template Literal Types
- Utility Types (`Pick`, `Omit`, `Partial`, etc.)

### 🎭 Generics
- Generic Functions e Classes
- Constraints com `extends`
- Generic Interfaces
- Default Generic Parameters

### 🛡️ Type Guards e Assertions
- Type Guards customizados
- `instanceof` e `typeof`
- Type Assertions (`as`)
- Discriminated Unions

### 🎨 Decorators
- Class Decorators
- Method e Property Decorators
- Parameter Decorators
- Metadata Reflection

### 📦 Módulos e Namespaces
- Import/Export com tipos
- Ambient Declarations
- Declaration Files (`.d.ts`)
- Module Augmentation

### ⚙️ Configuração Avançada
- `tsconfig.json` otimizado
- Strict Mode e Compiler Options
- Path Mapping e Module Resolution
- Build e Watch Mode

### 🔧 Integração com Frameworks
- React com TypeScript
- Node.js com TypeScript
- Express e APIs tipadas
- Testing com tipos

### 🚀 Funcionalidades Modernas
- Async/Await tipado
- Promise Types
- Error Handling com tipos
- Performance e Bundle Size

> **Nota**: Este arquivo foca nos recursos exclusivos do TypeScript. Para conceitos de JavaScript base, consulte `conceitos-javascript.md`

---

## TypeScript

### Sistema de Tipos Básicos

#### Tipos Primitivos
TypeScript adiciona tipagem estática ao JavaScript, permitindo detectar erros em tempo de compilação.
```typescript
// Tipos básicos
let nome: string = 'João';
let idade: number = 30;
let ativo: boolean = true;
let indefinido: undefined = undefined;
let nulo: null = null;

// Inferência de tipos (TypeScript deduz automaticamente)
let cidade = 'São Paulo'; // TypeScript infere como string
let contador = 0; // TypeScript infere como number

// Múltiplos tipos (Union Types)
let id: string | number = 123;
id = 'ABC123'; // Válido
```

#### Arrays e Tuplas
```typescript
// Arrays tipados
let numeros: number[] = [1, 2, 3, 4];
let nomes: Array<string> = ['Ana', 'Bruno', 'Carlos'];
let ids: (string | number)[] = [1, 'A2', 3, 'B4'];

// Tuplas (arrays com tipos e tamanhos fixos)
let coordenada: [number, number] = [10, 20];
let pessoa: [string, number, boolean] = ['João', 30, true];

// Tuplas com labels (TypeScript 4.0+)
let ponto: [x: number, y: number] = [10, 20];

// Rest em tuplas
let scores: [name: string, ...scores: number[]] = ['João', 10, 9, 8];
```

#### Enums
```typescript
// Enum numérico
enum Status {
  Pending,    // 0
  Approved,   // 1
  Rejected    // 2
}

// Enum string
enum Cores {
  Vermelho = 'RED',
  Verde = 'GREEN',
  Azul = 'BLUE'
}

// Enum misto
enum MixedEnum {
  No = 0,
  Yes = 'YES'
}

// Usando enums
let statusPedido: Status = Status.Pending;
let corEscolhida: Cores = Cores.Azul;

// Const enums (otimização em tempo de compilação)
const enum Direcoes {
  Norte,
  Sul,
  Leste,
  Oeste
}
```

### Interfaces e Types

#### Interfaces
Interfaces definem contratos para objetos, garantindo estrutura consistente.
```typescript
// Interface básica
interface Usuario {
  id: number;
  nome: string;
  email: string;
  idade?: number; // Propriedade opcional
  readonly dataCriacao: Date; // Propriedade somente leitura
}

// Implementando interface
const usuario: Usuario = {
  id: 1,
  nome: 'Maria',
  email: 'maria@email.com',
  dataCriacao: new Date()
};

// Interface com métodos
interface Calculadora {
  somar(a: number, b: number): number;
  subtrair(a: number, b: number): number;
}

// Interface estendendo outra interface
interface UsuarioAdmin extends Usuario {
  permissoes: string[];
  ultimoLogin?: Date;
}

// Interface com index signature
interface Configuracoes {
  [chave: string]: string | number | boolean;
}

const config: Configuracoes = {
  tema: 'dark',
  timeout: 5000,
  debug: true
};
```

#### Type Aliases
```typescript
// Type alias básico
type ID = string | number;
type Status = 'loading' | 'success' | 'error';

// Type alias para objetos
type Produto = {
  id: ID;
  nome: string;
  preco: number;
  categoria: string;
};

// Union types complexos
type EventoMouse = 'click' | 'dblclick' | 'mousedown' | 'mouseup';
type EventoTeclado = 'keydown' | 'keyup' | 'keypress';
type Evento = EventoMouse | EventoTeclado;

// Intersection types
type Timestamped = {
  timestamp: Date;
};

type ProdutoComTimestamp = Produto & Timestamped;

// Conditional types
type ApiResponse<T> = T extends string ? string : T extends number ? number : never;
```

### Generics

#### Generic Functions
```typescript
// Função genérica básica
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>('hello'); // Tipo explícito
let output2 = identity(42); // Inferência de tipo

// Generic com constraints
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Múltiplos parâmetros genéricos
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const resultado = pair('hello', 42); // [string, number]
```

#### Generic Classes e Interfaces
```typescript
// Interface genérica
interface Repository<T> {
  create(item: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Classe genérica
class GenericRepository<T extends { id: string }> implements Repository<T> {
  private items: T[] = [];

  async create(item: T): Promise<T> {
    this.items.push(item);
    return item;
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex === -1) throw new Error('Item não encontrado');
    
    this.items[itemIndex] = { ...this.items[itemIndex], ...updates };
    return this.items[itemIndex];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }
}

// Uso
interface User {
  id: string;
  nome: string;
  email: string;
}

const userRepository = new GenericRepository<User>();
```

### Classes e Orientação a Objetos

#### Classes com TypeScript
```typescript
// Classe básica com tipos
class Pessoa {
  // Propriedades com modificadores de acesso
  private _id: string;
  protected nome: string;
  public email: string;
  readonly dataNascimento: Date;

  // Constructor com parameter properties
  constructor(
    id: string,
    nome: string,
    email: string,
    private idade: number // Propriedade criada automaticamente
  ) {
    this._id = id;
    this.nome = nome;
    this.email = email;
    this.dataNascimento = new Date();
  }

  // Getter e Setter
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    if (value.length < 3) {
      throw new Error('ID deve ter pelo menos 3 caracteres');
    }
    this._id = value;
  }

  // Método público
  public apresentar(): string {
    return `Olá, eu sou ${this.nome}`;
  }

  // Método protegido
  protected calcularIdadeEm(ano: number): number {
    return ano - this.dataNascimento.getFullYear();
  }

  // Método estático
  static criarPessoaAleatoria(): Pessoa {
    return new Pessoa(
      Math.random().toString(),
      'Nome Aleatório',
      'email@exemplo.com',
      25
    );
  }
}

// Herança
class Funcionario extends Pessoa {
  constructor(
    id: string,
    nome: string,
    email: string,
    idade: number,
    private salario: number,
    private cargo: string
  ) {
    super(id, nome, email, idade);
  }

  // Sobrescrever método
  public apresentar(): string {
    return `${super.apresentar()} e trabalho como ${this.cargo}`;
  }

  // Usar método protegido da classe pai
  public idadeQuandoAposentar(): number {
    return this.calcularIdadeEm(2040);
  }
}
```

#### Classes Abstratas
```typescript
// Classe abstrata
abstract class Animal {
  protected nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  // Método concreto
  mover(): void {
    console.log(`${this.nome} está se movendo`);
  }

  // Método abstrato (deve ser implementado pelas subclasses)
  abstract emitirSom(): string;
}

class Cachorro extends Animal {
  emitirSom(): string {
    return 'Au au!';
  }

  latir(): void {
    console.log(this.emitirSom());
  }
}

class Gato extends Animal {
  emitirSom(): string {
    return 'Miau!';
  }
}
```

### Type Guards e Assertions

#### Type Guards
```typescript
// Type guard com typeof
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

// Type guard customizado
interface Carro {
  marca: string;
  modelo: string;
  acelerar(): void;
}

interface Bicicleta {
  marca: string;
  tipo: string;
  pedalar(): void;
}

function isCarro(veiculo: Carro | Bicicleta): veiculo is Carro {
  return 'acelerar' in veiculo;
}

function usarVeiculo(veiculo: Carro | Bicicleta) {
  if (isCarro(veiculo)) {
    veiculo.acelerar(); // TypeScript sabe que é Carro
  } else {
    veiculo.pedalar(); // TypeScript sabe que é Bicicleta
  }
}

// Discriminated Unions
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: any;
}

interface ErrorState {
  status: 'error';
  error: string;
}

type State = LoadingState | SuccessState | ErrorState;

function handleState(state: State) {
  switch (state.status) {
    case 'loading':
      // TypeScript sabe que é LoadingState
      console.log('Carregando...');
      break;
    case 'success':
      // TypeScript sabe que é SuccessState
      console.log('Dados:', state.data);
      break;
    case 'error':
      // TypeScript sabe que é ErrorState
      console.log('Erro:', state.error);
      break;
  }
}
```

### Utility Types

#### Utility Types Essenciais
```typescript
interface Usuario {
  id: string;
  nome: string;
  email: string;
  idade: number;
  ativo: boolean;
}

// Partial - torna todas as propriedades opcionais
type UsuarioPartial = Partial<Usuario>;
// { id?: string; nome?: string; email?: string; idade?: number; ativo?: boolean; }

// Required - torna todas as propriedades obrigatórias
type UsuarioCompleto = Required<UsuarioPartial>;

// Pick - seleciona apenas algumas propriedades
type UsuarioPublico = Pick<Usuario, 'id' | 'nome'>;
// { id: string; nome: string; }

// Omit - exclui algumas propriedades
type UsuarioSemId = Omit<Usuario, 'id'>;
// { nome: string; email: string; idade: number; ativo: boolean; }

// Record - cria objeto com chaves e tipos específicos
type UsuariosPorId = Record<string, Usuario>;
// { [key: string]: Usuario }

// Exclude - remove tipos de uma união
type SemString = Exclude<string | number | boolean, string>;
// number | boolean

// Extract - extrai tipos de uma união
type ApenasString = Extract<string | number | boolean, string>;
// string

// NonNullable - remove null e undefined
type SemNulos = NonNullable<string | number | null | undefined>;
// string | number

// ReturnType - obtém o tipo de retorno de uma função
function criarUsuario(): Usuario {
  return {
    id: '1',
    nome: 'João',
    email: 'joao@email.com',
    idade: 30,
    ativo: true
  };
}

type TipoRetorno = ReturnType<typeof criarUsuario>; // Usuario

// Parameters - obtém os tipos dos parâmetros de uma função
function atualizarUsuario(id: string, dados: Partial<Usuario>): Usuario {
  // implementação
  return {} as Usuario;
}

type ParametrosAtualizacao = Parameters<typeof atualizarUsuario>;
// [string, Partial<Usuario>]
```

### Mapped Types e Conditional Types

#### Mapped Types
```typescript
// Mapped type básico
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type UsuarioReadonly = Readonly<Usuario>;

// Mapped type com modificadores
type Optional<T> = {
  [P in keyof T]?: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Mapped type avançado com template literals
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UsuarioGetters = Getters<Usuario>;
// {
//   getId: () => string;
//   getNome: () => string;
//   getEmail: () => string;
//   getIdade: () => number;
//   getAtivo: () => boolean;
// }
```

#### Conditional Types
```typescript
// Conditional type básico
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// Conditional type com inferência
type GetArrayType<T> = T extends (infer U)[] ? U : never;

type StringArray = GetArrayType<string[]>; // string
type NumberArray = GetArrayType<number[]>; // number

// Conditional type complexo
type ApiResponse<T> = T extends { error: any }
  ? { success: false; error: T['error'] }
  : { success: true; data: T };

interface SuccessData {
  usuarios: Usuario[];
}

interface ErrorData {
  error: string;
}

type SuccessResponse = ApiResponse<SuccessData>;
// { success: true; data: SuccessData }

type ErrorResponse = ApiResponse<ErrorData>;
// { success: false; error: string }
```

### Async/Await e Promises Tipadas

#### Promises com TypeScript
```typescript
// Função async tipada
async function buscarUsuario(id: string): Promise<Usuario | null> {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    
    if (!response.ok) {
      return null;
    }
    
    const usuario: Usuario = await response.json();
    return usuario;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

// Promise com generic
function criarPromiseComDelay<T>(valor: T, delay: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), delay);
  });
}

// Uso
const resultado = await criarPromiseComDelay('Hello', 1000); // string
const numero = await criarPromiseComDelay(42, 500); // number

// Promise.all tipado
async function buscarDadosCompletos(userId: string) {
  const [usuario, posts, comentarios] = await Promise.all([
    buscarUsuario(userId),
    buscarPostsDoUsuario(userId),
    buscarComentariosDoUsuario(userId)
  ]);

  return {
    usuario,
    posts,
    comentarios
  };
}

// Tipo de retorno inferido automaticamente
type DadosCompletos = Awaited<ReturnType<typeof buscarDadosCompletos>>;
```

### Error Handling Tipado

#### Tratamento de Erros
```typescript
// Classe de erro customizada
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Result type para tratamento de erros sem exceptions
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function buscarUsuarioSeguro(id: string): Promise<Result<Usuario, ApiError>> {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: new ApiError(
          'Usuário não encontrado',
          response.status,
          'USER_NOT_FOUND'
        )
      };
    }
    
    const usuario: Usuario = await response.json();
    return { success: true, data: usuario };
  } catch (error) {
    return {
      success: false,
      error: new ApiError('Erro interno', 500, 'INTERNAL_ERROR')
    };
  }
}

// Uso do Result type
async function exemploUsoResult() {
  const resultado = await buscarUsuarioSeguro('123');
  
  if (resultado.success) {
    console.log('Usuário:', resultado.data.nome);
  } else {
    console.error('Erro:', resultado.error.message);
    
    if (resultado.error.code === 'USER_NOT_FOUND') {
      // Tratamento específico
    }
  }
}
```

### Integração com React

#### Componentes React Tipados
```typescript
import React, { useState, useEffect } from 'react';

// Props interface
interface UsuarioCardProps {
  usuario: Usuario;
  onEdit?: (usuario: Usuario) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

// Componente funcional tipado
const UsuarioCard: React.FC<UsuarioCardProps> = ({
  usuario,
  onEdit,
  onDelete,
  className = ''
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(usuario);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (onDelete) {
        await onDelete(usuario.id);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`usuario-card ${className}`}>
      <h3>{usuario.nome}</h3>
      <p>{usuario.email}</p>
      
      <div className="acoes">
        <button onClick={handleEdit} disabled={loading}>
          Editar
        </button>
        <button onClick={handleDelete} disabled={loading}>
          {loading ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </div>
  );
};

// Hook customizado tipado
function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/usuarios');
      const data: Usuario[] = await response.json();
      
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const adicionarUsuario = async (novoUsuario: Omit<Usuario, 'id'>) => {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
      });
      
      const usuario: Usuario = await response.json();
      setUsuarios(prev => [...prev, usuario]);
      
      return usuario;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar usuário');
      throw err;
    }
  };

  return {
    usuarios,
    loading,
    error,
    buscarUsuarios,
    adicionarUsuario
  };
}

// Context tipado
interface AppContextType {
  usuarios: Usuario[];
  usuarioAtual: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

function useAppContext(): AppContextType {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
}
```

### Configuração e Ferramentas

#### tsconfig.json Otimizado
```json
{
  "compilerOptions": {
    // Target e Module
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    
    // Strict Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    
    // Additional Checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    
    // Module Resolution
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    // Output
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    // JSX (para React)
    "jsx": "react-jsx",
    
    // Path Mapping
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"]
    },
    
    // Library
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    
    // Experimental
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*",
    "src/**/*.json"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### Declaration Files e Ambient Types

#### Criando Types para Bibliotecas
```typescript
// types/global.d.ts - Tipos globais
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
      DATABASE_URL: string;
    }
  }
}

// types/api.d.ts - Tipos para API
declare namespace API {
  interface Response<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  interface PaginatedResponse<T> extends Response<T[]> {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
  
  namespace Usuario {
    interface Create {
      nome: string;
      email: string;
      idade: number;
    }
    
    interface Update extends Partial<Create> {}
    
    interface Filter {
      nome?: string;
      email?: string;
      ativo?: boolean;
      page?: number;
      limit?: number;
    }
  }
}

// Module augmentation para bibliotecas existentes
declare module 'express-serve-static-core' {
  interface Request {
    user?: Usuario;
    correlationId?: string;
  }
}

// Ambient module para bibliotecas sem tipos
declare module 'biblioteca-sem-tipos' {
  export function metodoUtil(param: string): number;
  export interface ConfigInterface {
    apiKey: string;
    timeout: number;
  }
}
```

---

## 🎯 Resumo dos Conceitos TypeScript

Este arquivo contém os principais conceitos do **TypeScript** que todo desenvolvedor deve dominar:

### Tipagem Estática
- **Tipos Primitivos**: string, number, boolean, null, undefined
- **Arrays e Tuplas**: Estruturas de dados tipadas
- **Enums**: Constantes nomeadas e organizadas
- **Union e Intersection Types**: Combinação de tipos

### Estruturas Avançadas
- **Interfaces**: Contratos para objetos e classes
- **Types**: Aliases e tipos personalizados
- **Generics**: Reutilização de código com tipos flexíveis
- **Classes**: OOP com tipagem completa

### Funcionalidades Avançadas
- **Type Guards**: Verificação de tipos em runtime
- **Utility Types**: Transformação de tipos existentes
- **Mapped Types**: Criação de tipos baseados em outros
- **Conditional Types**: Lógica condicional em tipos

### Integração e Ferramentas
- **React + TypeScript**: Componentes e hooks tipados
- **Node.js + TypeScript**: APIs e backend tipados
- **Declaration Files**: Tipos para bibliotecas externas
- **tsconfig.json**: Configuração otimizada do compilador

### Performance e Produtividade
- **Strict Mode**: Verificações rigorosas de tipos
- **Path Mapping**: Importações organizadas
- **Build Optimization**: Compilação eficiente
- **Editor Integration**: IntelliSense e refactoring automático
