# Conceitos Database

## 📚 Sobre este arquivo
Este arquivo contém conceitos fundamentais de **Banco de Dados** - sistemas de gerenciamento de dados relacionais e não-relacionais essenciais para desenvolvimento backend:

### 🗄️ Fundamentos de Database
- `SQL` - Structured Query Language para bancos relacionais
- `NoSQL` - Bancos não-relacionais (MongoDB, Redis)
- `ACID` - Atomicidade, Consistência, Isolamento, Durabilidade
- `Normalização` - Organização eficiente de dados

### 🐘 PostgreSQL
- `Tipos de Dados` - Tipos nativos e avançados
- `Índices` - Otimização de consultas
- `Views e Procedures` - Lógica no banco de dados
- `Triggers` - Automatização de processos

### 🍃 MongoDB
- `Documents` - Estrutura de documentos JSON/BSON
- `Collections` - Agrupamento de documentos
- `Aggregation` - Pipeline de agregação
- `Indexing` - Índices para performance

### ⚡ Redis
- `Key-Value Store` - Estrutura chave-valor em memória
- `Data Types` - Strings, Lists, Sets, Hashes
- `Pub/Sub` - Sistema de mensagens
- `Caching` - Cache distribuído

### 🔧 ORMs e Query Builders
- `Django ORM` - ORM do Django
- `SQLAlchemy` - ORM Python avançado
- `Prisma` - ORM moderno para Node.js
- `Query Optimization` - Otimização de consultas

> **Nota**: Para conceitos específicos de Django ORM, consulte o arquivo `conceitos-django.md`

---

## Database Fundamentals

### SQL Básico

#### DDL - Data Definition Language
```sql
-- Criar banco de dados
CREATE DATABASE loja_virtual;

-- Usar banco de dados
USE loja_virtual;

-- Criar tabela
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativa BOOLEAN DEFAULT TRUE,
    criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco > 0),
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    estoque INTEGER DEFAULT 0 CHECK (estoque >= 0),
    disponivel BOOLEAN DEFAULT TRUE,
    imagem_url VARCHAR(500),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar coluna
ALTER TABLE produtos ADD COLUMN peso DECIMAL(5, 2);

-- Modificar coluna
ALTER TABLE produtos ALTER COLUMN nome TYPE VARCHAR(250);

-- Remover coluna
ALTER TABLE produtos DROP COLUMN peso;

-- Criar índice
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_disponivel ON produtos(disponivel);
CREATE INDEX idx_produtos_slug ON produtos(slug);

-- Índice composto
CREATE INDEX idx_produtos_categoria_disponivel ON produtos(categoria_id, disponivel);

-- Índice parcial
CREATE INDEX idx_produtos_ativos ON produtos(categoria_id) WHERE disponivel = TRUE;

-- Remover tabela
DROP TABLE IF EXISTS produtos;
```

#### DML - Data Manipulation Language
```sql
-- INSERT
INSERT INTO categorias (nome, descricao) 
VALUES ('Eletrônicos', 'Produtos eletrônicos em geral');

INSERT INTO categorias (nome, descricao) VALUES 
    ('Roupas', 'Vestuário masculino e feminino'),
    ('Livros', 'Livros de diversos gêneros'),
    ('Casa', 'Produtos para casa e decoração');

-- INSERT com SELECT
INSERT INTO produtos (nome, slug, preco, categoria_id)
SELECT 
    CONCAT('Produto ', generate_series(1, 100)),
    CONCAT('produto-', generate_series(1, 100)),
    ROUND((random() * 1000 + 10)::numeric, 2),
    (SELECT id FROM categorias ORDER BY random() LIMIT 1);

-- UPDATE
UPDATE produtos 
SET preco = preco * 1.1 
WHERE categoria_id = (SELECT id FROM categorias WHERE nome = 'Eletrônicos');

UPDATE produtos 
SET disponivel = FALSE 
WHERE estoque = 0;

-- UPDATE com JOIN
UPDATE produtos p
SET categoria_id = c.id
FROM categorias c
WHERE c.nome = 'Promoção' AND p.preco < 50;

-- DELETE
DELETE FROM produtos WHERE estoque = 0 AND NOT disponivel;

DELETE FROM categorias WHERE NOT EXISTS (
    SELECT 1 FROM produtos WHERE categoria_id = categorias.id
);
```

#### DQL - Data Query Language
```sql
-- SELECT básico
SELECT * FROM produtos;
SELECT nome, preco FROM produtos WHERE disponivel = TRUE;

-- WHERE com condições
SELECT * FROM produtos 
WHERE preco BETWEEN 100 AND 500 
    AND disponivel = TRUE 
    AND categoria_id IN (1, 2, 3);

-- LIKE para busca de texto
SELECT * FROM produtos 
WHERE nome LIKE '%smartphone%' 
    OR descricao ILIKE '%celular%';  -- ILIKE é case-insensitive no PostgreSQL

-- ORDER BY
SELECT * FROM produtos 
ORDER BY preco DESC, nome ASC;

-- LIMIT e OFFSET (paginação)
SELECT * FROM produtos 
ORDER BY criado_em DESC 
LIMIT 10 OFFSET 20;  -- Página 3 (20 registros pulados)

-- DISTINCT
SELECT DISTINCT categoria_id FROM produtos WHERE disponivel = TRUE;

-- GROUP BY e agregações
SELECT 
    c.nome as categoria,
    COUNT(*) as total_produtos,
    AVG(p.preco) as preco_medio,
    MIN(p.preco) as preco_minimo,
    MAX(p.preco) as preco_maximo,
    SUM(p.estoque) as estoque_total
FROM produtos p
JOIN categorias c ON p.categoria_id = c.id
WHERE p.disponivel = TRUE
GROUP BY c.id, c.nome
HAVING COUNT(*) > 5
ORDER BY total_produtos DESC;

-- Subqueries
SELECT * FROM produtos 
WHERE preco > (SELECT AVG(preco) FROM produtos);

-- EXISTS
SELECT * FROM categorias c
WHERE EXISTS (
    SELECT 1 FROM produtos p 
    WHERE p.categoria_id = c.id AND p.disponivel = TRUE
);

-- CASE
SELECT 
    nome,
    preco,
    CASE 
        WHEN preco < 50 THEN 'Barato'
        WHEN preco BETWEEN 50 AND 200 THEN 'Médio'
        ELSE 'Caro'
    END as faixa_preco
FROM produtos;
```

#### JOINs
```sql
-- INNER JOIN
SELECT p.nome, p.preco, c.nome as categoria
FROM produtos p
INNER JOIN categorias c ON p.categoria_id = c.id
WHERE p.disponivel = TRUE;

-- LEFT JOIN
SELECT c.nome as categoria, COUNT(p.id) as total_produtos
FROM categorias c
LEFT JOIN produtos p ON c.id = p.categoria_id AND p.disponivel = TRUE
GROUP BY c.id, c.nome;

-- RIGHT JOIN
SELECT p.nome, c.nome as categoria
FROM produtos p
RIGHT JOIN categorias c ON p.categoria_id = c.id;

-- FULL OUTER JOIN
SELECT p.nome, c.nome as categoria
FROM produtos p
FULL OUTER JOIN categorias c ON p.categoria_id = c.id;

-- CROSS JOIN
SELECT p.nome, t.nome as tag
FROM produtos p
CROSS JOIN tags t;

-- Self JOIN (exemplo com hierarquia)
CREATE TABLE categorias_hierarquia (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    categoria_pai_id INTEGER REFERENCES categorias_hierarquia(id)
);

SELECT 
    c.nome as categoria,
    p.nome as categoria_pai
FROM categorias_hierarquia c
LEFT JOIN categorias_hierarquia p ON c.categoria_pai_id = p.id;
```

### PostgreSQL Avançado

#### Tipos de Dados PostgreSQL
```sql
-- Tipos numéricos
CREATE TABLE exemplo_tipos (
    id SERIAL PRIMARY KEY,
    inteiro INTEGER,
    bigint BIGINT,
    decimal_preciso DECIMAL(10, 2),
    numero_real REAL,
    dupla_precisao DOUBLE PRECISION,
    
    -- Tipos de texto
    texto_variavel VARCHAR(255),
    texto_fixo CHAR(10),
    texto_ilimitado TEXT,
    
    -- Tipos de data/hora
    data DATE,
    hora TIME,
    data_hora TIMESTAMP,
    data_hora_tz TIMESTAMPTZ,
    intervalo INTERVAL,
    
    -- Tipos booleanos
    ativo BOOLEAN,
    
    -- Tipos especiais PostgreSQL
    json_data JSON,
    jsonb_data JSONB,
    array_inteiros INTEGER[],
    array_texto TEXT[],
    uuid_field UUID DEFAULT gen_random_uuid(),
    inet_addr INET,
    mac_addr MACADDR,
    
    -- Tipos geométricos
    ponto POINT,
    linha LINE,
    circulo CIRCLE,
    poligono POLYGON,
    
    -- Tipo de range
    periodo_inteiros INT4RANGE,
    periodo_timestamps TSRANGE
);

-- Inserindo dados com tipos especiais
INSERT INTO exemplo_tipos (
    texto_variavel,
    json_data,
    jsonb_data,
    array_inteiros,
    array_texto,
    ponto,
    periodo_inteiros
) VALUES (
    'Exemplo',
    '{"nome": "João", "idade": 30}',
    '{"nome": "Maria", "idade": 25, "skills": ["Python", "SQL"]}',
    ARRAY[1, 2, 3, 4],
    ARRAY['Python', 'PostgreSQL', 'Django'],
    POINT(10, 20),
    '[1,10)'
);

-- Consultando dados JSONB
SELECT * FROM exemplo_tipos 
WHERE jsonb_data->>'nome' = 'Maria';

SELECT * FROM exemplo_tipos 
WHERE jsonb_data ? 'skills';

SELECT jsonb_data->'skills' FROM exemplo_tipos 
WHERE jsonb_data ? 'skills';

-- Operações com arrays
SELECT * FROM exemplo_tipos 
WHERE 'Python' = ANY(array_texto);

SELECT * FROM exemplo_tipos 
WHERE array_inteiros @> ARRAY[1, 2];  -- Contém
```

#### Views e Materialized Views
```sql
-- View simples
CREATE VIEW produtos_disponiveis AS
SELECT 
    p.id,
    p.nome,
    p.preco,
    c.nome as categoria,
    p.estoque
FROM produtos p
JOIN categorias c ON p.categoria_id = c.id
WHERE p.disponivel = TRUE;

-- View com agregação
CREATE VIEW estatisticas_categoria AS
SELECT 
    c.nome as categoria,
    COUNT(p.id) as total_produtos,
    AVG(p.preco) as preco_medio,
    SUM(p.estoque) as estoque_total,
    MIN(p.criado_em) as primeiro_produto,
    MAX(p.criado_em) as ultimo_produto
FROM categorias c
LEFT JOIN produtos p ON c.id = p.categoria_id
GROUP BY c.id, c.nome;

-- Materialized View (para performance)
CREATE MATERIALIZED VIEW mv_estatisticas_vendas AS
SELECT 
    DATE_TRUNC('month', v.data_venda) as mes,
    c.nome as categoria,
    COUNT(*) as total_vendas,
    SUM(iv.quantidade * iv.preco_unitario) as receita_total
FROM vendas v
JOIN itens_venda iv ON v.id = iv.venda_id
JOIN produtos p ON iv.produto_id = p.id
JOIN categorias c ON p.categoria_id = c.id
GROUP BY DATE_TRUNC('month', v.data_venda), c.id, c.nome;

-- Refresh da materialized view
REFRESH MATERIALIZED VIEW mv_estatisticas_vendas;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_estatisticas_vendas;  -- Sem lock

-- Usar views
SELECT * FROM produtos_disponiveis WHERE preco < 100;
SELECT * FROM estatisticas_categoria ORDER BY preco_medio DESC;
```

#### Stored Procedures e Functions
```sql
-- Function simples
CREATE OR REPLACE FUNCTION calcular_desconto(preco DECIMAL, percentual DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    RETURN preco * (1 - percentual / 100);
END;
$$ LANGUAGE plpgsql;

-- Usar function
SELECT nome, preco, calcular_desconto(preco, 10) as preco_com_desconto
FROM produtos;

-- Function que retorna tabela
CREATE OR REPLACE FUNCTION produtos_por_faixa_preco(preco_min DECIMAL, preco_max DECIMAL)
RETURNS TABLE(id INTEGER, nome VARCHAR, preco DECIMAL, categoria VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.nome, p.preco, c.nome
    FROM produtos p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.preco BETWEEN preco_min AND preco_max
    AND p.disponivel = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Usar function que retorna tabela
SELECT * FROM produtos_por_faixa_preco(50, 200);

-- Procedure (PostgreSQL 11+)
CREATE OR REPLACE PROCEDURE atualizar_estoque(produto_id INTEGER, nova_quantidade INTEGER)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE produtos 
    SET estoque = nova_quantidade,
        atualizado_em = CURRENT_TIMESTAMP
    WHERE id = produto_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Produto com ID % não encontrado', produto_id;
    END IF;
    
    COMMIT;
END;
$$;

-- Chamar procedure
CALL atualizar_estoque(1, 100);
```

#### Triggers
```sql
-- Function para trigger
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp
CREATE TRIGGER trigger_atualizar_timestamp
    BEFORE UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

-- Trigger para log de auditoria
CREATE TABLE log_produtos (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER,
    operacao VARCHAR(10),
    dados_antigos JSONB,
    dados_novos JSONB,
    usuario VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_produtos_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO log_produtos (produto_id, operacao, dados_antigos, usuario)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD), current_user);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO log_produtos (produto_id, operacao, dados_antigos, dados_novos, usuario)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), current_user);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO log_produtos (produto_id, operacao, dados_novos, usuario)
        VALUES (NEW.id, 'INSERT', row_to_json(NEW), current_user);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de auditoria
CREATE TRIGGER trigger_log_produtos
    AFTER INSERT OR UPDATE OR DELETE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION log_produtos_changes();
```

### MongoDB

#### Operações Básicas
```javascript
// Conectar ao MongoDB (usando MongoDB Shell)
use loja_virtual

// Inserir documentos
db.produtos.insertOne({
    nome: "Smartphone Samsung",
    preco: 899.99,
    categoria: "Eletrônicos",
    especificacoes: {
        tela: "6.1 polegadas",
        memoria: "128GB",
        camera: "48MP"
    },
    tags: ["smartphone", "samsung", "android"],
    disponivel: true,
    estoque: 50,
    criadoEm: new Date()
})

// Inserir múltiplos documentos
db.produtos.insertMany([
    {
        nome: "Notebook Dell",
        preco: 2500.00,
        categoria: "Eletrônicos",
        especificacoes: {
            processador: "Intel i7",
            memoria: "16GB RAM",
            armazenamento: "512GB SSD"
        },
        tags: ["notebook", "dell", "laptop"],
        disponivel: true,
        estoque: 15
    },
    {
        nome: "Livro Python",
        preco: 89.90,
        categoria: "Livros",
        especificacoes: {
            autor: "Luciano Ramalho",
            paginas: 792,
            editora: "Novatec"
        },
        tags: ["python", "programação", "livro"],
        disponivel: true,
        estoque: 30
    }
])

// Consultar documentos
db.produtos.find()
db.produtos.findOne({nome: "Smartphone Samsung"})

// Consultas com filtros
db.produtos.find({categoria: "Eletrônicos"})
db.produtos.find({preco: {$lt: 1000}})  // Menor que 1000
db.produtos.find({preco: {$gte: 100, $lte: 500}})  // Entre 100 e 500
db.produtos.find({tags: {$in: ["smartphone", "notebook"]}})
db.produtos.find({disponivel: true, estoque: {$gt: 0}})

// Consultas em campos aninhados
db.produtos.find({"especificacoes.memoria": "128GB"})
db.produtos.find({"especificacoes.paginas": {$exists: true}})

// Projeção (selecionar campos específicos)
db.produtos.find({}, {nome: 1, preco: 1, _id: 0})
db.produtos.find({categoria: "Eletrônicos"}, {especificacoes: 0})

// Ordenação e limitação
db.produtos.find().sort({preco: -1})  // Ordem decrescente
db.produtos.find().sort({categoria: 1, preco: -1})
db.produtos.find().limit(5)
db.produtos.find().skip(10).limit(5)  // Paginação

// Atualizar documentos
db.produtos.updateOne(
    {nome: "Smartphone Samsung"},
    {$set: {preco: 799.99, estoque: 45}}
)

db.produtos.updateMany(
    {categoria: "Eletrônicos"},
    {$inc: {preco: 50}}  // Incrementar preço em 50
)

// Operadores de atualização
db.produtos.updateOne(
    {nome: "Livro Python"},
    {
        $set: {"especificacoes.edicao": "2ª edição"},
        $push: {tags: "best-seller"},  // Adicionar ao array
        $inc: {estoque: -1}  // Decrementar estoque
    }
)

// Upsert (insert se não existir)
db.produtos.updateOne(
    {nome: "Produto Novo"},
    {$set: {preco: 199.99, categoria: "Novo"}},
    {upsert: true}
)

// Deletar documentos
db.produtos.deleteOne({nome: "Produto Temporário"})
db.produtos.deleteMany({estoque: 0, disponivel: false})
```

#### Aggregation Pipeline
```javascript
// Pipeline de agregação básico
db.produtos.aggregate([
    {$match: {disponivel: true}},
    {$group: {
        _id: "$categoria",
        totalProdutos: {$sum: 1},
        precoMedio: {$avg: "$preco"},
        precoMinimo: {$min: "$preco"},
        precoMaximo: {$max: "$preco"},
        estoqueTotal: {$sum: "$estoque"}
    }},
    {$sort: {precoMedio: -1}}
])

// Pipeline complexo com múltiplos estágios
db.vendas.aggregate([
    // Filtrar vendas dos últimos 30 dias
    {$match: {
        dataVenda: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
    }},
    
    // Unwind para "desnormalizar" array de itens
    {$unwind: "$itens"},
    
    // Lookup para juntar com produtos
    {$lookup: {
        from: "produtos",
        localField: "itens.produtoId",
        foreignField: "_id",
        as: "produto"
    }},
    
    // Unwind do resultado do lookup
    {$unwind: "$produto"},
    
    // Adicionar campos calculados
    {$addFields: {
        subtotal: {
            $multiply: ["$itens.quantidade", "$itens.precoUnitario"]
        },
        mes: {$dateToString: {format: "%Y-%m", date: "$dataVenda"}}
    }},
    
    // Agrupar por categoria e mês
    {$group: {
        _id: {
            categoria: "$produto.categoria",
            mes: "$mes"
        },
        totalVendas: {$sum: 1},
        quantidadeVendida: {$sum: "$itens.quantidade"},
        receitaTotal: {$sum: "$subtotal"}
    }},
    
    // Ordenar resultados
    {$sort: {"_id.mes": -1, "receitaTotal": -1}},
    
    // Projetar resultado final
    {$project: {
        _id: 0,
        categoria: "$_id.categoria",
        mes: "$_id.mes",
        totalVendas: 1,
        quantidadeVendida: 1,
        receitaTotal: {$round: ["$receitaTotal", 2]},
        ticketMedio: {
            $round: [{$divide: ["$receitaTotal", "$totalVendas"]}, 2]
        }
    }}
])

// Facet para múltiplas agregações em paralelo
db.produtos.aggregate([
    {$facet: {
        "estatisticasGerais": [
            {$group: {
                _id: null,
                totalProdutos: {$sum: 1},
                precoMedio: {$avg: "$preco"},
                estoqueTotal: {$sum: "$estoque"}
            }}
        ],
        "porCategoria": [
            {$group: {
                _id: "$categoria",
                count: {$sum: 1},
                avgPreco: {$avg: "$preco"}
            }},
            {$sort: {count: -1}}
        ],
        "faixasPreco": [
            {$bucket: {
                groupBy: "$preco",
                boundaries: [0, 100, 500, 1000, 5000],
                default: "Acima de 5000",
                output: {
                    count: {$sum: 1},
                    produtos: {$push: "$nome"}
                }
            }}
        ]
    }}
])
```

#### Indexação no MongoDB
```javascript
// Criar índices simples
db.produtos.createIndex({nome: 1})  // Ascendente
db.produtos.createIndex({preco: -1})  // Descendente
db.produtos.createIndex({categoria: 1, preco: -1})  // Composto

// Índice de texto para busca
db.produtos.createIndex({
    nome: "text",
    descricao: "text",
    "especificacoes.autor": "text"
})

// Busca por texto
db.produtos.find({$text: {$search: "smartphone samsung"}})
db.produtos.find({$text: {$search: "python programação"}})

// Índice em campo aninhado
db.produtos.createIndex({"especificacoes.memoria": 1})

// Índice esparso (apenas documentos que têm o campo)
db.produtos.createIndex({isbn: 1}, {sparse: true})

// Índice único
db.usuarios.createIndex({email: 1}, {unique: true})

// Índice TTL (Time To Live) para expiração automática
db.sessoes.createIndex({criadoEm: 1}, {expireAfterSeconds: 3600})

// Índice geoespacial
db.lojas.createIndex({localizacao: "2dsphere"})

// Consulta geoespacial
db.lojas.find({
    localizacao: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [-23.5505, -46.6333]  // São Paulo
            },
            $maxDistance: 5000  // 5km
        }
    }
})

// Ver índices
db.produtos.getIndexes()

// Analisar performance de query
db.produtos.find({categoria: "Eletrônicos"}).explain("executionStats")

// Remover índice
db.produtos.dropIndex({nome: 1})
```

### Redis

#### Comandos Básicos
```redis
# Strings
SET usuario:1:nome "João Silva"
GET usuario:1:nome
SET contador 10
INCR contador  # 11
INCRBY contador 5  # 16
DECR contador  # 15

# Expiração
SET sessao:abc123 "dados_da_sessao" EX 3600  # Expira em 1 hora
EXPIRE usuario:1:nome 300  # Expira em 5 minutos
TTL usuario:1:nome  # Ver tempo restante

# Verificar existência
EXISTS usuario:1:nome
DEL usuario:1:nome

# Listas (arrays ordenados)
LPUSH carrinho:usuario1 "produto:123"
LPUSH carrinho:usuario1 "produto:456"
LRANGE carrinho:usuario1 0 -1  # Ver todos os itens
RPOP carrinho:usuario1  # Remover do final
LLEN carrinho:usuario1  # Tamanho da lista

# Sets (conjuntos únicos)
SADD tags:produto1 "eletrônicos" "smartphone" "android"
SMEMBERS tags:produto1  # Ver todos os membros
SISMEMBER tags:produto1 "smartphone"  # Verificar se existe
SCARD tags:produto1  # Número de membros

# Operações entre sets
SADD categoria:eletronicos "produto:1" "produto:2" "produto:3"
SADD categoria:smartphones "produto:1" "produto:4"
SINTER categoria:eletronicos categoria:smartphones  # Interseção
SUNION categoria:eletronicos categoria:smartphones  # União
SDIFF categoria:eletronicos categoria:smartphones   # Diferença

# Hashes (objetos/dicionários)
HSET usuario:1 nome "João" email "joao@email.com" idade 30
HGET usuario:1 nome
HGETALL usuario:1
HMGET usuario:1 nome email  # Múltiplos campos
HINCRBY usuario:1 idade 1  # Incrementar campo numérico
HEXISTS usuario:1 telefone

# Sorted Sets (sets ordenados por score)
ZADD ranking:vendas 1500 "produto:1"
ZADD ranking:vendas 2300 "produto:2"
ZADD ranking:vendas 980 "produto:3"
ZRANGE ranking:vendas 0 -1 WITHSCORES  # Ver todos com scores
ZREVRANGE ranking:vendas 0 2  # Top 3 (ordem reversa)
ZRANK ranking:vendas "produto:1"  # Posição no ranking
ZSCORE ranking:vendas "produto:2"  # Score de um membro
```

#### Redis com Python
```python
import redis
import json
from datetime import timedelta

# Conectar ao Redis
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Testar conexão
print(r.ping())  # True

# Cache simples
def get_produto_cache(produto_id):
    """Buscar produto do cache."""
    cache_key = f"produto:{produto_id}"
    cached_data = r.get(cache_key)
    
    if cached_data:
        return json.loads(cached_data)
    
    # Se não estiver no cache, buscar do banco de dados
    produto = buscar_produto_db(produto_id)  # Função fictícia
    
    if produto:
        # Armazenar no cache por 1 hora
        r.setex(cache_key, 3600, json.dumps(produto))
    
    return produto

# Cache de lista com paginação
def get_produtos_categoria_cache(categoria_id, page=1, per_page=20):
    """Lista de produtos com cache por categoria."""
    cache_key = f"produtos:categoria:{categoria_id}:page:{page}"
    cached_data = r.get(cache_key)
    
    if cached_data:
        return json.loads(cached_data)
    
    # Buscar do banco
    produtos = buscar_produtos_categoria_db(categoria_id, page, per_page)
    
    # Cache por 30 minutos
    r.setex(cache_key, 1800, json.dumps(produtos))
    
    return produtos

# Invalidar cache relacionado
def invalidar_cache_produto(produto_id):
    """Invalidar todo cache relacionado a um produto."""
    # Remover cache específico do produto
    r.delete(f"produto:{produto_id}")
    
    # Buscar chaves relacionadas para invalidar
    keys_categoria = r.keys("produtos:categoria:*")
    if keys_categoria:
        r.delete(*keys_categoria)

# Sistema de sessão
class RedisSessionStore:
    def __init__(self, redis_client, session_prefix="session:"):
        self.redis = redis_client
        self.prefix = session_prefix
        self.default_timeout = 3600  # 1 hora
    
    def create_session(self, user_id, session_data):
        """Criar nova sessão."""
        import uuid
        session_id = str(uuid.uuid4())
        session_key = f"{self.prefix}{session_id}"
        
        data = {
            "user_id": user_id,
            "created_at": str(datetime.now()),
            **session_data
        }
        
        self.redis.setex(session_key, self.default_timeout, json.dumps(data))
        return session_id
    
    def get_session(self, session_id):
        """Buscar dados da sessão."""
        session_key = f"{self.prefix}{session_id}"
        data = self.redis.get(session_key)
        
        if data:
            return json.loads(data)
        return None
    
    def update_session(self, session_id, session_data):
        """Atualizar dados da sessão."""
        session_key = f"{self.prefix}{session_id}"
        current_data = self.get_session(session_id)
        
        if current_data:
            current_data.update(session_data)
            self.redis.setex(session_key, self.default_timeout, json.dumps(current_data))
            return True
        return False
    
    def delete_session(self, session_id):
        """Deletar sessão."""
        session_key = f"{self.prefix}{session_id}"
        return self.redis.delete(session_key)

# Rate limiting
class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def is_allowed(self, identifier, limit=100, window=3600):
        """
        Verificar se requisição é permitida.
        Args:
            identifier: ID único (IP, user_id, etc.)
            limit: Número máximo de requisições
            window: Janela de tempo em segundos
        """
        key = f"rate_limit:{identifier}"
        current = self.redis.get(key)
        
        if current is None:
            # Primeira requisição
            self.redis.setex(key, window, 1)
            return True
        
        if int(current) < limit:
            self.redis.incr(key)
            return True
        
        return False
    
    def get_remaining(self, identifier, limit=100):
        """Obter requisições restantes."""
        key = f"rate_limit:{identifier}"
        current = self.redis.get(key)
        
        if current is None:
            return limit
        
        return max(0, limit - int(current))

# Pub/Sub para notificações em tempo real
class NotificationPublisher:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def publish_notification(self, channel, message):
        """Publicar notificação."""
        self.redis.publish(channel, json.dumps(message))
    
    def notify_user(self, user_id, notification_type, data):
        """Notificar usuário específico."""
        channel = f"user:{user_id}:notifications"
        message = {
            "type": notification_type,
            "data": data,
            "timestamp": str(datetime.now())
        }
        self.publish_notification(channel, message)

class NotificationSubscriber:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.pubsub = self.redis.pubsub()
    
    def subscribe_user(self, user_id):
        """Inscrever-se nas notificações de um usuário."""
        channel = f"user:{user_id}:notifications"
        self.pubsub.subscribe(channel)
    
    def listen_notifications(self):
        """Escutar notificações."""
        for message in self.pubsub.listen():
            if message['type'] == 'message':
                try:
                    data = json.loads(message['data'])
                    yield data
                except json.JSONDecodeError:
                    continue

# Uso das classes
session_store = RedisSessionStore(r)
rate_limiter = RateLimiter(r)
notifier = NotificationPublisher(r)

# Criar sessão
session_id = session_store.create_session(123, {"role": "admin"})

# Rate limiting
if rate_limiter.is_allowed("user:123", limit=10, window=60):
    print("Requisição permitida")
else:
    print("Rate limit excedido")

# Notificar usuário
notifier.notify_user(123, "new_message", {"from": "admin", "text": "Olá!"})
```

### Query Optimization

#### Índices e Performance
```sql
-- Analisar plano de execução
EXPLAIN ANALYZE SELECT * FROM produtos 
WHERE categoria_id = 1 AND preco BETWEEN 100 AND 500;

-- Índices compostos - ordem importa
CREATE INDEX idx_produtos_categoria_preco ON produtos(categoria_id, preco);
CREATE INDEX idx_produtos_preco_categoria ON produtos(preco, categoria_id);

-- Índice parcial para casos específicos
CREATE INDEX idx_produtos_disponiveis 
ON produtos(categoria_id, preco) 
WHERE disponivel = TRUE;

-- Índice funcional
CREATE INDEX idx_produtos_nome_lower 
ON produtos(LOWER(nome));

-- Consulta que usa o índice funcional
SELECT * FROM produtos WHERE LOWER(nome) LIKE 'smartphone%';

-- Estatísticas para otimização
ANALYZE produtos;
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats 
WHERE tablename = 'produtos';
```

#### Otimização de Queries
```sql
-- ❌ Query lenta - sem índice adequado
SELECT * FROM produtos p
JOIN categorias c ON p.categoria_id = c.id
WHERE c.nome = 'Eletrônicos'
ORDER BY p.criado_em DESC;

-- ✅ Query otimizada - com índices apropriados
-- Índices necessários:
-- CREATE INDEX idx_categorias_nome ON categorias(nome);
-- CREATE INDEX idx_produtos_categoria_criado ON produtos(categoria_id, criado_em DESC);

-- ❌ Query com N+1 problem
-- Para cada produto, faz nova query para categoria
SELECT p.*, 
       (SELECT c.nome FROM categorias c WHERE c.id = p.categoria_id) as categoria_nome
FROM produtos p;

-- ✅ Query otimizada com JOIN
SELECT p.*, c.nome as categoria_nome
FROM produtos p
JOIN categorias c ON p.categoria_id = c.id;

-- ❌ Subquery lenta
SELECT * FROM produtos 
WHERE categoria_id IN (
    SELECT id FROM categorias WHERE nome LIKE '%Eletrô%'
);

-- ✅ JOIN mais eficiente
SELECT p.* FROM produtos p
JOIN categorias c ON p.categoria_id = c.id
WHERE c.nome LIKE '%Eletrô%';

-- Paginação eficiente para grandes datasets
-- ❌ OFFSET pode ser lento para páginas altas
SELECT * FROM produtos ORDER BY id LIMIT 20 OFFSET 100000;

-- ✅ Cursor-based pagination
SELECT * FROM produtos 
WHERE id > 100000 
ORDER BY id 
LIMIT 20;

-- Window functions para ranking sem subqueries
SELECT 
    nome,
    preco,
    categoria_id,
    ROW_NUMBER() OVER (PARTITION BY categoria_id ORDER BY preco DESC) as ranking_categoria,
    DENSE_RANK() OVER (ORDER BY preco DESC) as ranking_geral
FROM produtos;
```

#### Monitoramento e Troubleshooting
```sql
-- PostgreSQL - Ver queries lentas
SELECT query, mean_exec_time, calls, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Ver locks ativos
SELECT 
    pg_class.relname,
    pg_locks.locktype,
    pg_locks.mode,
    pg_locks.granted,
    pg_stat_activity.query
FROM pg_locks
JOIN pg_class ON pg_locks.relation = pg_class.oid
JOIN pg_stat_activity ON pg_locks.pid = pg_stat_activity.pid;

-- Ver conexões ativas
SELECT 
    client_addr,
    application_name,
    state,
    query_start,
    query
FROM pg_stat_activity
WHERE state = 'active';

-- Tamanho das tabelas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🎯 Resumo dos Conceitos Database

Este arquivo contém os principais conceitos de **Bancos de Dados** que todo desenvolvedor backend deve dominar:

### SQL Fundamentals
- **DDL/DML/DQL**: Linguagem de definição, manipulação e consulta
- **JOINs**: Relacionamento entre tabelas
- **Indexing**: Otimização de consultas
- **Views**: Consultas reutilizáveis

### PostgreSQL Avançado
- **Tipos Especiais**: JSON, Arrays, UUID, Geometric types
- **Functions/Procedures**: Lógica no banco de dados
- **Triggers**: Automatização de processos
- **Performance**: Análise e otimização de queries

### NoSQL - MongoDB
- **Document Store**: Estrutura flexível de documentos
- **Aggregation Pipeline**: Processamento avançado de dados
- **Indexing**: Otimização para consultas complexas
- **Scaling**: Sharding e replicação

### Redis - In-Memory
- **Data Structures**: Strings, Lists, Sets, Hashes, Sorted Sets
- **Caching**: Estratégias de cache distribuído
- **Pub/Sub**: Sistema de mensagens em tempo real
- **Session Store**: Gerenciamento de sessões

### Otimização e Performance
- **Query Optimization**: Técnicas de otimização
- **Index Strategy**: Estratégias de indexação
- **Monitoring**: Monitoramento e troubleshooting
- **Scaling**: Técnicas de escalabilidade
