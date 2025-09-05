# Resumo de Conceitos React.js

## 📚 Sobre este arquivo
Este arquivo contém conceitos específicos do **React.js** - biblioteca JavaScript para criar interfaces de usuário com componentes reutilizáveis e estado reativo:

### 🎣 Hooks Fundamentais
- `useState` - Gerenciamento de estado local
- `useEffect` - Efeitos colaterais e ciclo de vida
- `useContext` - Consumo de contexto React
- `useReducer` - Estados complexos com lógica centralizada
- `useRef` - Referências DOM e valores mutáveis

### 🎣 Hooks de Performance
- `useMemo` - Memoização de valores computados
- `useCallback` - Memoização de funções
- `React.memo` - Prevenção de re-renderizações
- Custom Hooks - Reutilização de lógica

### 🏗️ Arquitetura de Componentes
- Componentização e reutilização
- Props e State (propriedades e estado)
- Context API para estado global
- Padrões de composição avançados

### 🎨 Renderização e UI
- Renderização condicional
- Renderização de listas com keys
- Tratamento de eventos
- Fragmentos para evitar wrappers

### ⚡ Funcionalidades Avançadas
- Error Boundaries para captura de erros
- Portals para renderização fora da hierarquia
- Suspense e Concurrent Features
- Refs avançados com forwardRef

### 🔄 Ciclo de Vida e Efeitos
- useEffect para mount, update e unmount
- Cleanup de efeitos e listeners
- Dependências e otimizações
- Strict Mode para debugging

### 🚀 Performance e Otimização
- Lazy Loading de componentes
- Code splitting e Suspense
- Memoização estratégica
- Bundle analysis e Web Vitals

### 🧪 Padrões e Técnicas
- Higher-Order Components (HOCs)
- Render Props pattern
- Compound Components
- Children como função

### 📱 Integração e Roteamento
- React Router para navegação
- Formulários e validação
- Consumo de APIs
- Autenticação e autorização

### 🛠️ Testing e DevTools
- Testes unitários e de integração
- Testing Library e Jest
- React DevTools
- Debugging e performance profiling

> **Nota**: Para conceitos de Next.js (framework), consulte o arquivo `conceitos-nextjs.md`
> Para conceitos de JavaScript puro, consulte o arquivo `conceitos-javascript.md`

---

## React.js

### useState
O `useState` é um hook do React usado para criar e manipular estados locais em componentes funcionais.
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Você clicou {count} vezes</p>
      <button onClick={() => setCount(count + 1)}>Clique aqui</button>
      <button onClick={() => setCount(prev => prev - 1)}>Decrementar</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Estado com objeto
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const updateUser = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <form>
      <input 
        value={user.name}
        onChange={(e) => updateUser('name', e.target.value)}
        placeholder="Nome"
      />
      <input 
        value={user.email}
        onChange={(e) => updateUser('email', e.target.value)}
        placeholder="Email"
      />
    </form>
  );
}
```

### useEffect
Hook para executar efeitos colaterais em componentes funcionais.
```jsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Efeito que executa após o mount
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Array vazio = executa apenas no mount
  
  useEffect(() => {
    // Efeito que executa quando data muda
    if (data) {
      document.title = `Dados carregados: ${data.length} itens`;
    }
    
    // Cleanup function
    return () => {
      document.title = 'Minha App';
    };
  }, [data]); // Executa quando 'data' muda
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return <div>Dados: {JSON.stringify(data)}</div>;
}
```

### Context API
A Context API do React permite compartilhar dados (estado) entre componentes sem precisar passar props manualmente em cada nível da árvore de componentes.
```jsx
import { createContext, useContext, useReducer } from 'react';

// Criar contexto
const ThemeContext = createContext();
const UserContext = createContext();

// Provider para tema
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Provider com useReducer para estados complexos
const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    isAuthenticated: false
  });
  
  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook customizado para usar o contexto
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de UserProvider');
  }
  return context;
}

// Componente que usa os contextos
function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, dispatch } = useUser();
  
  return (
    <header className={theme}>
      <h1>Minha App</h1>
      <button onClick={toggleTheme}>
        Mudar para {theme === 'light' ? 'dark' : 'light'}
      </button>
      
      {isAuthenticated ? (
        <div>
          <span>Olá, {user.name}!</span>
          <button onClick={() => dispatch({ type: 'LOGOUT' })}>
            Sair
          </button>
        </div>
      ) : (
        <button onClick={() => dispatch({ 
          type: 'LOGIN', 
          payload: { name: 'João', email: 'joao@email.com' }
        })}>
          Entrar
        </button>
      )}
    </header>
  );
}
```

### Componentização e Reutilização de Componentes
Divida a interface em componentes independentes e reutilizáveis para facilitar manutenção e escalabilidade.
```jsx
// Componente Button reutilizável
function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  type = 'button',
  ...props 
}) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };
  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  };
  
  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  
  return (
    <button 
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Componente Input reutilizável
function Input({ 
  label, 
  error, 
  helperText, 
  required = false,
  ...inputProps 
}) {
  const id = inputProps.id || inputProps.name;
  
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <input 
        id={id}
        className={`input ${error ? 'input-error' : ''}`}
        aria-describedby={helperText ? `${id}-help` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        {...inputProps}
      />
      
      {helperText && (
        <div id={`${id}-help`} className="input-help">
          {helperText}
        </div>
      )}
      
      {error && (
        <div className="input-error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

// Uso dos componentes
function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nome"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        required
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
        helperText="Digite seu melhor email"
        required
      />
      
      <div className="form-actions">
        <Button type="submit" variant="primary">
          Salvar
        </Button>
        <Button type="button" variant="secondary">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
```

### Props e Estado (State) no React
Props são dados passados para componentes filhos. Estado é a informação interna do componente que pode mudar ao longo do tempo.
```jsx
// Componente que recebe props
function UserCard({ user, onEdit, onDelete, isEditable = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await onEdit(user.id);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="user-card">
      <div className="user-header">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      
      {isExpanded && (
        <div className="user-details">
          <p>Idade: {user.age}</p>
          <p>Cidade: {user.city}</p>
          <p>Telefone: {user.phone}</p>
        </div>
      )}
      
      <div className="user-actions">
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Ocultar' : 'Mostrar'} detalhes
        </button>
        
        {isEditable && (
          <>
            <button 
              onClick={handleEdit}
              disabled={isLoading}
            >
              {isLoading ? 'Editando...' : 'Editar'}
            </button>
            <button 
              onClick={() => onDelete(user.id)}
              className="btn-danger"
            >
              Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Tipagem com PropTypes (opcional)
import PropTypes from 'prop-types';

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    age: PropTypes.number,
    city: PropTypes.string,
    phone: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isEditable: PropTypes.bool
};
```

### useMemo
Hook para otimizar performance, memorizando o resultado de cálculos custosos.
```jsx
import { useMemo, useState } from 'react';

function ExpensiveComponent({ items, filterText }) {
  const [count, setCount] = useState(0);
  
  // Cálculo pesado que só executa quando items ou filterText mudam
  const filteredAndSortedItems = useMemo(() => {
    console.log('Processando items...'); // Log para ver quando executa
    
    return items
      .filter(item => 
        item.name.toLowerCase().includes(filterText.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(item => ({
        ...item,
        displayName: item.name.charAt(0).toUpperCase() + item.name.slice(1)
      }));
  }, [items, filterText]); // Dependências
  
  // Cálculo simples que sempre executa
  const totalItems = filteredAndSortedItems.length;
  
  return (
    <div>
      <p>Total de itens: {totalItems}</p>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Incrementar contador
      </button>
      
      <ul>
        {filteredAndSortedItems.map(item => (
          <li key={item.id}>{item.displayName}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useCallback
Hook para otimizar performance, memorizando funções para evitar re-renderizações desnecessárias.
```jsx
import { useCallback, useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // Função memorizada que só muda quando setTodos muda
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  }, []); // Dependências vazias porque setTodos é sempre a mesma função
  
  // Função memorizada que depende do estado atual
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  }, []);
  
  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  
  return (
    <div>
      <TodoForm onAdd={addTodo} />
      <TodoFilter filter={filter} onChange={setFilter} />
      <TodoList 
        todos={todos}
        filter={filter}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

// Componente filho que se beneficia das funções memorizadas
const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  console.log('Renderizando TodoItem:', todo.id); // Log para ver re-renders
  
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Deletar</button>
    </div>
  );
});
```

### useReducer
Hook para gerenciar estados complexos com lógica de atualização centralizada.
```jsx
import { useReducer } from 'react';

// Reducer function
const shoppingCartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
      
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discount: action.payload
      };
      
    default:
      throw new Error(`Ação não reconhecida: ${action.type}`);
  }
};

function ShoppingCart() {
  const [cart, dispatch] = useReducer(shoppingCartReducer, {
    items: [],
    discount: 0
  });
  
  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };
  
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const applyDiscount = (percentage) => {
    dispatch({ type: 'APPLY_DISCOUNT', payload: percentage });
  };
  
  const total = cart.items.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  
  const discountedTotal = total * (1 - cart.discount / 100);
  
  return (
    <div>
      <h2>Carrinho de Compras</h2>
      
      {cart.items.length === 0 ? (
        <p>Carrinho vazio</p>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>R$ {item.price}</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                min="0"
              />
              <button onClick={() => removeFromCart(item.id)}>
                Remover
              </button>
            </div>
          ))}
          
          <div className="cart-summary">
            <p>Subtotal: R$ {total.toFixed(2)}</p>
            {cart.discount > 0 && (
              <p>Desconto: {cart.discount}%</p>
            )}
            <p><strong>Total: R$ {discountedTotal.toFixed(2)}</strong></p>
            
            <button onClick={clearCart}>Limpar Carrinho</button>
            <button onClick={() => applyDiscount(10)}>
              Aplicar desconto 10%
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

### useRef
Hook para acessar elementos DOM diretamente ou manter valores mutáveis entre renders.
```jsx
import { useRef, useEffect, useState } from 'react';

function FormWithFocus() {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const countRef = useRef(0); // Não causa re-render quando muda
  const [renderCount, setRenderCount] = useState(0);
  
  useEffect(() => {
    // Foca no input quando componente monta
    inputRef.current?.focus();
  }, []);
  
  useEffect(() => {
    // Incrementa o contador sem causar re-render
    countRef.current += 1;
    console.log('Render count:', countRef.current);
  });
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const forceRender = () => {
    setRenderCount(prev => prev + 1);
  };
  
  return (
    <div>
      <h3>Exemplo useRef</h3>
      
      <div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Este input recebe foco automaticamente"
        />
      </div>
      
      <div>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => console.log('Arquivo selecionado:', e.target.files[0])}
        />
        <button onClick={handleFileSelect}>
          Selecionar Arquivo
        </button>
      </div>
      
      <div>
        <p>Renders do componente: {renderCount}</p>
        <p>Total de renders (não causa re-render): {countRef.current}</p>
        <button onClick={forceRender}>
          Forçar Re-render
        </button>
      </div>
    </div>
  );
}

// Exemplo avançado: Timer com useRef
function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  
  const startTimer = () => {
    if (intervalRef.current) return; // Já está rodando
    
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  
  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };
  
  // Cleanup do interval quando componente desmonta
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div>
      <h1>{formatTime(time)}</h1>
      <div>
        <button onClick={startTimer} disabled={isRunning}>
          Iniciar
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          Parar
        </button>
        <button onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}
```

### Custom Hooks
Hooks personalizados para reutilizar lógica entre componentes.
```jsx
// Hook personalizado para requisições HTTP
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  return { data, loading, error, refetch };
}

// Hook para localStorage
function useLocalStorage(key, initialValue) {
  // Função para obter valor inicial
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage para ${key}:`, error);
      return initialValue;
    }
  };
  
  const [storedValue, setStoredValue] = useState(getStoredValue);
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para ${key}:`, error);
    }
  };
  
  return [storedValue, setValue];
}

// Hook para debounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Hook para controle de formulários
function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpa erro quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const setTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  const validate = () => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.required;
      } else if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[field] = `Mínimo ${rule.minLength} caracteres`;
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || 'Formato inválido';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}

// Exemplo de uso dos hooks personalizados
function UserProfile() {
  const { data: user, loading, error, refetch } = useApi('/api/user/profile');
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const {
    values,
    errors,
    setValue,
    handleSubmit,
    reset
  } = useForm(
    { name: '', email: '' },
    {
      name: { required: 'Nome é obrigatório', minLength: 2 },
      email: { 
        required: 'Email é obrigatório',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email inválido'
      }
    }
  );
  
  const onSubmit = (formData) => {
    console.log('Dados do formulário:', formData);
    reset();
  };
  
  // Efeito para busca com debounce
  useEffect(() => {
    if (debouncedSearch) {
      console.log('Buscando por:', debouncedSearch);
      // Fazer requisição de busca aqui
    }
  }, [debouncedSearch]);
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div className={`profile-page theme-${theme}`}>
      <h1>Perfil do Usuário</h1>
      
      <div>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Mudar tema: {theme}
        </button>
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Nome"
          value={values.name}
          onChange={(e) => setValue('name', e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        
        <input
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        
        <button type="submit">Salvar</button>
        <button type="button" onClick={reset}>Limpar</button>
      </form>
      
      <button onClick={refetch}>Recarregar dados</button>
    </div>
  );
}
```

### Renderização Condicional e Listas
Técnicas para renderizar componentes condicionalmente e trabalhar com listas de dados.
```jsx
function ConditionalRenderingExample() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', category: 'A', active: true },
    { id: 2, name: 'Item 2', category: 'B', active: false },
    { id: 3, name: 'Item 3', category: 'A', active: true },
  ]);
  
  // Renderização condicional com &&
  const renderUserInfo = () => (
    <div>
      {user && (
        <div className="user-info">
          <h3>Bem-vindo, {user.name}!</h3>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
  
  // Renderização condicional com ternário
  const renderContent = () => (
    <div>
      {isLoading ? (
        <div className="loading-spinner">Carregando...</div>
      ) : user ? (
        <div>
          <h2>Dashboard</h2>
          {renderUserInfo()}
        </div>
      ) : (
        <div>
          <h2>Faça login</h2>
          <button onClick={() => setUser({ name: 'João', email: 'joao@email.com' })}>
            Login
          </button>
        </div>
      )}
    </div>
  );
  
  // Renderização de listas com filtros
  const activeItems = items.filter(item => item.active);
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
  
  return (
    <div>
      {renderContent()}
      
      {/* Toggle para mostrar configurações avançadas */}
      <div>
        <button onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? 'Ocultar' : 'Mostrar'} configurações avançadas
        </button>
        
        {showAdvanced && (
          <div className="advanced-settings">
            <h4>Configurações Avançadas</h4>
            <label>
              <input type="checkbox" />
              Notificações por email
            </label>
            <label>
              <input type="checkbox" />
              Modo desenvolvedor
            </label>
          </div>
        )}
      </div>
      
      {/* Renderização de lista simples */}
      <div>
        <h3>Todos os itens ({items.length})</h3>
        <ul>
          {items.map(item => (
            <li key={item.id} className={item.active ? 'active' : 'inactive'}>
              {item.name} - {item.category}
              <button onClick={() => {
                setItems(prev => prev.map(i => 
                  i.id === item.id ? { ...i, active: !i.active } : i
                ));
              }}>
                {item.active ? 'Desativar' : 'Ativar'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Renderização de lista filtrada */}
      <div>
        <h3>Itens ativos ({activeItems.length})</h3>
        {activeItems.length > 0 ? (
          <ul>
            {activeItems.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhum item ativo encontrado.</p>
        )}
      </div>
      
      {/* Renderização agrupada por categoria */}
      <div>
        <h3>Itens por categoria</h3>
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category}>
            <h4>Categoria {category}</h4>
            <ul>
              {categoryItems.map(item => (
                <li key={item.id}>
                  {item.name} {item.active ? '✅' : '❌'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Tratamento de Eventos
Como trabalhar com eventos em React de forma eficiente e segura.
```jsx
function EventHandlingExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false,
    category: 'general'
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [keyPressed, setKeyPressed] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  
  // Event handler genérico para inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Prevenir comportamento padrão
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
  };
  
  // Event handlers para mouse
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#f0f0f0';
  };
  
  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '';
  };
  
  // Event handlers para teclado
  const handleKeyDown = (e) => {
    setKeyPressed(e.key);
    
    // Atalhos de teclado
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      console.log('Salvando...');
    }
    
    if (e.key === 'Escape') {
      setFormData({
        name: '',
        email: '',
        message: '',
        subscribe: false,
        category: 'general'
      });
    }
  };
  
  // Event handlers para drag & drop
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, targetZone) => {
    e.preventDefault();
    console.log(`Item ${draggedItem} movido para ${targetZone}`);
    setDraggedItem(null);
  };
  
  // Event handler para upload de arquivos
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      console.log('Arquivo selecionado:', file.name, file.size, file.type);
    });
  };
  
  // Event delegation para lista dinâmica
  const handleListClick = (e) => {
    // Encontra o item clicado mais próximo
    const listItem = e.target.closest('.list-item');
    if (listItem) {
      const action = e.target.dataset.action;
      const itemId = listItem.dataset.id;
      
      switch (action) {
        case 'edit':
          console.log('Editando item:', itemId);
          break;
        case 'delete':
          console.log('Deletando item:', itemId);
          break;
        default:
          console.log('Item clicado:', itemId);
      }
    }
  };
  
  return (
    <div onMouseMove={handleMouseMove}>
      <h2>Tratamento de Eventos</h2>
      
      {/* Formulário com diferentes tipos de eventos */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.target.style.borderColor = 'blue'}
            onBlur={(e) => e.target.style.borderColor = ''}
          />
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <textarea
            name="message"
            placeholder="Mensagem"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
          />
        </div>
        
        <div>
          <label>
            <input
              type="checkbox"
              name="subscribe"
              checked={formData.subscribe}
              onChange={handleInputChange}
            />
            Receber newsletter
          </label>
        </div>
        
        <div>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="general">Geral</option>
            <option value="support">Suporte</option>
            <option value="sales">Vendas</option>
          </select>
        </div>
        
        <div>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept=".jpg,.png,.pdf"
          />
        </div>
        
        <button type="submit">Enviar</button>
      </form>
      
      {/* Área para eventos de mouse */}
      <div
        style={{
          padding: '20px',
          border: '1px solid #ccc',
          margin: '20px 0'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Passe o mouse aqui
        <p>Posição do mouse: X: {mousePosition.x}, Y: {mousePosition.y}</p>
        <p>Última tecla pressionada: {keyPressed}</p>
      </div>
      
      {/* Drag & Drop */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ padding: '20px', border: '2px solid blue' }}>
          <h4>Itens arrastáveis</h4>
          {['Item 1', 'Item 2', 'Item 3'].map(item => (
            <div
              key={item}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              style={{
                padding: '10px',
                margin: '5px',
                backgroundColor: '#e0e0e0',
                cursor: 'move'
              }}
            >
              {item}
            </div>
          ))}
        </div>
        
        <div
          style={{
            padding: '20px',
            border: '2px dashed green',
            minHeight: '200px'
          }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'zona-drop')}
        >
          <h4>Solte aqui</h4>
          {draggedItem && <p>Arrastando: {draggedItem}</p>}
        </div>
      </div>
      
      {/* Event delegation */}
      <div onClick={handleListClick}>
        <h4>Lista com event delegation</h4>
        {[1, 2, 3].map(id => (
          <div key={id} className="list-item" data-id={id}>
            <span>Item {id}</span>
            <button data-action="edit">Editar</button>
            <button data-action="delete">Deletar</button>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Dicas:</p>
        <ul>
          <li>Ctrl+S para salvar</li>
          <li>Esc para limpar formulário</li>
          <li>Arraste itens para a zona de drop</li>
        </ul>
      </div>
    </div>
  );
}
```

### React.memo e Otimização de Performance
Como otimizar componentes React para evitar re-renderizações desnecessárias.
```jsx
import React, { memo, useState, useCallback, useMemo } from 'react';

// Componente simples com React.memo
const SimpleCard = memo(function SimpleCard({ title, content }) {
  console.log('Renderizando SimpleCard:', title);
  
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
});

// Componente com comparação customizada
const UserItem = memo(function UserItem({ user, onEdit }) {
  console.log('Renderizando UserItem:', user.id);
  
  return (
    <div className="user-item">
      <span>{user.name} - {user.email}</span>
      <button onClick={() => onEdit(user.id)}>Editar</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada - só re-renderiza se user.id ou user.name mudaram
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email
  );
});

// Componente com lista otimizada
const OptimizedList = memo(function OptimizedList({ 
  items, 
  onItemClick, 
  filterText 
}) {
  console.log('Renderizando OptimizedList');
  
  // useMemo para filtrar lista apenas quando necessário
  const filteredItems = useMemo(() => {
    console.log('Filtrando items...');
    return items.filter(item => 
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [items, filterText]);
  
  // useMemo para calcular estatísticas
  const stats = useMemo(() => {
    console.log('Calculando estatísticas...');
    return {
      total: filteredItems.length,
      active: filteredItems.filter(item => item.active).length,
      inactive: filteredItems.filter(item => !item.active).length
    };
  }, [filteredItems]);
  
  return (
    <div>
      <div className="stats">
        <span>Total: {stats.total}</span>
        <span>Ativos: {stats.active}</span>
        <span>Inativos: {stats.inactive}</span>
      </div>
      
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            <span>{item.name}</span>
            <button onClick={() => onItemClick(item.id)}>
              Clique
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

// Componente principal que demonstra as otimizações
function PerformanceExample() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([
    { id: 1, name: 'João', email: 'joao@email.com' },
    { id: 2, name: 'Maria', email: 'maria@email.com' },
    { id: 3, name: 'Pedro', email: 'pedro@email.com' }
  ]);
  const [filterText, setFilterText] = useState('');
  const [items] = useState([
    { id: 1, name: 'Item A', active: true },
    { id: 2, name: 'Item B', active: false },
    { id: 3, name: 'Item C', active: true },
    { id: 4, name: 'Item D', active: false }
  ]);
  
  // useCallback para memorizar função
  const handleUserEdit = useCallback((userId) => {
    console.log('Editando usuário:', userId);
    setUsers(prev => prev.map(user =>
      user.id === userId 
        ? { ...user, name: user.name + ' (editado)' }
        : user
    ));
  }, []);
  
  // useCallback para função de clique em item
  const handleItemClick = useCallback((itemId) => {
    console.log('Item clicado:', itemId);
  }, []);
  
  return (
    <div>
      <h2>Exemplo de Performance</h2>
      
      {/* Contador que não afeta outros componentes */}
      <div>
        <p>Contador: {count}</p>
        <button onClick={() => setCount(c => c + 1)}>
          Incrementar (não deve re-renderizar outros componentes)
        </button>
      </div>
      
      {/* Cards simples que não re-renderizam */}
      <div>
        <h3>Cards Simples (React.memo)</h3>
        <SimpleCard title="Card 1" content="Conteúdo fixo 1" />
        <SimpleCard title="Card 2" content="Conteúdo fixo 2" />
      </div>
      
      {/* Lista de usuários otimizada */}
      <div>
        <h3>Lista de Usuários</h3>
        {users.map(user => (
          <UserItem 
            key={user.id} 
            user={user} 
            onEdit={handleUserEdit}
          />
        ))}
      </div>
      
      {/* Lista com filtro */}
      <div>
        <h3>Lista Filtrada</h3>
        <input
          type="text"
          placeholder="Filtrar items..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <OptimizedList 
          items={items}
          filterText={filterText}
          onItemClick={handleItemClick}
        />
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p><strong>Dicas de Performance:</strong></p>
        <ul>
          <li>Use React.memo para componentes que recebem props estáveis</li>
          <li>Use useCallback para funções passadas como props</li>
          <li>Use useMemo para cálculos custosos</li>
          <li>Abra o console para ver quando os componentes re-renderizam</li>
        </ul>
      </div>
    </div>
  );
}

export default PerformanceExample;
```

### Error Boundaries
Como capturar e tratar erros em componentes React.
```jsx
import React from 'react';

// Error Boundary com classe (ainda necessário usar classe para isso)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    // Atualiza o state para mostrar a UI de erro
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Captura detalhes do erro
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log do erro (enviar para serviço de monitoramento)
    console.error('Erro capturado pelo Error Boundary:', error, errorInfo);
    
    // Aqui você pode enviar o erro para um serviço como Sentry
    // reportError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      // UI de fallback customizada
      return (
        <div className="error-boundary">
          <h2>Oops! Algo deu errado.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Detalhes do erro (clique para expandir)</summary>
            <p><strong>Erro:</strong> {this.state.error && this.state.error.toString()}</p>
            <p><strong>Stack trace:</strong></p>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
          <button onClick={() => window.location.reload()}>
            Recarregar Página
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Hook personalizado para tratamento de erros em componentes funcionais
function useErrorHandler() {
  const [error, setError] = useState(null);
  
  const handleError = useCallback((error) => {
    setError(error);
    console.error('Erro tratado pelo hook:', error);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return { error, handleError, clearError };
}

// Componente que pode gerar erro
function BuggyComponent({ shouldCrash = false }) {
  const [count, setCount] = useState(0);
  
  if (shouldCrash && count > 3) {
    // Simula um erro
    throw new Error('Contador passou de 3! Componente com bug.');
  }
  
  return (
    <div>
      <h3>Componente com Bug</h3>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Incrementar
      </button>
      <p>
        {shouldCrash ? (
          <span style={{ color: 'red' }}>
            ⚠️ Vai dar erro quando passar de 3!
          </span>
        ) : (
          <span style={{ color: 'green' }}>
            ✅ Modo seguro
          </span>
        )}
      </p>
    </div>
  );
}

// Componente que usa o hook de tratamento de erro
function SafeComponent() {
  const { error, handleError, clearError } = useErrorHandler();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    clearError();
    
    try {
      // Simula uma requisição que pode falhar
      const shouldFail = Math.random() > 0.5;
      
      if (shouldFail) {
        throw new Error('Falha na requisição da API');
      }
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData({ message: 'Dados carregados com sucesso!', timestamp: new Date().toISOString() });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (error) {
    return (
      <div className="error-display">
        <h3>Erro no Componente</h3>
        <p style={{ color: 'red' }}>{error.message}</p>
        <button onClick={clearError}>Tentar Novamente</button>
      </div>
    );
  }
  
  return (
    <div>
      <h3>Componente Seguro</h3>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Carregando...' : 'Buscar Dados'}
      </button>
      
      {data && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8' }}>
          <p>{data.message}</p>
          <small>{data.timestamp}</small>
        </div>
      )}
    </div>
  );
}

// Exemplo de uso completo
function ErrorBoundaryExample() {
  const [enableBug, setEnableBug] = useState(false);
  
  return (
    <div>
      <h2>Error Boundaries e Tratamento de Erros</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={enableBug}
            onChange={(e) => setEnableBug(e.target.checked)}
          />
          Ativar componente com bug
        </label>
      </div>
      
      {/* Componente com Error Boundary */}
      <ErrorBoundary>
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <BuggyComponent shouldCrash={enableBug} />
        </div>
      </ErrorBoundary>
      
      {/* Componente com tratamento de erro interno */}
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
        <SafeComponent />
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p><strong>Sobre Error Boundaries:</strong></p>
        <ul>
          <li>Capturam erros JavaScript em qualquer lugar da árvore de componentes</li>
          <li>Exibem uma UI de fallback em vez de quebrar toda a aplicação</li>
          <li>Não capturam erros em event handlers, código assíncrono ou durante SSR</li>
          <li>Ainda precisam ser implementados com classes (não há hook equivalente)</li>
        </ul>
      </div>
    </div>
  );
}

export default ErrorBoundaryExample;
```

### Portals
Como renderizar componentes fora da hierarquia do DOM pai.
```jsx
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

// Hook para criar portal
function usePortal(elementId = 'portal-root') {
  const [portalElement, setPortalElement] = useState(null);
  
  useEffect(() => {
    // Encontra ou cria o elemento portal
    let element = document.getElementById(elementId);
    
    if (!element) {
      element = document.createElement('div');
      element.id = elementId;
      document.body.appendChild(element);
    }
    
    setPortalElement(element);
    
    // Cleanup: remove o elemento se foi criado por este hook
    return () => {
      if (element && element.childNodes.length === 0) {
        document.body.removeChild(element);
      }
    };
  }, [elementId]);
  
  return portalElement;
}

// Componente Modal usando Portal
function Modal({ isOpen, onClose, title, children }) {
  const portalElement = usePortal('modal-root');
  
  useEffect(() => {
    if (isOpen) {
      // Previne scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden';
      
      // Event listener para fechar com ESC
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);
  
  if (!isOpen || !portalElement) return null;
  
  return createPortal(
    <div 
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        <div className="modal-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h2>{title}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    portalElement
  );
}

// Componente Tooltip usando Portal
function Tooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const triggerRef = useRef(null);
  const portalElement = usePortal('tooltip-root');
  
  const showTooltip = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      let style = {
        position: 'absolute',
        zIndex: 1001,
        backgroundColor: '#333',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        pointerEvents: 'none'
      };
      
      switch (position) {
        case 'top':
          style.left = rect.left + scrollLeft + rect.width / 2;
          style.top = rect.top + scrollTop - 30;
          style.transform = 'translateX(-50%)';
          break;
        case 'bottom':
          style.left = rect.left + scrollLeft + rect.width / 2;
          style.top = rect.bottom + scrollTop + 5;
          style.transform = 'translateX(-50%)';
          break;
        case 'left':
          style.left = rect.left + scrollLeft - 5;
          style.top = rect.top + scrollTop + rect.height / 2;
          style.transform = 'translate(-100%, -50%)';
          break;
        case 'right':
          style.left = rect.right + scrollLeft + 5;
          style.top = rect.top + scrollTop + rect.height / 2;
          style.transform = 'translateY(-50%)';
          break;
      }
      
      setTooltipStyle(style);
      setIsVisible(true);
    }
  };
  
  const hideTooltip = () => {
    setIsVisible(false);
  };
  
  const tooltipContent = isVisible && portalElement ? createPortal(
    <div style={tooltipStyle}>
      {content}
    </div>,
    portalElement
  ) : null;
  
  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ cursor: 'help', textDecoration: 'underline dotted' }}
      >
        {children}
      </span>
      {tooltipContent}
    </>
  );
}

// Componente Toast/Notification usando Portal
function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const portalElement = usePortal('toast-root');
  
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  if (!portalElement) return null;
  
  const colors = {
    info: '#007bff',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545'
  };
  
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: colors[type],
        color: 'white',
        padding: '15px 20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1002,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </div>
    </div>,
    portalElement
  );
}

// Exemplo de uso dos Portals
function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type) => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Exemplos de Portal</h2>
      
      {/* Botões para demonstrar funcionalidades */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowModal(true)}>
          Abrir Modal
        </button>
        
        <button onClick={() => addToast('Informação!', 'info')}>
          Toast Info
        </button>
        
        <button onClick={() => addToast('Sucesso!', 'success')}>
          Toast Sucesso
        </button>
        
        <button onClick={() => addToast('Atenção!', 'warning')}>
          Toast Warning
        </button>
        
        <button onClick={() => addToast('Erro!', 'error')}>
          Toast Erro
        </button>
      </div>
      
      {/* Elementos com tooltips */}
      <div style={{ marginBottom: '20px' }}>
        <p>
          Passe o mouse sobre os textos: {' '}
          <Tooltip content="Tooltip no topo" position="top">
            Tooltip Topo
          </Tooltip>
          {', '}
          <Tooltip content="Tooltip na direita" position="right">
            Tooltip Direita
          </Tooltip>
          {', '}
          <Tooltip content="Tooltip embaixo" position="bottom">
            Tooltip Embaixo
          </Tooltip>
          {', '}
          <Tooltip content="Tooltip na esquerda" position="left">
            Tooltip Esquerda
          </Tooltip>
        </p>
      </div>
      
      {/* Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Exemplo de Modal"
      >
        <p>Este é um modal renderizado usando Portal!</p>
        <p>Ele é renderizado fora da hierarquia normal do DOM.</p>
        <button onClick={() => setShowModal(false)}>
          Fechar Modal
        </button>
      </Modal>
      
      {/* Toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p><strong>Sobre Portals:</strong></p>
        <ul>
          <li>Renderizam componentes fora da hierarquia do DOM pai</li>
          <li>Úteis para modais, tooltips, notifications</li>
          <li>Mantêm o contexto React (props, state, contexto)</li>
          <li>Eventos ainda propagam através da árvore React, não do DOM</li>
        </ul>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default PortalExample;
```

### Padrões de Composição de Componentes
Técnicas avançadas para criar componentes flexíveis e reutilizáveis.
```jsx
// Padrão Compound Components
const Accordion = ({ children, ...props }) => {
  const [openPanels, setOpenPanels] = useState(new Set());
  
  const togglePanel = (id) => {
    setOpenPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  return (
    <div className="accordion" {...props}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          id: index,
          isOpen: openPanels.has(index),
          onToggle: togglePanel
        })
      )}
    </div>
  );
};

const AccordionItem = ({ id, isOpen, onToggle, children }) => {
  return (
    <div className="accordion-item">
      {React.Children.map(children, child =>
        React.cloneElement(child, { id, isOpen, onToggle })
      )}
    </div>
  );
};

const AccordionHeader = ({ id, isOpen, onToggle, children }) => (
  <button
    className="accordion-header"
    onClick={() => onToggle(id)}
    style={{
      width: '100%',
      padding: '10px',
      textAlign: 'left',
      backgroundColor: isOpen ? '#e0e0e0' : '#f5f5f5',
      border: '1px solid #ccc',
      cursor: 'pointer'
    }}
  >
    {children} {isOpen ? '▼' : '▶'}
  </button>
);

const AccordionContent = ({ isOpen, children }) => (
  isOpen ? (
    <div 
      className="accordion-content"
      style={{
        padding: '15px',
        border: '1px solid #ccc',
        borderTop: 'none'
      }}
    >
      {children}
    </div>
  ) : null
);

// Padrão Render Props
class DataFetcher extends React.Component {
  state = {
    data: null,
    loading: true,
    error: null
  };
  
  async componentDidMount() {
    try {
      const response = await fetch(this.props.url);
      const data = await response.json();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }
  
  render() {
    return this.props.children(this.state);
  }
}

// Padrão Higher-Order Component (HOC)
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100px'
        }}>
          <div>Carregando...</div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
}

function withAuth(WrappedComponent) {
  return function WithAuthComponent(props) {
    const [user] = useState({ isAuthenticated: true, name: 'João' }); // Mock
    
    if (!user.isAuthenticated) {
      return <div>Você precisa fazer login para ver este conteúdo.</div>;
    }
    
    return <WrappedComponent {...props} user={user} />;
  };
}

// Componente base
const UserProfile = ({ user, isLoading }) => (
  <div>
    <h3>Perfil do Usuário</h3>
    <p>Nome: {user?.name}</p>
    <p>Autenticado: {user?.isAuthenticated ? 'Sim' : 'Não'}</p>
  </div>
);

// Aplicando HOCs
const UserProfileWithLoading = withLoading(UserProfile);
const UserProfileWithAuth = withAuth(UserProfileWithLoading);

// Padrão Children como Function
const MouseTracker = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  
  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ height: '200px', border: '1px solid #ccc', position: 'relative' }}
    >
      {children(mousePosition)}
    </div>
  );
};

// Padrão Slot/Children com nomes
const Card = ({ header, footer, children, ...props }) => (
  <div className="card" style={{ border: '1px solid #ccc', borderRadius: '8px' }} {...props}>
    {header && (
      <div className="card-header" style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
        {header}
      </div>
    )}
    
    <div className="card-body" style={{ padding: '15px' }}>
      {children}
    </div>
    
    {footer && (
      <div className="card-footer" style={{ padding: '10px', borderTop: '1px solid #eee' }}>
        {footer}
      </div>
    )}
  </div>
);

// Exemplo de uso dos padrões
function CompositionPatternsExample() {
  const [showProtectedContent, setShowProtectedContent] = useState(false);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Padrões de Composição</h2>
      
      {/* Compound Components */}
      <section style={{ marginBottom: '30px' }}>
        <h3>1. Compound Components (Accordion)</h3>
        <Accordion>
          <AccordionItem>
            <AccordionHeader>Seção 1</AccordionHeader>
            <AccordionContent>
              <p>Conteúdo da primeira seção.</p>
              <p>Pode ter múltiplos parágrafos e elementos.</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem>
            <AccordionHeader>Seção 2</AccordionHeader>
            <AccordionContent>
              <p>Conteúdo da segunda seção.</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem>
            <AccordionHeader>Seção 3</AccordionHeader>
            <AccordionContent>
              <p>Conteúdo da terceira seção.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
      {/* Render Props */}
      <section style={{ marginBottom: '30px' }}>
        <h3>2. Render Props (Data Fetcher)</h3>
        <DataFetcher url="https://jsonplaceholder.typicode.com/posts/1">
          {({ data, loading, error }) => {
            if (loading) return <div>Carregando dados...</div>;
            if (error) return <div>Erro: {error.message}</div>;
            return (
              <div>
                <h4>{data?.title}</h4>
                <p>{data?.body}</p>
              </div>
            );
          }}
        </DataFetcher>
      </section>
      
      {/* Higher-Order Components */}
      <section style={{ marginBottom: '30px' }}>
        <h3>3. Higher-Order Components</h3>
        <button onClick={() => setShowProtectedContent(!showProtectedContent)}>
          {showProtectedContent ? 'Ocultar' : 'Mostrar'} conteúdo protegido
        </button>
        
        {showProtectedContent && (
          <div style={{ marginTop: '10px' }}>
            <UserProfileWithAuth isLoading={false} />
          </div>
        )}
      </section>
      
      {/* Children como Function */}
      <section style={{ marginBottom: '30px' }}>
        <h3>4. Children como Function (Mouse Tracker)</h3>
        <MouseTracker>
          {({ x, y }) => (
            <div>
              <p>Posição do mouse: X: {x}, Y: {y}</p>
              <div
                style={{
                  position: 'absolute',
                  left: x - 50,
                  top: y - 50,
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />
            </div>
          )}
        </MouseTracker>
      </section>
      
      {/* Slot Pattern */}
      <section style={{ marginBottom: '30px' }}>
        <h3>5. Slot Pattern (Card com slots)</h3>
        <Card
          header={<strong>Título do Card</strong>}
          footer={
            <div>
              <button>Ação 1</button>
              <button>Ação 2</button>
            </div>
          }
        >
          <p>Este é o conteúdo principal do card.</p>
          <p>Pode conter qualquer coisa que você quiser.</p>
        </Card>
      </section>
      
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p><strong>Padrões de Composição:</strong></p>
        <ul>
          <li><strong>Compound Components:</strong> Componentes que trabalham juntos, compartilhando estado</li>
          <li><strong>Render Props:</strong> Componente recebe função como prop para renderizar UI</li>
          <li><strong>HOC:</strong> Função que recebe componente e retorna componente com funcionalidade adicional</li>
          <li><strong>Children como Function:</strong> Passar dados para children através de função</li>
          <li><strong>Slot Pattern:</strong> Múltiplas áreas nomeadas para conteúdo customizado</li>
        </ul>
      </div>
    </div>
  );
}

export default CompositionPatternsExample;
```

### Suspense e Concurrent Features
Funcionalidades para melhorar a experiência do usuário com carregamento assíncrono e renderização concorrente.
```jsx
import { Suspense, lazy, startTransition, useDeferredValue, useTransition } from 'react';

// Lazy loading com Suspense
const LazyComponent = lazy(() => import('./HeavyComponent'));
const AnotherComponent = lazy(() => import('./AnotherComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Carregando componente...</div>}>
        <LazyComponent />
      </Suspense>
      
      {/* Múltiplos componentes lazy */}
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent />
        <AnotherComponent />
      </Suspense>
    </div>
  );
}

// useTransition para transições não bloqueantes
function SearchApp() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    
    // Transição não bloqueante - não trava a UI
    startTransition(() => {
      // Operação custosa (busca, filtro, etc.)
      const filteredResults = performExpensiveSearch(newQuery);
      setResults(filteredResults);
    });
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar..."
      />
      
      {isPending && <div>Buscando...</div>}
      
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}

// useDeferredValue para otimizar updates de UI
function ProductList({ searchTerm }) {
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // A busca usa o valor "deferred" que não bloqueia a UI
    const filtered = filterProducts(deferredSearchTerm);
    setProducts(filtered);
  }, [deferredSearchTerm]);
  
  return (
    <div>
      {/* UI responde imediatamente ao searchTerm atual */}
      <p>Buscando por: {searchTerm}</p>
      
      {/* Lista usa o valor deferred */}
      <div className={searchTerm !== deferredSearchTerm ? 'dimmed' : ''}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// Suspense para data fetching (React 18+)
const UserProfile = ({ userId }) => {
  // Suspense automaticamente aguarda a promise resolver
  const user = use(fetchUser(userId)); // 'use' hook é experimental
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

// Componente pai com Suspense boundary
function ProfilePage({ userId }) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile userId={userId} />
    </Suspense>
  );
}

// Componente de fallback otimizado
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Carregando...</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="profile-skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  );
}
```

### Fragments e Keys
Como otimizar a renderização de listas e evitar elementos wrapper desnecessários.
```jsx
import { Fragment } from 'react';

function OptimizedList() {
  const items = [
    { id: 1, name: 'Item 1', category: 'A' },
    { id: 2, name: 'Item 2', category: 'B' },
    { id: 3, name: 'Item 3', category: 'A' }
  ];
  
  return (
    <div>
      {/* Fragment evita div wrapper desnecessário */}
      <Fragment>
        <h2>Lista de Itens</h2>
        <p>Total: {items.length} itens</p>
      </Fragment>
      
      {/* Sintaxe curta para Fragment */}
      <>
        <ul>
          {items.map(item => (
            // Key deve ser única e estável
            <li key={item.id}>
              <span>{item.name}</span>
              <small>({item.category})</small>
            </li>
          ))}
        </ul>
      </>
      
      {/* Keys com índice - usar apenas se não há id único */}
      {/* EVITAR quando possível */}
      {items.map((item, index) => (
        <div key={`item-${index}`}>
          {item.name}
        </div>
      ))}
      
      {/* Exemplo de key complexa quando necessário */}
      {items.map(item => (
        <Fragment key={`${item.category}-${item.id}`}>
          <dt>{item.name}</dt>
          <dd>{item.category}</dd>
        </Fragment>
      ))}
    </div>
  );
}

// Keys dinâmicas para listas que mudam de ordem
function SortableList() {
  const [items, setItems] = useState([
    { id: 'a', name: 'Apple' },
    { id: 'b', name: 'Banana' },
    { id: 'c', name: 'Cherry' }
  ]);
  
  const [sortBy, setSortBy] = useState('name');
  
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [items, sortBy]);
  
  return (
    <div>
      <button onClick={() => setSortBy('name')}>Ordenar por Nome</button>
      <button onClick={() => setSortBy('id')}>Ordenar por ID</button>
      
      <ul>
        {sortedItems.map(item => (
          // Key estável mesmo com reordenação
          <li key={item.id}>
            <input defaultValue={item.name} />
            <button onClick={() => console.log('Editando', item.id)}>
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Refs Avançados e forwardRef
Técnicas avançadas para trabalhar com referências e componentes reutilizáveis.
```jsx
import { forwardRef, useImperativeHandle, useRef } from 'react';

// forwardRef para passar ref através de componentes
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);
  
  // useImperativeHandle customiza o que o ref expõe
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    getValue: () => {
      return inputRef.current?.value || '';
    }
  }));
  
  return (
    <div className="fancy-input">
      <label>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type || 'text'}
        placeholder={props.placeholder}
        {...props}
      />
    </div>
  );
});

// Componente de formulário que usa o FancyInput
function ContactForm() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Usando métodos customizados expostos pelo useImperativeHandle
    const formData = {
      name: nameRef.current?.getValue(),
      email: emailRef.current?.getValue(),
      message: messageRef.current?.getValue()
    };
    
    console.log('Dados do formulário:', formData);
    
    // Limpar campos após envio
    nameRef.current?.clear();
    emailRef.current?.clear();
    messageRef.current?.clear();
  };
  
  const focusFirstField = () => {
    nameRef.current?.focus();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FancyInput
        ref={nameRef}
        label="Nome:"
        placeholder="Digite seu nome"
        required
      />
      
      <FancyInput
        ref={emailRef}
        label="Email:"
        type="email"
        placeholder="Digite seu email"
        required
      />
      
      <FancyInput
        ref={messageRef}
        label="Mensagem:"
        placeholder="Digite sua mensagem"
        required
      />
      
      <div className="form-actions">
        <button type="submit">Enviar</button>
        <button type="button" onClick={focusFirstField}>
          Focar primeiro campo
        </button>
      </div>
    </form>
  );
}

// Ref callback para cenários mais complexos
function MeasuredComponent() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      const { width, height } = node.getBoundingClientRect();
      setDimensions({ width, height });
      
      // Observer para mudanças de tamanho
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      });
      
      resizeObserver.observe(node);
      
      // Cleanup
      return () => resizeObserver.disconnect();
    }
  }, []);
  
  return (
    <div>
      <div
        ref={measuredRef}
        style={{
          padding: '20px',
          border: '1px solid #ccc',
          resize: 'both',
          overflow: 'auto'
        }}
      >
        <p>Redimensione este elemento!</p>
        <p>
          Dimensões: {dimensions.width.toFixed(0)} x {dimensions.height.toFixed(0)}
        </p>
      </div>
    </div>
  );
}
```

### Strict Mode e DevTools
Ferramentas para desenvolvimento e debugging de aplicações React.
```jsx
import { StrictMode } from 'react';

// StrictMode ajuda a identificar problemas
function App() {
  return (
    <StrictMode>
      <div className="app">
        <Header />
        <Main />
        <Footer />
      </div>
    </StrictMode>
  );
}

// Componente com debugging hooks
function DebuggableComponent({ items }) {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Hook personalizado para debugging
  const useWhyDidYouUpdate = (name, props) => {
    const previous = useRef();
    
    useEffect(() => {
      if (previous.current) {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
          if (previous.current[k] !== v) {
            ps[k] = [previous.current[k], v];
          }
          return ps;
        }, {});
        
        if (Object.keys(changedProps).length > 0) {
          console.log('[why-did-you-update]', name, changedProps);
        }
      }
      previous.current = props;
    });
  };
  
  // Usar o hook de debugging
  useWhyDidYouUpdate('DebuggableComponent', { items, filter, sortOrder });
  
  // Hook para medir performance
  const usePerformanceMeasure = (name) => {
    useEffect(() => {
      performance.mark(`${name}-start`);
      return () => {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measures = performance.getEntriesByName(name);
        const lastMeasure = measures[measures.length - 1];
        console.log(`[Performance] ${name}: ${lastMeasure.duration.toFixed(2)}ms`);
        
        performance.clearMarks(`${name}-start`);
        performance.clearMarks(`${name}-end`);
        performance.clearMeasures(name);
      };
    });
  };
  
  usePerformanceMeasure('DebuggableComponent-render');
  
  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        return a.name.localeCompare(b.name) * order;
      });
  }, [items, filter, sortOrder]);
  
  return (
    <div>
      <div className="controls">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrar itens..."
        />
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Ordenar {sortOrder === 'asc' ? '↓' : '↑'}
        </button>
      </div>
      
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      
      {/* Informações de debug em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <p>Total items: {items.length}</p>
          <p>Filtered items: {filteredItems.length}</p>
          <p>Filter: "{filter}"</p>
          <p>Sort order: {sortOrder}</p>
        </div>
      )}
    </div>
  );
}

// Componente com Error Boundary para desenvolvimento
class DevErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log detalhado em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Oops! Algo deu errado.</h2>
          
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Detalhes do erro (desenvolvimento)</summary>
              <pre>{this.state.error?.toString()}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
          
          <button onClick={() => this.setState({ hasError: false })}>
            Tentar novamente
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Padrões de Fetch e Cache
Estratégias avançadas para buscar e cachear dados de APIs.
```jsx
// Hook customizado para fetch com cache
function useApiCache() {
  const cache = useRef(new Map());
  
  const get = useCallback(async (url, options = {}) => {
    const cacheKey = JSON.stringify({ url, ...options });
    
    // Verificar cache primeiro
    if (cache.current.has(cacheKey)) {
      const cached = cache.current.get(cacheKey);
      const now = Date.now();
      
      // Cache válido por 5 minutos
      if (now - cached.timestamp < 5 * 60 * 1000) {
        return cached.data;
      }
    }
    
    // Fazer requisição
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Armazenar no cache
      cache.current.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }, []);
  
  const clear = useCallback(() => {
    cache.current.clear();
  }, []);
  
  return { get, clear };
}

// Hook para SWR (stale-while-revalidate)
function useSWR(key, fetcher, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  
  const { revalidateOnFocus = true, refreshInterval = 0 } = options;
  
  const fetchData = useCallback(async (showValidating = false) => {
    if (showValidating) setIsValidating(true);
    
    try {
      const result = await fetcher(key);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [key, fetcher]);
  
  // Fetch inicial
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Revalidar quando janela ganha foco
  useEffect(() => {
    if (!revalidateOnFocus) return;
    
    const handleFocus = () => {
      if (!isLoading) {
        fetchData(true);
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, isLoading, fetchData]);
  
  // Intervalo de refresh
  useEffect(() => {
    if (!refreshInterval) return;
    
    const interval = setInterval(() => {
      if (!isLoading) {
        fetchData(true);
      }
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval, isLoading, fetchData]);
  
  const mutate = useCallback((newData) => {
    setData(newData);
  }, []);
  
  const revalidate = useCallback(() => {
    fetchData(true);
  }, [fetchData]);
  
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    revalidate
  };
}

// Componente usando os hooks de fetch avançados
function UserList() {
  const apiCache = useApiCache();
  
  const { 
    data: users, 
    error, 
    isLoading, 
    isValidating,
    revalidate 
  } = useSWR(
    '/api/users',
    (url) => apiCache.get(url),
    {
      revalidateOnFocus: true,
      refreshInterval: 30000 // 30 segundos
    }
  );
  
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      
      if (response.ok) {
        const createdUser = await response.json();
        
        // Otimistic update
        const updatedUsers = [...(users || []), createdUser];
        mutate(updatedUsers);
        
        setNewUser({ name: '', email: '' });
        
        // Revalidar dados do servidor
        revalidate();
      }
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
    }
  };
  
  if (isLoading) return <div>Carregando usuários...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return (
    <div>
      <div className="header">
        <h2>Lista de Usuários</h2>
        {isValidating && <span className="validating">Atualizando...</span>}
        <button onClick={revalidate}>Recarregar</button>
      </div>
      
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Nome"
          value={newUser.name}
          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
          required
        />
        <button type="submit">Adicionar Usuário</button>
      </form>
      
      <ul>
        {users?.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🎯 Resumo dos Conceitos React.js

Este arquivo contém os principais conceitos do **React.js** (biblioteca) que todo desenvolvedor frontend deve dominar:

### Hooks Essenciais
- **useState**: Gerenciamento de estado local
- **useEffect**: Efeitos colaterais e ciclo de vida
- **useContext**: Consumo de contexto
- **useMemo**: Otimização de cálculos
- **useCallback**: Otimização de funções
- **useReducer**: Estados complexos
- **useRef**: Referências DOM e valores mutáveis

### Conceitos Fundamentais
- **Context API**: Compartilhamento de estado global
- **Componentização**: Divisão em componentes reutilizáveis
- **Props e State**: Comunicação e gerenciamento de dados
- **Renderização Condicional**: Controle de exibição
- **Tratamento de Eventos**: Interações do usuário

### Performance e Otimização
- **React.memo**: Prevenção de re-renderizações
- **Custom Hooks**: Reutilização de lógica
- **Error Boundaries**: Tratamento de erros
- **Portals**: Renderização fora da hierarquia
- **Padrões de Composição**: Técnicas avançadas de design

### Ciclo de Vida dos Componentes
No React, são fases como montagem, atualização e desmontagem, onde você pode executar lógicas específicas.
```jsx
function MyComponent() {
  useEffect(() => {
    // Montagem: executa quando o componente é criado
    console.log('Componente montado');
    
    return () => {
      // Desmontagem: executa quando o componente é removido
      console.log('Componente desmontado');
    };
  }, []); // Array vazio = executa apenas na montagem
  
  useEffect(() => {
    // Atualização: executa quando count muda
    console.log('Count mudou');
  }, [count]); // Executa quando 'count' muda
}
```

### Hooks Principais: useEffect, useMemo, useCallback
- `useEffect`: executa efeitos colaterais (ex: requisições, timers).
- `useMemo`: memoriza valores computados para evitar cálculos desnecessários.
- `useCallback`: memoriza funções para evitar recriação em cada renderização.
```jsx
function ExpensiveComponent({ items, onItemClick }) {
  // useMemo: memoriza cálculo pesado
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);
  
  // useCallback: memoriza função
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  // useEffect: efeito colateral
  useEffect(() => {
    document.title = `Total: ${expensiveValue}`;
  }, [expensiveValue]);
}
```

### Gerenciamento de Formulários e Validação
Técnicas e bibliotecas para lidar com inputs, validação e envio de formulários.
```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!email.includes('@')) newErrors.email = 'Email inválido';
    if (password.length < 6) newErrors.password = 'Senha muito curta';
    
    if (Object.keys(newErrors).length === 0) {
      // Enviar dados
      console.log('Formulário válido');
    } else {
      setErrors(newErrors);
    }
  };
}
```

### Gerenciamento de Rotas (React Router)
Permite navegação entre páginas e controle de URLs em SPAs.
```jsx
// React Router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Otimização de Performance (Lazy Loading, Memoization)
Técnicas para carregar recursos sob demanda e evitar renderizações desnecessárias.
```jsx
import { lazy, Suspense, memo } from 'react';

// Lazy Loading de componente
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// Memoization de componente
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* renderização pesada */}</div>;
});

// Lazy loading de imagens
<img 
  src="placeholder.jpg" 
  data-src="real-image.jpg" 
  loading="lazy" 
  alt="Descrição"
/>
```

### Testes de Componentes React
Testes específicos para componentes React usando Testing Library.
```javascript
// Teste de componente React com Testing Library
import { render, screen, fireEvent } from '@testing-library/react';

test('botão deve incrementar contador', () => {
  render(<Counter />);
  const button = screen.getByText('Incrementar');
  const counter = screen.getByText('0');
  
  fireEvent.click(button);
  
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

## Next.js

### Zustand
Zustand é uma biblioteca de gerenciamento de estado para React/Next.js. Serve para armazenar e compartilhar estados globais de forma simples e performática, sem boilerplate.
```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Zod
Zod é uma biblioteca de validação e tipagem de dados TypeScript/JavaScript. Serve para validar objetos, strings, arrays, etc., garantindo que os dados estejam no formato esperado.
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
});

const userData = UserSchema.parse({ name: 'João', email: 'joao@email.com', age: 25 });
```

### Sistema de Rotas Baseado em Arquivos
Next.js usa rotas automáticas baseadas na estrutura de pastas.
```jsx
// Next.js (arquivo em pages/user/[id].js)
import { useRouter } from 'next/router';

function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  
  return <div>Usuário ID: {id}</div>;
}
```

### SEO e Meta Tags
Next.js facilita a otimização para motores de busca.
```jsx
// Next.js SEO
import Head from 'next/head';

function HomePage() {
  return (
    <>
      <Head>
        <title>Minha Página - Site Exemplo</title>
        <meta name="description" content="Descrição da página para SEO" />
        <meta property="og:title" content="Minha Página" />
        <meta property="og:description" content="Descrição para redes sociais" />
        <meta property="og:image" content="/og-image.jpg" />
        <link rel="canonical" href="https://meusite.com/pagina" />
      </Head>
      <main>
        <h1>Conteúdo da página</h1>
      </main>
    </>
  );
}

// Estrutura de dados para SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Título do artigo",
  "author": {
    "@type": "Person",
    "name": "Nome do autor"
  }
};
```

### SSG e SSR (Server-Side Rendering)
Next.js oferece diferentes estratégias de renderização.
```jsx
// Static Site Generation (SSG)
export async function getStaticProps() {
  const data = await fetch('https://api.exemplo.com/data');
  return {
    props: { data },
    revalidate: 60 // Revalida a cada 60 segundos
  };
}

// Server-Side Rendering (SSR)
export async function getServerSideProps(context) {
  const { id } = context.params;
  const user = await fetch(`https://api.exemplo.com/users/${id}`);
  return {
    props: { user }
  };
}
```

### API Routes
Next.js permite criar APIs no mesmo projeto.
```javascript
// pages/api/users.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ users: [] });
  } else if (req.method === 'POST') {
    const newUser = req.body;
    // Lógica para salvar usuário
    res.status(201).json({ message: 'Usuário criado' });
  }
}
```




### React.js - Ciclo de Vida dos Componentes
No React, são fases como montagem, atualização e desmontagem, onde você pode executar lógicas específicas.
```jsx
function MyComponent() {
  useEffect(() => {
    // Montagem: executa quando o componente é criado
    console.log('Componente montado');
    
    return () => {
      // Desmontagem: executa quando o componente é removido
      console.log('Componente desmontado');
    };
  }, []); // Array vazio = executa apenas na montagem
  
  useEffect(() => {
    // Atualização: executa quando count muda
    console.log('Count mudou');
  }, [count]); // Executa quando 'count' muda
}
```

### React.js - Hooks Principais: useEffect, useMemo, useCallback
- `useEffect`: executa efeitos colaterais (ex: requisições, timers).
- `useMemo`: memoriza valores computados para evitar cálculos desnecessários.
- `useCallback`: memoriza funções para evitar recriação em cada renderização.
```jsx
function ExpensiveComponent({ items, onItemClick }) {
  // useMemo: memoriza cálculo pesado
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);
  
  // useCallback: memoriza função
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  // useEffect: efeito colateral
  useEffect(() => {
    document.title = `Total: ${expensiveValue}`;
  }, [expensiveValue]);
}
```

### React.js - Gerenciamento de Rotas (React Router)
Permite navegação entre páginas e controle de URLs em SPAs.
```jsx
// React Router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Next.js - Sistema de Rotas Baseado em Arquivos
Next.js usa rotas automáticas baseadas na estrutura de pastas.
```jsx
// Next.js (arquivo em pages/user/[id].js)
import { useRouter } from 'next/router';

function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  
  return <div>Usuário ID: {id}</div>;
}
```

### Next.js - SEO e Meta Tags
Next.js facilita a otimização para motores de busca.
```jsx
// Next.js SEO
import Head from 'next/head';

function HomePage() {
  return (
    <>
      <Head>
        <title>Minha Página - Site Exemplo</title>
        <meta name="description" content="Descrição da página para SEO" />
        <meta property="og:title" content="Minha Página" />
        <meta property="og:description" content="Descrição para redes sociais" />
        <meta property="og:image" content="/og-image.jpg" />
        <link rel="canonical" href="https://meusite.com/pagina" />
      </Head>
      <main>
        <h1>Conteúdo da página</h1>
      </main>
    </>
  );
}
```

### CSS/Frontend - Responsividade e Media Queries
Permite adaptar o layout para diferentes tamanhos de tela usando CSS.
```css
.container {
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
    font-size: 14px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### CSS/Frontend - Flexbox e Grid Layout
Sistemas de layout CSS modernos para criar interfaces flexíveis e responsivas.
```css
/* Flexbox */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* Grid */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap: 20px;
}
```

### React.js - Gerenciamento de Formulários e Validação
Técnicas e bibliotecas para lidar com inputs, validação e envio de formulários.
```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!email.includes('@')) newErrors.email = 'Email inválido';
    if (password.length < 6) newErrors.password = 'Senha muito curta';
    
    if (Object.keys(newErrors).length === 0) {
      // Enviar dados
      console.log('Formulário válido');
    } else {
      setErrors(newErrors);
    }
  };
}
```

### JavaScript/HTTP - Consumo de APIs REST e GraphQL

### Flexbox e Grid Layout
Sistemas de layout CSS modernos para criar interfaces flexíveis e responsivas.
```css
/* Flexbox */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* Grid */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap: 20px;
}
```

### Gerenciamento de Formulários e Validação
Técnicas e bibliotecas para lidar com inputs, validação e envio de formulários.
```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!email.includes('@')) newErrors.email = 'Email inválido';
    if (password.length < 6) newErrors.password = 'Senha muito curta';
    
    if (Object.keys(newErrors).length === 0) {
      // Enviar dados
      console.log('Formulário válido');
    } else {
      setErrors(newErrors);
    }
  };
}
```

### Consumo de APIs REST e GraphQL
Como buscar e manipular dados de servidores usando diferentes padrões de API.
```javascript
// REST API
const getUsers = async () => {
  const response = await fetch('/api/users');
  return response.json();
};

const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// GraphQL
const query = `
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

const response = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
});
```

### Autenticação e Autorização (JWT, OAuth)
Processos para identificar usuários e controlar acesso a recursos protegidos.
```javascript
// JWT
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Incluir token nas requisições
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Verificar se usuário está logado
const isAuthenticated = !!localStorage.getItem('token');
```

### Gerenciamento de Rotas (React Router, Next.js Routing)
Permite navegação entre páginas e controle de URLs em SPAs e apps Next.js.
```jsx
// React Router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

// Next.js (arquivo em pages/user/[id].js)
import { useRouter } from 'next/router';

function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  
  return <div>Usuário ID: {id}</div>;
}
```

### Otimização de Performance (Lazy Loading, Memoization)
Técnicas para carregar recursos sob demanda e evitar renderizações desnecessárias.
```jsx
import { lazy, Suspense, memo } from 'react';

// Lazy Loading de componente
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// Memoization de componente
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* renderização pesada */}</div>;
});

// Lazy loading de imagens
<img 
  src="placeholder.jpg" 
  data-src="real-image.jpg" 
  loading="lazy" 
  alt="Descrição"
/>
```

### Frontend/Accessibility - Acessibilidade (a11y)
Práticas para tornar aplicações utilizáveis por pessoas com deficiência.
```jsx
function AccessibleForm() {
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input 
        id="email"
        type="email"
        aria-describedby="email-help"
        aria-required="true"
      />
      <div id="email-help">Digite seu endereço de email</div>
      
      <button 
        type="submit"
        aria-label="Enviar formulário"
      >
        Enviar
      </button>
    </form>
  );
}

// Navegação por teclado
<div 
  role="button" 
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  onClick={handleClick}
>
  Botão customizado
</div>
```

### Testing - Testes (Unitários, Integração, End-to-End)
Garantem que o código funciona como esperado, desde funções isoladas até fluxos completos.
```javascript
// Teste unitário com Jest
function soma(a, b) {
  return a + b;
}

test('deve somar dois números', () => {
  expect(soma(2, 3)).toBe(5);
});

// Teste de componente React com Testing Library
import { render, screen, fireEvent } from '@testing-library/react';

test('botão deve incrementar contador', () => {
  render(<Counter />);
  const button = screen.getByText('Incrementar');
  const counter = screen.getByText('0');
  
  fireEvent.click(button);
  
  expect(screen.getByText('1')).toBeInTheDocument();
});

// Teste E2E com Cypress
cy.visit('/login');
cy.get('[data-testid="email"]').type('user@email.com');
cy.get('[data-testid="password"]').type('senha123');
cy.get('button[type="submit"]').click();
cy.url().should('include', '/dashboard');
```

### Git - Versionamento com Git
Ferramenta para controlar versões do código, colaborar e reverter mudanças.
```bash
# Comandos básicos
git init                    # Inicializar repositório
git add .                   # Adicionar arquivos
git commit -m "mensagem"    # Confirmar mudanças
git push origin main        # Enviar para repositório remoto

# Branching
git checkout -b feature/nova-funcionalidade
git merge feature/nova-funcionalidade
git branch -d feature/nova-funcionalidade

# Histórico e desfazer
git log                     # Ver histórico
git revert HEAD             # Desfazer último commit
git reset --hard HEAD~1     # Voltar ao commit anterior
```

### DevOps - Deploy e CI/CD Básico
Processos para publicar aplicações e automatizar testes/builds em servidores.
```yaml
# GitHub Actions (.github/workflows/deploy.yml)
name: Deploy
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```
