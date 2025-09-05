# Conceitos Python

## 📚 Sobre este arquivo
Este arquivo contém conceitos fundamentais do **Python** - linguagem de programação versátil e poderosa, amplamente usada em desenvolvimento web, ciência de dados, automação e muito mais:

### 🐍 Fundamentos Python
- `Sintaxe` - Estrutura básica e convenções da linguagem
- `Tipos de Dados` - int, float, string, list, dict, set, tuple
- `Estruturas de Controle` - if/else, loops, comprehensions
- `Funções` - Definição, parâmetros, decorators, lambda

### 📦 Programação Orientada a Objetos
- `Classes e Objetos` - Definição e instanciação
- `Herança` - Extensão de classes e polimorfismo
- `Métodos Especiais` - __init__, __str__, __repr__, etc.
- `Propriedades` - getters, setters e property decorator

### 🔧 Funcionalidades Avançadas
- `Generators e Iterators` - Criação de sequências eficientes
- `Context Managers` - Gerenciamento de recursos com with
- `Decorators` - Modificação de funções e classes
- `Error Handling` - try/except, custom exceptions

### 📚 Bibliotecas Essenciais
- `requests` - HTTP requests
- `json` - Manipulação de JSON
- `datetime` - Manipulação de datas
- `pathlib` - Manipulação de caminhos de arquivo

### 🔄 Async Programming
- `asyncio` - Programação assíncrona
- `async/await` - Funções assíncronas
- `aiohttp` - HTTP assíncrono
- `Concurrent programming` - threading, multiprocessing

> **Nota**: Para conceitos específicos de Django, consulte o arquivo `conceitos-django.md`

---

## Python

### Sintaxe Básica e Tipos de Dados

#### Variáveis e Tipos Básicos
```python
# Tipos básicos
nome = "João"           # string
idade = 30              # int
altura = 1.75           # float
ativo = True            # bool
dados = None            # None

# Verificar tipo
print(type(nome))       # <class 'str'>
isinstance(idade, int)  # True

# Type hints (Python 3.5+)
def cumprimentar(nome: str, idade: int) -> str:
    return f"Olá {nome}, você tem {idade} anos"

# Múltiplas atribuições
x, y, z = 1, 2, 3
a = b = c = 0

# Constantes (convenção)
PI = 3.14159
MAX_CONEXOES = 100
```

#### Strings
```python
# Criação e manipulação
texto = "Python é incrível"
multilinhas = """
Texto com
múltiplas linhas
"""

# Formatação
nome = "Maria"
idade = 25

# f-strings (Python 3.6+)
mensagem = f"Olá {nome}, você tem {idade} anos"

# format method
mensagem = "Olá {}, você tem {} anos".format(nome, idade)
mensagem = "Olá {nome}, você tem {idade} anos".format(nome=nome, idade=idade)

# Métodos úteis
texto.upper()           # PYTHON É INCRÍVEL
texto.lower()           # python é incrível
texto.strip()           # remove espaços
texto.replace("é", "é realmente")
texto.split(" ")        # ['Python', 'é', 'incrível']
"".join(['a', 'b', 'c']) # 'abc'

# Verificações
texto.startswith("Python")  # True
texto.endswith("incrível")   # True
"123".isdigit()             # True
"abc".isalpha()             # True
```

#### Listas
```python
# Criação
numeros = [1, 2, 3, 4, 5]
mista = [1, "texto", 3.14, True]
vazia = []

# Operações básicas
numeros.append(6)           # [1, 2, 3, 4, 5, 6]
numeros.insert(0, 0)        # [0, 1, 2, 3, 4, 5, 6]
numeros.remove(3)           # Remove primeiro 3
item = numeros.pop()        # Remove último e retorna
item = numeros.pop(0)       # Remove índice 0

# Slicing
numeros[1:4]     # [2, 3, 4]
numeros[:3]      # [1, 2, 3]
numeros[2:]      # [3, 4, 5]
numeros[-1]      # último elemento
numeros[::-1]    # reverte lista

# List comprehensions
quadrados = [x**2 for x in range(10)]
pares = [x for x in range(20) if x % 2 == 0]
palavras_maiusculas = [palavra.upper() for palavra in ["python", "django"]]

# Nested comprehensions
matriz = [[j for j in range(3)] for i in range(3)]
# [[0, 1, 2], [0, 1, 2], [0, 1, 2]]

# Métodos úteis
len(numeros)        # tamanho
max(numeros)        # maior valor
min(numeros)        # menor valor
sum(numeros)        # soma
sorted(numeros)     # lista ordenada (nova)
numeros.sort()      # ordena in-place
numeros.reverse()   # reverte in-place
```

#### Dicionários
```python
# Criação
pessoa = {
    "nome": "João",
    "idade": 30,
    "cidade": "São Paulo"
}

# Dict comprehension
quadrados = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Acesso e modificação
nome = pessoa["nome"]
nome = pessoa.get("nome", "Desconhecido")  # com default
pessoa["profissao"] = "Desenvolvedor"
pessoa.update({"email": "joao@email.com", "telefone": "123456"})

# Métodos úteis
pessoa.keys()       # dict_keys(['nome', 'idade', 'cidade'])
pessoa.values()     # dict_values(['João', 30, 'São Paulo'])
pessoa.items()      # dict_items([('nome', 'João'), ...])

# Iteração
for chave in pessoa:
    print(chave, pessoa[chave])

for chave, valor in pessoa.items():
    print(f"{chave}: {valor}")

# Verificação
"nome" in pessoa     # True
"email" in pessoa    # False

# Dicionários aninhados
empresa = {
    "funcionarios": [
        {"nome": "Ana", "cargo": "Dev"},
        {"nome": "Bruno", "cargo": "Design"}
    ],
    "endereco": {
        "rua": "Rua A",
        "numero": 123
    }
}
```

### Estruturas de Controle

#### Condicionais
```python
# if/elif/else
idade = 18

if idade < 18:
    print("Menor de idade")
elif idade == 18:
    print("Acabou de fazer 18")
else:
    print("Maior de idade")

# Operadores lógicos
if idade >= 18 and idade <= 65:
    print("Apto para trabalhar")

if not usuario_logado:
    print("Faça login")

# Ternário
status = "adulto" if idade >= 18 else "menor"

# Walrus operator (Python 3.8+)
if (n := len(lista)) > 10:
    print(f"Lista muito grande: {n} elementos")
```

#### Loops
```python
# for loop
for i in range(5):          # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):       # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2):   # 0, 2, 4, 6, 8
    print(i)

# Iterando listas
frutas = ["maçã", "banana", "laranja"]
for fruta in frutas:
    print(fruta)

# enumerate para índice e valor
for i, fruta in enumerate(frutas):
    print(f"{i}: {fruta}")

# zip para múltiplas listas
nomes = ["Ana", "Bruno", "Carlos"]
idades = [25, 30, 35]
for nome, idade in zip(nomes, idades):
    print(f"{nome} tem {idade} anos")

# while loop
contador = 0
while contador < 5:
    print(contador)
    contador += 1

# break e continue
for i in range(10):
    if i == 3:
        continue  # pula para próxima iteração
    if i == 7:
        break     # sai do loop
    print(i)

# else em loops (executa se não houve break)
for i in range(5):
    if i == 10:
        break
else:
    print("Loop completado sem break")
```

### Funções

#### Definição Básica
```python
# Função simples
def saudacao():
    print("Olá!")

# Função com parâmetros
def cumprimentar(nome, sobrenome=""):
    if sobrenome:
        return f"Olá {nome} {sobrenome}!"
    return f"Olá {nome}!"

# Função com múltiplos retornos
def dividir(a, b):
    if b == 0:
        return None, "Erro: divisão por zero"
    return a / b, "Sucesso"

resultado, status = dividir(10, 2)

# Função com type hints
def calcular_area(largura: float, altura: float) -> float:
    """Calcula a área de um retângulo."""
    return largura * altura
```

#### Parâmetros Avançados
```python
# *args - argumentos posicionais variáveis
def somar(*numeros):
    return sum(numeros)

print(somar(1, 2, 3, 4, 5))  # 15

# **kwargs - argumentos nomeados variáveis
def criar_usuario(**dados):
    usuario = {
        "nome": dados.get("nome", "Anônimo"),
        "email": dados.get("email", ""),
        "ativo": dados.get("ativo", True)
    }
    return usuario

user = criar_usuario(nome="João", email="joao@email.com", idade=30)

# Combinando todos os tipos
def funcao_completa(obrigatorio, padrao="valor", *args, **kwargs):
    print(f"Obrigatório: {obrigatorio}")
    print(f"Padrão: {padrao}")
    print(f"Args: {args}")
    print(f"Kwargs: {kwargs}")

funcao_completa("teste", "custom", 1, 2, 3, extra="info")

# Keyword-only arguments (Python 3+)
def configurar(host, port, *, ssl=False, timeout=30):
    # ssl e timeout devem ser passados como keywords
    pass

configurar("localhost", 8000, ssl=True, timeout=60)
```

#### Lambda Functions
```python
# Função lambda simples
quadrado = lambda x: x ** 2
print(quadrado(5))  # 25

# Lambda com múltiplos parâmetros
somar = lambda x, y: x + y
print(somar(3, 4))  # 7

# Uso com funções built-in
numeros = [1, 2, 3, 4, 5]
quadrados = list(map(lambda x: x**2, numeros))
pares = list(filter(lambda x: x % 2 == 0, numeros))

# Ordenação com lambda
pessoas = [
    {"nome": "Ana", "idade": 25},
    {"nome": "Bruno", "idade": 30},
    {"nome": "Carlos", "idade": 20}
]
pessoas_ordenadas = sorted(pessoas, key=lambda p: p["idade"])
```

### Programação Orientada a Objetos

#### Classes Básicas
```python
class Pessoa:
    # Atributo de classe
    especie = "Homo sapiens"
    
    def __init__(self, nome, idade):
        # Atributos de instância
        self.nome = nome
        self.idade = idade
        self._email = None  # atributo "privado" (convenção)
        self.__cpf = None   # name mangling
    
    def apresentar(self):
        return f"Olá, eu sou {self.nome} e tenho {self.idade} anos"
    
    def fazer_aniversario(self):
        self.idade += 1
        print(f"{self.nome} agora tem {self.idade} anos")
    
    # Método de classe
    @classmethod
    def criar_bebe(cls, nome):
        return cls(nome, 0)
    
    # Método estático
    @staticmethod
    def validar_idade(idade):
        return 0 <= idade <= 150

# Uso da classe
pessoa1 = Pessoa("João", 30)
print(pessoa1.apresentar())
pessoa1.fazer_aniversario()

# Método de classe
bebe = Pessoa.criar_bebe("Ana")

# Método estático
print(Pessoa.validar_idade(25))  # True
```

#### Métodos Especiais (Dunder Methods)
```python
class ContaBancaria:
    def __init__(self, titular, saldo=0):
        self.titular = titular
        self.saldo = saldo
    
    def __str__(self):
        # Representação para usuários
        return f"Conta de {self.titular}: R$ {self.saldo:.2f}"
    
    def __repr__(self):
        # Representação para desenvolvedores
        return f"ContaBancaria('{self.titular}', {self.saldo})"
    
    def __eq__(self, other):
        # Comparação de igualdade
        if isinstance(other, ContaBancaria):
            return self.titular == other.titular
        return False
    
    def __lt__(self, other):
        # Comparação menor que
        return self.saldo < other.saldo
    
    def __add__(self, valor):
        # Operador +
        if isinstance(valor, (int, float)):
            return ContaBancaria(self.titular, self.saldo + valor)
        return NotImplemented
    
    def __len__(self):
        # len() da conta (exemplo: número de transações)
        return len(str(self.saldo))

conta = ContaBancaria("João", 1000)
print(conta)  # Usa __str__
print(repr(conta))  # Usa __repr__

nova_conta = conta + 500  # Usa __add__
print(len(conta))  # Usa __len__
```

#### Herança
```python
class Animal:
    def __init__(self, nome, especie):
        self.nome = nome
        self.especie = especie
    
    def som(self):
        return "Algum som"
    
    def mover(self):
        return f"{self.nome} está se movendo"

class Cachorro(Animal):
    def __init__(self, nome, raca):
        super().__init__(nome, "Canis lupus")
        self.raca = raca
    
    def som(self):  # Override
        return "Au au!"
    
    def buscar(self):  # Método específico
        return f"{self.nome} está buscando a bolinha"

class Gato(Animal):
    def som(self):
        return "Miau"
    
    def arranhar(self):
        return f"{self.nome} está arranhando"

# Uso
dog = Cachorro("Rex", "Labrador")
cat = Gato("Mimi", "Felis catus")

print(dog.som())       # Au au!
print(cat.som())       # Miau
print(dog.buscar())    # Rex está buscando a bolinha

# Polimorfismo
animais = [dog, cat]
for animal in animais:
    print(f"{animal.nome}: {animal.som()}")
```

#### Properties
```python
class Temperatura:
    def __init__(self):
        self._celsius = 0
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, valor):
        if valor < -273.15:
            raise ValueError("Temperatura não pode ser menor que zero absoluto")
        self._celsius = valor
    
    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32
    
    @fahrenheit.setter
    def fahrenheit(self, valor):
        self.celsius = (valor - 32) * 5/9
    
    @property
    def kelvin(self):
        return self._celsius + 273.15

# Uso
temp = Temperatura()
temp.celsius = 25
print(f"Celsius: {temp.celsius}")
print(f"Fahrenheit: {temp.fahrenheit}")
print(f"Kelvin: {temp.kelvin}")

temp.fahrenheit = 100
print(f"Celsius: {temp.celsius}")
```

### Decorators

#### Decorators Básicos
```python
# Decorator simples
def meu_decorator(func):
    def wrapper():
        print("Antes da função")
        func()
        print("Depois da função")
    return wrapper

@meu_decorator
def dizer_ola():
    print("Olá!")

dizer_ola()
# Output:
# Antes da função
# Olá!
# Depois da função

# Decorator com argumentos
def cronometrar(func):
    import time
    def wrapper(*args, **kwargs):
        inicio = time.time()
        resultado = func(*args, **kwargs)
        fim = time.time()
        print(f"{func.__name__} executou em {fim - inicio:.4f} segundos")
        return resultado
    return wrapper

@cronometrar
def calcular_fibonacci(n):
    if n <= 1:
        return n
    return calcular_fibonacci(n-1) + calcular_fibonacci(n-2)

print(calcular_fibonacci(10))
```

#### Decorators Avançados
```python
from functools import wraps

# Decorator que preserva metadados
def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Chamando {func.__name__} com args={args}, kwargs={kwargs}")
        return func(*args, **kwargs)
    return wrapper

# Decorator parametrizado
def repetir(vezes):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(vezes):
                resultado = func(*args, **kwargs)
            return resultado
        return wrapper
    return decorator

@repetir(3)
def cumprimentar(nome):
    print(f"Olá {nome}!")

cumprimentar("Maria")  # Imprime 3 vezes

# Decorator de classe
class ContadorChamadas:
    def __init__(self, func):
        self.func = func
        self.count = 0
    
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"{self.func.__name__} foi chamada {self.count} vez(es)")
        return self.func(*args, **kwargs)

@ContadorChamadas
def somar(a, b):
    return a + b

print(somar(2, 3))  # somar foi chamada 1 vez(es)
print(somar(4, 5))  # somar foi chamada 2 vez(es)
```

### Error Handling

#### Try/Except Básico
```python
# Tratamento básico
try:
    numero = int(input("Digite um número: "))
    resultado = 10 / numero
    print(f"Resultado: {resultado}")
except ValueError:
    print("Erro: Digite um número válido")
except ZeroDivisionError:
    print("Erro: Não é possível dividir por zero")
except Exception as e:
    print(f"Erro inesperado: {e}")
else:
    print("Operação realizada com sucesso")
finally:
    print("Bloco finally sempre executa")

# Múltiplas exceções
try:
    # código que pode gerar erro
    pass
except (ValueError, TypeError) as e:
    print(f"Erro de tipo ou valor: {e}")
```

#### Exceções Customizadas
```python
class IdadeInvalidaError(Exception):
    """Exceção levantada quando idade é inválida."""
    
    def __init__(self, idade, mensagem="Idade deve estar entre 0 e 150"):
        self.idade = idade
        self.mensagem = mensagem
        super().__init__(self.mensagem)

class UsuarioError(Exception):
    """Exceção base para erros de usuário."""
    pass

class UsuarioNaoEncontradoError(UsuarioError):
    """Usuário não foi encontrado."""
    pass

class UsuarioJaExisteError(UsuarioError):
    """Usuário já existe no sistema."""
    pass

def validar_idade(idade):
    if not isinstance(idade, int):
        raise TypeError("Idade deve ser um número inteiro")
    if idade < 0 or idade > 150:
        raise IdadeInvalidaError(idade)
    return True

# Uso
try:
    validar_idade(200)
except IdadeInvalidaError as e:
    print(f"Erro: {e}")
    print(f"Idade fornecida: {e.idade}")
```

### Generators e Iterators

#### Generators
```python
# Generator function
def contador(maximo):
    num = 0
    while num < maximo:
        yield num
        num += 1

# Uso do generator
for numero in contador(5):
    print(numero)  # 0, 1, 2, 3, 4

# Generator expression
quadrados = (x**2 for x in range(10))
print(list(quadrados))  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Generator para sequência Fibonacci
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Usar apenas os primeiros 10 números
fib = fibonacci()
primeiros_10 = [next(fib) for _ in range(10)]
print(primeiros_10)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Generator com send()
def contador_interativo():
    valor = 0
    while True:
        incremento = yield valor
        if incremento is not None:
            valor += incremento
        else:
            valor += 1

gen = contador_interativo()
print(next(gen))        # 0
print(gen.send(5))      # 5
print(next(gen))        # 6
```

#### Iterators Customizados
```python
class ContadorIterator:
    def __init__(self, maximo):
        self.maximo = maximo
        self.num = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.num < self.maximo:
            atual = self.num
            self.num += 1
            return atual
        else:
            raise StopIteration

# Uso
contador = ContadorIterator(3)
for num in contador:
    print(num)  # 0, 1, 2

# Iterator para range reverso
class ReverseRange:
    def __init__(self, start, end):
        self.start = start
        self.end = end
    
    def __iter__(self):
        return ReverseRangeIterator(self.start, self.end)

class ReverseRangeIterator:
    def __init__(self, start, end):
        self.current = end - 1
        self.start = start
    
    def __next__(self):
        if self.current >= self.start:
            atual = self.current
            self.current -= 1
            return atual
        raise StopIteration

# Uso
for num in ReverseRange(1, 5):
    print(num)  # 4, 3, 2, 1
```

### Context Managers

#### Using Built-in Context Managers
```python
# Gerenciamento de arquivos
with open("arquivo.txt", "w") as f:
    f.write("Olá mundo!")
# Arquivo é fechado automaticamente

# Múltiplos context managers
with open("input.txt", "r") as f_in, open("output.txt", "w") as f_out:
    data = f_in.read()
    f_out.write(data.upper())
```

#### Custom Context Managers
```python
from contextlib import contextmanager
import sqlite3

# Context manager usando classe
class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
    
    def __enter__(self):
        print(f"Conectando ao banco {self.db_name}")
        self.connection = sqlite3.connect(self.db_name)
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            if exc_type:
                print("Erro ocorreu, fazendo rollback")
                self.connection.rollback()
            else:
                print("Sucesso, fazendo commit")
                self.connection.commit()
            self.connection.close()
        return False  # Não suprimir exceções

# Uso
with DatabaseConnection("test.db") as conn:
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT)")

# Context manager usando decorator
@contextmanager
def timer():
    import time
    start = time.time()
    try:
        yield
    finally:
        end = time.time()
        print(f"Tempo decorrido: {end - start:.4f} segundos")

# Uso
with timer():
    # código que queremos medir
    sum(range(1000000))

# Context manager para configuração temporária
@contextmanager
def configuracao_temporaria(**config):
    # Salvar configuração atual
    config_anterior = globals().copy()
    
    # Aplicar nova configuração
    globals().update(config)
    
    try:
        yield
    finally:
        # Restaurar configuração anterior
        globals().clear()
        globals().update(config_anterior)
```

### Bibliotecas Essenciais

#### requests - HTTP
```python
import requests
import json

# GET request
response = requests.get("https://api.github.com/users/octocat")
if response.status_code == 200:
    user_data = response.json()
    print(user_data["name"])

# POST request
data = {"nome": "João", "email": "joao@email.com"}
headers = {"Content-Type": "application/json"}
response = requests.post(
    "https://api.exemplo.com/users",
    data=json.dumps(data),
    headers=headers
)

# Session para reutilizar configurações
session = requests.Session()
session.headers.update({"Authorization": "Bearer token123"})

response1 = session.get("https://api.exemplo.com/profile")
response2 = session.get("https://api.exemplo.com/settings")

# Tratamento de erros
try:
    response = requests.get("https://api.exemplo.com/data", timeout=10)
    response.raise_for_status()  # Levanta exceção para status HTTP de erro
    data = response.json()
except requests.exceptions.Timeout:
    print("Timeout na requisição")
except requests.exceptions.RequestException as e:
    print(f"Erro na requisição: {e}")
```

#### datetime - Manipulação de Datas
```python
from datetime import datetime, date, time, timedelta
import calendar

# Criação de datas
agora = datetime.now()
hoje = date.today()
horario = time(14, 30, 0)

# Formatação
print(agora.strftime("%d/%m/%Y %H:%M:%S"))
print(hoje.strftime("%A, %d de %B de %Y"))

# Parsing de strings
data_string = "2023-12-25 15:30:00"
data_objeto = datetime.strptime(data_string, "%Y-%m-%d %H:%M:%S")

# Operações com datas
amanha = hoje + timedelta(days=1)
semana_passada = agora - timedelta(weeks=1)
em_30_dias = hoje + timedelta(days=30)

# Diferença entre datas
diferenca = agora - datetime(2023, 1, 1)
print(f"Dias desde o início do ano: {diferenca.days}")

# Trabalhando com fusos horários
from datetime import timezone
import pytz

# UTC
utc_now = datetime.now(timezone.utc)

# Fuso horário específico
sao_paulo = pytz.timezone('America/Sao_Paulo')
sp_now = datetime.now(sao_paulo)

# Converter entre fusos
utc_time = sp_now.astimezone(pytz.UTC)
```

#### pathlib - Manipulação de Caminhos
```python
from pathlib import Path
import os

# Criação de caminhos
caminho = Path("pasta/arquivo.txt")
caminho_absoluto = Path.cwd() / "pasta" / "arquivo.txt"

# Propriedades
print(caminho.name)         # arquivo.txt
print(caminho.stem)         # arquivo
print(caminho.suffix)       # .txt
print(caminho.parent)       # pasta
print(caminho.parts)        # ('pasta', 'arquivo.txt')

# Verificações
print(caminho.exists())     # False
print(caminho.is_file())    # False
print(caminho.is_dir())     # False

# Operações com diretórios
pasta = Path("minha_pasta")
pasta.mkdir(exist_ok=True)  # Criar diretório

# Listar arquivos
for arquivo in pasta.iterdir():
    if arquivo.is_file():
        print(arquivo.name)

# Buscar arquivos com padrão
arquivos_py = list(pasta.glob("*.py"))
arquivos_recursivo = list(pasta.rglob("*.txt"))

# Operações com arquivos
arquivo = Path("teste.txt")
arquivo.write_text("Olá mundo!")
conteudo = arquivo.read_text()

# Trabalhar com JSON
dados = {"nome": "João", "idade": 30}
arquivo_json = Path("dados.json")
arquivo_json.write_text(json.dumps(dados, indent=2))
dados_carregados = json.loads(arquivo_json.read_text())
```

### Async Programming

#### Básico de asyncio
```python
import asyncio
import aiohttp
import time

# Função assíncrona básica
async def cumprimentar(nome, delay):
    print(f"Olá {nome}!")
    await asyncio.sleep(delay)  # Operação assíncrona
    print(f"Tchau {nome}!")

# Executar função assíncrona
async def main():
    await cumprimentar("João", 2)

# asyncio.run(main())  # Python 3.7+

# Múltiplas tarefas concorrentes
async def main_concorrente():
    # Criar tarefas
    tarefa1 = asyncio.create_task(cumprimentar("Ana", 1))
    tarefa2 = asyncio.create_task(cumprimentar("Bruno", 2))
    tarefa3 = asyncio.create_task(cumprimentar("Carlos", 3))
    
    # Aguardar todas as tarefas
    await asyncio.gather(tarefa1, tarefa2, tarefa3)

# asyncio.run(main_concorrente())

# HTTP assíncrono com aiohttp
async def fazer_requisicao(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def requisicoes_multiplas():
    urls = [
        "https://httpbin.org/delay/1",
        "https://httpbin.org/delay/2",
        "https://httpbin.org/delay/3"
    ]
    
    inicio = time.time()
    
    # Requisições síncronas (sequenciais)
    # for url in urls:
    #     await fazer_requisicao(url)
    
    # Requisições assíncronas (concorrentes)
    tarefas = [fazer_requisicao(url) for url in urls]
    resultados = await asyncio.gather(*tarefas)
    
    fim = time.time()
    print(f"Tempo total: {fim - inicio:.2f} segundos")

# asyncio.run(requisicoes_multiplas())
```

#### Async Context Managers e Iterators
```python
# Async context manager
class AsyncDatabaseConnection:
    async def __aenter__(self):
        print("Conectando ao banco de dados...")
        await asyncio.sleep(1)  # Simular conexão
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Fechando conexão...")
        await asyncio.sleep(0.5)  # Simular fechamento

async def usar_banco():
    async with AsyncDatabaseConnection() as db:
        print("Executando query...")
        await asyncio.sleep(1)

# Async iterator
class AsyncContador:
    def __init__(self, maximo):
        self.maximo = maximo
        self.atual = 0
    
    def __aiter__(self):
        return self
    
    async def __anext__(self):
        if self.atual < self.maximo:
            await asyncio.sleep(0.1)  # Simular operação assíncrona
            self.atual += 1
            return self.atual - 1
        raise StopAsyncIteration

async def usar_contador():
    async for numero in AsyncContador(5):
        print(f"Número: {numero}")

# asyncio.run(usar_contador())

# Async generator
async def async_fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        await asyncio.sleep(0.1)  # Simular operação assíncrona
        a, b = b, a + b

async def usar_fibonacci():
    async for numero in async_fibonacci(10):
        print(f"Fibonacci: {numero}")

# asyncio.run(usar_fibonacci())
```

---

## 🎯 Resumo dos Conceitos Python

Este arquivo contém os principais conceitos do **Python** que todo desenvolvedor deve dominar:

### Fundamentos Essenciais
- **Sintaxe**: Tipos de dados, estruturas de controle, funções
- **Collections**: Listas, dicionários, sets, tuples e comprehensions
- **OOP**: Classes, herança, métodos especiais, properties
- **Error Handling**: Try/except, exceções customizadas

### Funcionalidades Avançadas
- **Decorators**: Modificação de funções e classes
- **Generators**: Criação eficiente de sequências
- **Context Managers**: Gerenciamento de recursos
- **Async Programming**: Programação assíncrona com asyncio

### Bibliotecas Fundamentais
- **requests**: Cliente HTTP para APIs
- **datetime**: Manipulação de datas e horários
- **pathlib**: Operações com arquivos e diretórios
- **json**: Serialização e deserialização de dados

### Best Practices
- **Type Hints**: Tipagem estática para melhor legibilidade
- **Error Handling**: Tratamento robusto de exceções
- **Documentation**: Docstrings e comentários claros
- **Code Style**: Seguir PEP 8 e convenções pythônicas
