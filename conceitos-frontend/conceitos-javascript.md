# Resumo de Conceitos JavaScript

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais de **JavaScript puro** que todo desenvolvedor frontend deve dominar:

### 🔄 Loops e Condicionais
- `for`, `for...in`, `for...of`
- `while`, `do...while`
- `if/else`, `switch`

### 📋 Métodos de Array Essenciais
- `map`, `find`, `filter`, `reduce`
- `forEach`, `some`, `every`
- `includes`, `indexOf`, `findIndex`
- `push`, `pop`, `shift`, `unshift`
- `slice`, `splice`

### 📝 Métodos de String
- `trim`, `toLowerCase`, `toUpperCase`
- `replace`, `split`, `substring`, `slice`
- `includes`, `startsWith`, `endsWith`

### 🏗️ Objetos e Destructuring
- `Object.keys`, `Object.values`, `Object.entries`
- Destructuring de objetos e arrays
- Spread operator e Rest parameters

### ⚡ Funções Avançadas
- Arrow functions
- Parâmetros padrão
- Rest/Spread operators

### 🔄 Promises e Async
- Criação e consumo de Promises
- `Promise.all`
- Tratamento com `async/await`

### 🌐 Manipulação do DOM
- Seletores (`querySelector`, `getElementById`)
- Criação e modificação de elementos
- Event listeners

### ⚠️ Tratamento de Erros
- `try/catch/finally`
- Tratamento com async/await

### ⏰ Timers
- `setTimeout`, `setInterval`
- `clearTimeout`, `clearInterval`

### 💾 Storage
- `localStorage` e `sessionStorage`

### 🔍 Regular Expressions
- Criação e uso de RegEx básico

### 🌐 APIs e HTTP
- `fetch` nativo
- Consumo de APIs REST e GraphQL
- Autenticação básica

> **Nota**: Para conceitos de CSS, Git, Testing e DevOps, consulte os arquivos `resumo-css.md` e `resumo-devops.md`

---

## JavaScript (Vanilla/Universal)

### Loops e Condicionais

#### for loop
Loop tradicional para iterar sobre arrays ou executar código um número específico de vezes.
```javascript
// Iterando sobre array
const frutas = ['maçã', 'banana', 'laranja'];
for (let i = 0; i < frutas.length; i++) {
  console.log(frutas[i]);
}

// Loop de contagem
for (let i = 0; i < 5; i++) {
  console.log(`Contagem: ${i}`);
}
```

#### for...in e for...of
Loops para iterar sobre objetos e arrays de forma mais limpa.
```javascript
const pessoa = { nome: 'João', idade: 30, cidade: 'SP' };

// for...in - para objetos (chaves)
for (const chave in pessoa) {
  console.log(`${chave}: ${pessoa[chave]}`);
}

// for...of - para arrays (valores)
const cores = ['azul', 'verde', 'vermelho'];
for (const cor of cores) {
  console.log(cor);
}
```

#### while e do...while
Loops condicionais que executam enquanto uma condição for verdadeira.
```javascript
// while
let contador = 0;
while (contador < 3) {
  console.log(`Contador: ${contador}`);
  contador++;
}

// do...while (executa pelo menos uma vez)
let numero = 0;
do {
  console.log(`Número: ${numero}`);
  numero++;
} while (numero < 2);
```

#### if/else e switch
Estruturas condicionais para controle de fluxo.
```javascript
// if/else
const idade = 18;
if (idade >= 18) {
  console.log('Maior de idade');
} else if (idade >= 16) {
  console.log('Pode votar');
} else {
  console.log('Menor de idade');
}

// switch
const dia = 'segunda';
switch (dia) {
  case 'segunda':
    console.log('Início da semana');
    break;
  case 'sexta':
    console.log('Fim da semana');
    break;
  default:
    console.log('Meio da semana');
}
```

### Métodos de Array Essenciais

### map
O método `map` é usado para criar um novo array a partir de um array existente, aplicando uma função a cada elemento do array original.
```javascript
const numeros = [1, 2, 3, 4];
const dobrados = numeros.map(num => num * 2); // [2, 4, 6, 8]
```

### find
O método `find` retorna o primeiro elemento de um array que satisfaz uma determinada condição. Se nenhum elemento for encontrado, retorna `undefined`.
```javascript
const usuarios = [{id: 1, nome: 'João'}, {id: 2, nome: 'Maria'}];
const usuario = usuarios.find(user => user.id === 2); // {id: 2, nome: 'Maria'}
```

### filter
O método `filter` cria um novo array contendo apenas os elementos que passam em um teste especificado por uma função.
```javascript
const numeros = [1, 2, 3, 4, 5, 6];
const pares = numeros.filter(num => num % 2 === 0); // [2, 4, 6]
```

### reduce
O método `reduce` executa uma função acumuladora em cada elemento do array, resultando em um único valor de saída (por exemplo, somar todos os valores de um array).
```javascript
const numeros = [1, 2, 3, 4];
const soma = numeros.reduce((acc, num) => acc + num, 0); // 10
```

#### forEach
Executa uma função para cada elemento do array (sem retornar novo array).
```javascript
const frutas = ['maçã', 'banana', 'laranja'];
frutas.forEach((fruta, index) => {
  console.log(`${index}: ${fruta}`);
});
```

#### some e every
Testam elementos do array contra uma condição.
```javascript
const numeros = [1, 2, 3, 4, 5];

// some: pelo menos um elemento satisfaz a condição
const temPar = numeros.some(num => num % 2 === 0); // true

// every: todos os elementos satisfazem a condição
const todosMaioresQueZero = numeros.every(num => num > 0); // true
```

#### includes, indexOf e findIndex
Métodos para encontrar elementos em arrays.
```javascript
const frutas = ['maçã', 'banana', 'laranja'];

// includes: verifica se elemento existe
const temBanana = frutas.includes('banana'); // true

// indexOf: retorna índice do elemento (-1 se não encontrar)
const indiceBanana = frutas.indexOf('banana'); // 1

// findIndex: retorna índice baseado em condição
const usuarios = [{nome: 'João'}, {nome: 'Maria'}];
const indiceMaria = usuarios.findIndex(user => user.nome === 'Maria'); // 1
```

#### push, pop, shift, unshift
Métodos para adicionar/remover elementos em arrays.
```javascript
const frutas = ['maçã'];

// push: adiciona no final
frutas.push('banana'); // ['maçã', 'banana']

// pop: remove do final
const ultimaFruta = frutas.pop(); // 'banana', array fica ['maçã']

// unshift: adiciona no início
frutas.unshift('laranja'); // ['laranja', 'maçã']

// shift: remove do início
const primeiraFruta = frutas.shift(); // 'laranja', array fica ['maçã']
```

#### slice e splice
Métodos para extrair/modificar partes de arrays.
```javascript
const numeros = [1, 2, 3, 4, 5];

// slice: extrai uma seção (não modifica o original)
const pedaco = numeros.slice(1, 3); // [2, 3]

// splice: remove/adiciona elementos (modifica o original)
const removidos = numeros.splice(1, 2, 'a', 'b'); // remove 2 elementos do índice 1, adiciona 'a' e 'b'
// numeros agora é [1, 'a', 'b', 4, 5]
```

### Métodos de String Essenciais

#### Manipulação de String
```javascript
const texto = '  JavaScript é incrível!  ';

// trim: remove espaços em branco
const limpo = texto.trim(); // 'JavaScript é incrível!'

// toLowerCase/toUpperCase: conversão de caso
const minusculo = texto.toLowerCase(); // '  javascript é incrível!  '
const maiusculo = texto.toUpperCase(); // '  JAVASCRIPT É INCRÍVEL!  '

// replace: substitui texto
const novo = texto.replace('incrível', 'fantástico'); // '  JavaScript é fantástico!  '

// split: divide string em array
const palavras = 'maçã,banana,laranja'.split(','); // ['maçã', 'banana', 'laranja']

// substring/slice: extrai parte da string
const parte = 'JavaScript'.substring(0, 4); // 'Java'
const fatia = 'JavaScript'.slice(-6); // 'Script'
```

#### Verificação de String
```javascript
const email = 'usuario@email.com';

// includes: verifica se contém substring
const temArroba = email.includes('@'); // true

// startsWith/endsWith: verifica início/fim
const comecaComU = email.startsWith('usuario'); // true
const terminaComCom = email.endsWith('.com'); // true

// indexOf: encontra posição de substring
const posicaoArroba = email.indexOf('@'); // 7

// length: tamanho da string
const tamanho = email.length; // 16
```

### Objetos e Destructuring

#### Manipulação de Objetos
```javascript
const pessoa = { nome: 'João', idade: 30 };

// Object.keys: obtém chaves
const chaves = Object.keys(pessoa); // ['nome', 'idade']

// Object.values: obtém valores
const valores = Object.values(pessoa); // ['João', 30]

// Object.entries: obtém pares chave-valor
const entradas = Object.entries(pessoa); // [['nome', 'João'], ['idade', 30]]

// Object.assign: combina objetos
const endereco = { cidade: 'SP', cep: '01234-567' };
const completo = Object.assign({}, pessoa, endereco);
```

#### Destructuring
```javascript
// Destructuring de objetos
const usuario = { nome: 'Maria', idade: 25, email: 'maria@email.com' };
const { nome, idade } = usuario;
const { email: emailUsuario } = usuario; // renomeando

// Destructuring de arrays
const cores = ['azul', 'verde', 'vermelho'];
const [primeira, segunda] = cores;
const [, , terceira] = cores; // pula elementos

// Destructuring com valores padrão
const { cidade = 'Não informado' } = usuario;
```

### Funções e Arrow Functions

#### Declaração de Funções
```javascript
// Função tradicional
function somar(a, b) {
  return a + b;
}

// Function expression
const multiplicar = function(a, b) {
  return a * b;
};

// Arrow function
const dividir = (a, b) => a / b;

// Arrow function com múltiplas linhas
const calcular = (a, b, operacao) => {
  if (operacao === 'soma') return a + b;
  if (operacao === 'subtracao') return a - b;
  return 0;
};
```

#### Parâmetros e Rest/Spread
```javascript
// Parâmetros padrão
const cumprimentar = (nome = 'Visitante') => `Olá, ${nome}!`;

// Rest parameters
const somar = (...numeros) => numeros.reduce((acc, num) => acc + num, 0);

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
```

### Promises e Async/Await

### Promises e Async/Await

#### Promises
```javascript
// Criando uma Promise
const minhaPromise = new Promise((resolve, reject) => {
  const sucesso = true;
  if (sucesso) {
    resolve('Operação bem-sucedida!');
  } else {
    reject('Algo deu errado!');
  }
});

// Consumindo Promise
minhaPromise
  .then(resultado => console.log(resultado))
  .catch(erro => console.error(erro))
  .finally(() => console.log('Finalizado'));

// Promise.all - aguarda todas as promises
const promises = [fetch('/api/1'), fetch('/api/2'), fetch('/api/3')];
Promise.all(promises)
  .then(resultados => console.log('Todas completaram'))
  .catch(erro => console.log('Uma falhou'));
```

### fetch
`fetch` é uma API nativa do JavaScript para fazer requisições HTTP (GET, POST, etc.) para servidores e APIs.
```javascript
// GET
const response = await fetch('https://api.exemplo.com/users');
const users = await response.json();

// POST
const response = await fetch('https://api.exemplo.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'João' })
});
```

### axios
Axios é uma biblioteca externa para fazer requisições HTTP, semelhante ao fetch, mas com recursos adicionais como interceptadores, cancelamento de requisições e suporte melhor a JSON.
```javascript
import axios from 'axios';

// GET
const users = await axios.get('https://api.exemplo.com/users');

// POST
const newUser = await axios.post('https://api.exemplo.com/users', {
  name: 'João',
  email: 'joao@email.com'
});
```

### async
`async` é uma palavra-chave usada para declarar funções assíncronas em JavaScript, permitindo o uso de `await` para lidar com operações assíncronas de forma mais simples e legível.
```javascript
async function buscarDados() {
  try {
    const response = await fetch('https://api.exemplo.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

### Manipulação do DOM

#### Seletores
```javascript
// Seleção de elementos
const elemento = document.getElementById('meuId');
const elementos = document.getElementsByClassName('minhaClasse');
const primeiro = document.querySelector('.minha-classe');
const todos = document.querySelectorAll('.minha-classe');

// Seleção por atributo
const comDataId = document.querySelector('[data-id="123"]');
```

#### Manipulação de Elementos
```javascript
// Criação e modificação
const div = document.createElement('div');
div.textContent = 'Olá mundo!';
div.innerHTML = '<strong>Texto em negrito</strong>';
div.className = 'minha-classe';
div.setAttribute('data-id', '123');

// Adição ao DOM
document.body.appendChild(div);
const container = document.querySelector('#container');
container.insertBefore(div, container.firstChild);

// Remoção
div.remove();
// ou
container.removeChild(div);
```

#### Event Listeners
```javascript
// Adicionar event listener
const botao = document.querySelector('#meuBotao');
botao.addEventListener('click', function(event) {
  console.log('Botão clicado!');
  event.preventDefault(); // previne comportamento padrão
});

// Arrow function e diferentes eventos
const input = document.querySelector('#meuInput');
input.addEventListener('input', (e) => {
  console.log('Valor atual:', e.target.value);
});

// Remover event listener
const handler = () => console.log('Handler');
botao.addEventListener('click', handler);
botao.removeEventListener('click', handler);
```

### Tratamento de Erros

#### try/catch/finally
```javascript
// Tratamento básico
try {
  const resultado = operacaoPerigosa();
  console.log(resultado);
} catch (error) {
  console.error('Erro capturado:', error.message);
} finally {
  console.log('Sempre executa');
}

// Com async/await
async function exemploAsync() {
  try {
    const data = await fetch('/api/data');
    const json = await data.json();
    return json;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error; // re-lança o erro
  }
}
```

### Timers e Delays

#### setTimeout e setInterval
```javascript
// setTimeout: executa uma vez após delay
const timeoutId = setTimeout(() => {
  console.log('Executou após 2 segundos');
}, 2000);

// clearTimeout: cancela o timeout
clearTimeout(timeoutId);

// setInterval: executa repetidamente
const intervalId = setInterval(() => {
  console.log('Executa a cada 1 segundo');
}, 1000);

// clearInterval: para o interval
setTimeout(() => {
  clearInterval(intervalId);
}, 5000); // para após 5 segundos
```

### Local Storage e Session Storage

#### Armazenamento no Browser
```javascript
// localStorage (persiste após fechar o browser)
localStorage.setItem('usuario', JSON.stringify({nome: 'João', id: 1}));
const usuario = JSON.parse(localStorage.getItem('usuario'));
localStorage.removeItem('usuario');
localStorage.clear(); // limpa tudo

// sessionStorage (persiste apenas na sessão)
sessionStorage.setItem('token', 'abc123');
const token = sessionStorage.getItem('token');

// Verificar se existe
if (localStorage.getItem('configuracoes')) {
  // configurações existem
}
```

### Regular Expressions (RegEx)

#### Padrões Básicos
```javascript
// Criação de regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefoneRegex = new RegExp('^\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}$');

// Métodos de teste
const email = 'usuario@email.com';
const isValid = emailRegex.test(email); // true

// Busca e substituição
const texto = 'Meu telefone é (11) 99999-9999';
const numeros = texto.match(/\d+/g); // ['11', '99999', '9999']
const semNumeros = texto.replace(/\d/g, 'X'); // 'Meu telefone é (XX) XXXXX-XXXX'
```

## JavaScript/HTTP - Consumo de APIs REST e GraphQL
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

## Frontend/Security - Autenticação e Autorização (JWT, OAuth)
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
