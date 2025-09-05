# Conceitos Django

## 📚 Sobre este arquivo
Este arquivo contém conceitos fundamentais do **Django** - framework web Python de alto nível que encoraja desenvolvimento rápido e design limpo e pragmático:

### 🌐 Fundamentos Django
- `MVT Pattern` - Model-View-Template (similar ao MVC)
- `Django Admin` - Interface administrativa automática
- `ORM` - Object-Relational Mapping para banco de dados
- `URL Routing` - Sistema de roteamento de URLs

### 🗃️ Models e Database
- `Models` - Definição de estrutura de dados
- `Migrations` - Versionamento de esquema de banco
- `QuerySets` - Interface para consultas ao banco
- `Relationships` - ForeignKey, ManyToMany, OneToOne

### 🎨 Views e Templates
- `Function-Based Views` - Views baseadas em funções
- `Class-Based Views` - Views baseadas em classes
- `Templates` - Sistema de templates Django
- `Forms` - Validação e renderização de formulários

### 🔐 Autenticação e Segurança
- `User Authentication` - Sistema de usuários built-in
- `Permissions` - Sistema de permissões
- `Middleware` - Processamento de requests/responses
- `CSRF Protection` - Proteção contra ataques CSRF

### 🚀 Funcionalidades Avançadas
- `Django REST Framework` - APIs REST poderosas
- `Static Files` - Gerenciamento de arquivos estáticos
- `Internationalization` - Suporte a múltiplos idiomas
- `Testing` - Framework de testes integrado

> **Nota**: Para conceitos fundamentais de Python, consulte o arquivo `conceitos-python.md`

---

## Django

### Instalação e Setup Inicial

#### Instalação
```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar Django
pip install django

# Instalar dependências adicionais
pip install djangorestframework
pip install django-cors-headers
pip install pillow  # Para ImageField
pip install python-decouple  # Para variáveis de ambiente
```

#### Criar Projeto Django
```bash
# Criar projeto
django-admin startproject meu_projeto
cd meu_projeto

# Criar app
python manage.py startapp meu_app

# Estrutura do projeto
meu_projeto/
    manage.py
    meu_projeto/
        __init__.py
        settings.py
        urls.py
        wsgi.py
        asgi.py
    meu_app/
        __init__.py
        admin.py
        apps.py
        models.py
        tests.py
        views.py
        migrations/
```

### Settings e Configuração

#### settings.py
```python
# meu_projeto/settings.py
import os
from decouple import config
from pathlib import Path

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'corsheaders',
    
    # Local apps
    'meu_app',
    'usuarios',
    'produtos',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'meu_projeto.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Internationalization
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

#### .env (variáveis de ambiente)
```bash
# .env
SECRET_KEY=sua-chave-secreta-muito-segura
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=meu_banco
DB_USER=usuario
DB_PASSWORD=senha
DB_HOST=localhost
DB_PORT=5432
```

### Models

#### Definição de Models
```python
# models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.urls import reverse

class Categoria(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True)
    ativa = models.BooleanField(default=True)
    criada_em = models.DateTimeField(auto_now_add=True)
    atualizada_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"
        ordering = ['nome']
    
    def __str__(self):
        return self.nome
    
    def get_absolute_url(self):
        return reverse('categoria-detail', kwargs={'pk': self.pk})

class Produto(models.Model):
    TAMANHOS = [
        ('P', 'Pequeno'),
        ('M', 'Médio'),
        ('G', 'Grande'),
        ('GG', 'Extra Grande'),
    ]
    
    nome = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    descricao = models.TextField()
    preco = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    categoria = models.ForeignKey(
        Categoria, 
        on_delete=models.CASCADE,
        related_name='produtos'
    )
    tamanho = models.CharField(max_length=2, choices=TAMANHOS)
    estoque = models.PositiveIntegerField(default=0)
    disponivel = models.BooleanField(default=True)
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)
    
    # Relacionamento Many-to-Many
    tags = models.ManyToManyField('Tag', blank=True)
    
    # Campos de auditoria
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"
        ordering = ['-criado_em']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['categoria', 'disponivel']),
        ]
    
    def __str__(self):
        return self.nome
    
    def get_absolute_url(self):
        return reverse('produto-detail', kwargs={'slug': self.slug})
    
    @property
    def em_estoque(self):
        return self.estoque > 0
    
    def save(self, *args, **kwargs):
        # Customizar save
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)

class Tag(models.Model):
    nome = models.CharField(max_length=50, unique=True)
    cor = models.CharField(max_length=7, default='#000000')  # HEX color
    
    def __str__(self):
        return self.nome

# Model com relacionamento OneToOne
class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    telefone = models.CharField(max_length=20, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    endereco = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    def __str__(self):
        return f"Perfil de {self.usuario.username}"

# Model abstrato
class TimeStampedModel(models.Model):
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Pedido(TimeStampedModel):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('processando', 'Processando'),
        ('enviado', 'Enviado'),
        ('entregue', 'Entregue'),
        ('cancelado', 'Cancelado'),
    ]
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    observacoes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Pedido #{self.id} - {self.usuario.username}"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.produto.nome} x {self.quantidade}"
    
    @property
    def subtotal(self):
        return self.quantidade * self.preco_unitario
```

#### Migrations
```bash
# Criar migrations
python manage.py makemigrations

# Aplicar migrations
python manage.py migrate

# Ver SQL de uma migration
python manage.py sqlmigrate meu_app 0001

# Reverter migration
python manage.py migrate meu_app 0001

# Criar migration vazia para dados
python manage.py makemigrations --empty meu_app
```

#### QuerySets e Database Queries
```python
# queries.py - Exemplos de uso do ORM
from django.db.models import Q, F, Count, Sum, Avg
from datetime import datetime, timedelta
from .models import Produto, Categoria, Pedido

# Consultas básicas
def exemplos_basicos():
    # Todos os produtos
    todos_produtos = Produto.objects.all()
    
    # Filtrar
    produtos_disponiveis = Produto.objects.filter(disponivel=True)
    produtos_categoria = Produto.objects.filter(categoria__nome='Eletrônicos')
    
    # Excluir
    produtos_sem_eletronicos = Produto.objects.exclude(categoria__nome='Eletrônicos')
    
    # Get (um objeto)
    produto = Produto.objects.get(id=1)
    # ou com get_or_404
    from django.shortcuts import get_object_or_404
    produto = get_object_or_404(Produto, slug='meu-produto')
    
    # Primeiro/último
    primeiro = Produto.objects.first()
    ultimo = Produto.objects.last()
    
    # Ordenação
    produtos_ordenados = Produto.objects.order_by('-criado_em', 'nome')
    
    # Limitar resultados
    primeiros_10 = Produto.objects.all()[:10]
    
    # Verificar existência
    existe = Produto.objects.filter(slug='teste').exists()
    
    # Contar
    total_produtos = Produto.objects.count()

# Consultas avançadas
def consultas_avancadas():
    # Q objects para consultas complexas
    from django.db.models import Q
    
    # OR condition
    produtos = Produto.objects.filter(
        Q(categoria__nome='Roupas') | Q(categoria__nome='Calçados')
    )
    
    # AND com OR
    produtos = Produto.objects.filter(
        Q(disponivel=True) & (Q(preco__lt=100) | Q(estoque__gt=10))
    )
    
    # NOT
    produtos = Produto.objects.filter(~Q(categoria__nome='Eletrônicos'))
    
    # F objects para comparar campos
    produtos_estoque_baixo = Produto.objects.filter(estoque__lt=F('estoque_minimo'))
    
    # Atualizar usando F
    Produto.objects.filter(categoria__nome='Promoção').update(
        preco=F('preco') * 0.9  # 10% de desconto
    )

# Relacionamentos
def consultas_relacionamentos():
    # Select related (JOIN para ForeignKey e OneToOne)
    produtos = Produto.objects.select_related('categoria', 'criado_por').all()
    
    # Prefetch related (para ManyToMany e reverse ForeignKey)
    produtos = Produto.objects.prefetch_related('tags').all()
    
    # Combinando
    produtos = Produto.objects.select_related('categoria').prefetch_related('tags')
    
    # Filtrar por relacionamento
    produtos_eletronicos = Produto.objects.filter(categoria__nome='Eletrônicos')
    categorias_com_produtos = Categoria.objects.filter(produtos__isnull=False).distinct()
    
    # Atravessar relacionamentos
    usuarios_com_pedidos = User.objects.filter(pedido__status='entregue').distinct()

# Agregações
def agregacoes():
    from django.db.models import Count, Sum, Avg, Max, Min
    
    # Contar produtos por categoria
    categorias = Categoria.objects.annotate(
        total_produtos=Count('produtos')
    )
    
    # Estatísticas de preços
    stats = Produto.objects.aggregate(
        preco_medio=Avg('preco'),
        preco_maximo=Max('preco'),
        preco_minimo=Min('preco'),
        total_produtos=Count('id')
    )
    
    # Valor total do estoque
    valor_estoque = Produto.objects.aggregate(
        valor_total=Sum(F('preco') * F('estoque'))
    )
    
    # Produtos mais caros por categoria
    categorias_stats = Categoria.objects.annotate(
        produto_mais_caro=Max('produtos__preco'),
        total_produtos=Count('produtos')
    ).filter(total_produtos__gt=0)

# Raw SQL quando necessário
def raw_queries():
    # Raw query
    produtos = Produto.objects.raw(
        "SELECT * FROM meu_app_produto WHERE preco > %s",
        [100]
    )
    
    # Executar SQL customizado
    from django.db import connection
    
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT categoria_id, COUNT(*) FROM meu_app_produto GROUP BY categoria_id"
        )
        resultados = cursor.fetchall()

# Custom Managers
class ProdutoDisponivelManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(disponivel=True)

class Produto(models.Model):
    # ... campos ...
    
    objects = models.Manager()  # Manager padrão
    disponiveis = ProdutoDisponivelManager()  # Manager customizado
    
    class Meta:
        # ... meta options ...
        pass

# Uso do manager customizado
produtos_disponiveis = Produto.disponiveis.all()
```

### Views

#### Function-Based Views
```python
# views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Produto, Categoria
from .forms import ProdutoForm

def home(request):
    """Página inicial com produtos em destaque."""
    produtos_destaque = Produto.objects.filter(
        disponivel=True
    ).order_by('-criado_em')[:6]
    
    categorias = Categoria.objects.filter(ativa=True)
    
    context = {
        'produtos_destaque': produtos_destaque,
        'categorias': categorias,
    }
    return render(request, 'home.html', context)

def lista_produtos(request):
    """Lista de produtos com filtros e paginação."""
    produtos = Produto.objects.filter(disponivel=True).select_related('categoria')
    
    # Filtro por categoria
    categoria_id = request.GET.get('categoria')
    if categoria_id:
        produtos = produtos.filter(categoria_id=categoria_id)
    
    # Busca por texto
    q = request.GET.get('q')
    if q:
        produtos = produtos.filter(
            Q(nome__icontains=q) | Q(descricao__icontains=q)
        )
    
    # Ordenação
    ordem = request.GET.get('ordem', '-criado_em')
    produtos = produtos.order_by(ordem)
    
    # Paginação
    paginator = Paginator(produtos, 12)  # 12 produtos por página
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'categorias': Categoria.objects.filter(ativa=True),
        'q': q,
        'categoria_id': int(categoria_id) if categoria_id else None,
        'ordem': ordem,
    }
    return render(request, 'produtos/lista.html', context)

def detalhe_produto(request, slug):
    """Detalhe de um produto específico."""
    produto = get_object_or_404(
        Produto.objects.select_related('categoria').prefetch_related('tags'),
        slug=slug,
        disponivel=True
    )
    
    # Produtos relacionados
    produtos_relacionados = Produto.objects.filter(
        categoria=produto.categoria,
        disponivel=True
    ).exclude(id=produto.id)[:4]
    
    context = {
        'produto': produto,
        'produtos_relacionados': produtos_relacionados,
    }
    return render(request, 'produtos/detalhe.html', context)

@login_required
def criar_produto(request):
    """Criar novo produto (apenas usuários logados)."""
    if request.method == 'POST':
        form = ProdutoForm(request.POST, request.FILES)
        if form.is_valid():
            produto = form.save(commit=False)
            produto.criado_por = request.user
            produto.save()
            form.save_m2m()  # Para ManyToMany fields
            
            messages.success(request, 'Produto criado com sucesso!')
            return redirect('detalhe-produto', slug=produto.slug)
    else:
        form = ProdutoForm()
    
    return render(request, 'produtos/criar.html', {'form': form})

def api_produtos(request):
    """API simples para produtos (JSON)."""
    produtos = Produto.objects.filter(disponivel=True).values(
        'id', 'nome', 'preco', 'categoria__nome'
    )
    
    return JsonResponse({
        'produtos': list(produtos),
        'total': produtos.count()
    })

# View para AJAX
def buscar_produtos_ajax(request):
    """Busca de produtos via AJAX."""
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        q = request.GET.get('q', '')
        produtos = Produto.objects.filter(
            nome__icontains=q,
            disponivel=True
        ).values('id', 'nome', 'preco')[:10]
        
        return JsonResponse({'produtos': list(produtos)})
    
    return JsonResponse({'erro': 'Requisição inválida'})
```

#### Class-Based Views
```python
# views.py (CBVs)
from django.views.generic import (
    ListView, DetailView, CreateView, UpdateView, DeleteView
)
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.contrib import messages
from .models import Produto, Categoria
from .forms import ProdutoForm

class ProdutoListView(ListView):
    """Lista de produtos com CBV."""
    model = Produto
    template_name = 'produtos/lista.html'
    context_object_name = 'produtos'
    paginate_by = 12
    
    def get_queryset(self):
        queryset = Produto.objects.filter(disponivel=True).select_related('categoria')
        
        # Filtros
        categoria_id = self.request.GET.get('categoria')
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        
        q = self.request.GET.get('q')
        if q:
            queryset = queryset.filter(
                Q(nome__icontains=q) | Q(descricao__icontains=q)
            )
        
        ordem = self.request.GET.get('ordem', '-criado_em')
        return queryset.order_by(ordem)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categorias'] = Categoria.objects.filter(ativa=True)
        context['q'] = self.request.GET.get('q', '')
        return context

class ProdutoDetailView(DetailView):
    """Detalhe do produto."""
    model = Produto
    template_name = 'produtos/detalhe.html'
    context_object_name = 'produto'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'
    
    def get_queryset(self):
        return Produto.objects.filter(disponivel=True).select_related('categoria')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['produtos_relacionados'] = Produto.objects.filter(
            categoria=self.object.categoria,
            disponivel=True
        ).exclude(id=self.object.id)[:4]
        return context

class ProdutoCreateView(LoginRequiredMixin, CreateView):
    """Criar produto."""
    model = Produto
    form_class = ProdutoForm
    template_name = 'produtos/criar.html'
    
    def form_valid(self, form):
        form.instance.criado_por = self.request.user
        messages.success(self.request, 'Produto criado com sucesso!')
        return super().form_valid(form)

class ProdutoUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    """Editar produto."""
    model = Produto
    form_class = ProdutoForm
    template_name = 'produtos/editar.html'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'
    
    def test_func(self):
        produto = self.get_object()
        return self.request.user == produto.criado_por or self.request.user.is_staff
    
    def form_valid(self, form):
        messages.success(self.request, 'Produto atualizado com sucesso!')
        return super().form_valid(form)

class ProdutoDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    """Deletar produto."""
    model = Produto
    template_name = 'produtos/deletar.html'
    success_url = reverse_lazy('lista-produtos')
    slug_field = 'slug'
    slug_url_kwarg = 'slug'
    
    def test_func(self):
        produto = self.get_object()
        return self.request.user == produto.criado_por or self.request.user.is_staff
    
    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Produto deletado com sucesso!')
        return super().delete(request, *args, **kwargs)

# Custom Mixin
class OwnerRequiredMixin(UserPassesTestMixin):
    """Mixin para verificar se o usuário é dono do objeto."""
    
    def test_func(self):
        obj = self.get_object()
        return self.request.user == obj.criado_por
```

### Forms

#### Django Forms
```python
# forms.py
from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Produto, Categoria, PerfilUsuario

class ProdutoForm(forms.ModelForm):
    """Formulário para produtos."""
    
    class Meta:
        model = Produto
        fields = [
            'nome', 'descricao', 'preco', 'categoria', 
            'tamanho', 'estoque', 'disponivel', 'imagem', 'tags'
        ]
        widgets = {
            'descricao': forms.Textarea(attrs={'rows': 4}),
            'preco': forms.NumberInput(attrs={'step': '0.01'}),
            'tags': forms.CheckboxSelectMultiple(),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Customizar campos
        self.fields['categoria'].queryset = Categoria.objects.filter(ativa=True)
        self.fields['nome'].widget.attrs.update({'class': 'form-control'})
        self.fields['preco'].widget.attrs.update({'class': 'form-control'})
    
    def clean_nome(self):
        """Validação customizada para nome."""
        nome = self.cleaned_data.get('nome')
        if len(nome) < 3:
            raise ValidationError('Nome deve ter pelo menos 3 caracteres.')
        return nome.title()  # Primeira letra maiúscula
    
    def clean_preco(self):
        """Validação para preço."""
        preco = self.cleaned_data.get('preco')
        if preco <= 0:
            raise ValidationError('Preço deve ser maior que zero.')
        return preco
    
    def clean(self):
        """Validação geral do formulário."""
        cleaned_data = super().clean()
        disponivel = cleaned_data.get('disponivel')
        estoque = cleaned_data.get('estoque')
        
        if disponivel and estoque == 0:
            raise ValidationError(
                'Produto não pode estar disponível com estoque zero.'
            )
        
        return cleaned_data

class BuscaProdutoForm(forms.Form):
    """Formulário de busca de produtos."""
    q = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': 'Buscar produtos...',
            'class': 'form-control'
        })
    )
    categoria = forms.ModelChoiceField(
        queryset=Categoria.objects.filter(ativa=True),
        required=False,
        empty_label="Todas as categorias",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    ordem = forms.ChoiceField(
        choices=[
            ('-criado_em', 'Mais recentes'),
            ('criado_em', 'Mais antigos'),
            ('preco', 'Menor preço'),
            ('-preco', 'Maior preço'),
            ('nome', 'Nome A-Z'),
            ('-nome', 'Nome Z-A'),
        ],
        required=False,
        initial='-criado_em',
        widget=forms.Select(attrs={'class': 'form-control'})
    )

class RegistroUsuarioForm(UserCreationForm):
    """Formulário de registro de usuário."""
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError('Este email já está em uso.')
        return email
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        if commit:
            user.save()
        return user

class PerfilUsuarioForm(forms.ModelForm):
    """Formulário para perfil do usuário."""
    
    class Meta:
        model = PerfilUsuario
        fields = ['telefone', 'data_nascimento', 'endereco', 'avatar']
        widgets = {
            'data_nascimento': forms.DateInput(attrs={'type': 'date'}),
            'endereco': forms.Textarea(attrs={'rows': 3}),
        }

# Formset para múltiplos objetos
from django.forms import modelformset_factory, inlineformset_factory

# Formset para múltiplos produtos
ProdutoFormSet = modelformset_factory(
    Produto,
    form=ProdutoForm,
    extra=2,  # Formulários extras vazios
    can_delete=True  # Permitir deletar
)

# Inline formset para relacionamentos
ItemPedidoFormSet = inlineformset_factory(
    Pedido,  # Modelo pai
    ItemPedido,  # Modelo filho
    fields=['produto', 'quantidade', 'preco_unitario'],
    extra=1,
    can_delete=True
)

# View usando formset
def criar_pedido_com_itens(request):
    if request.method == 'POST':
        pedido_form = PedidoForm(request.POST)
        item_formset = ItemPedidoFormSet(request.POST)
        
        if pedido_form.is_valid() and item_formset.is_valid():
            pedido = pedido_form.save(commit=False)
            pedido.usuario = request.user
            pedido.save()
            
            itens = item_formset.save(commit=False)
            for item in itens:
                item.pedido = pedido
                item.save()
            
            return redirect('detalhe-pedido', pk=pedido.pk)
    else:
        pedido_form = PedidoForm()
        item_formset = ItemPedidoFormSet()
    
    return render(request, 'pedidos/criar.html', {
        'pedido_form': pedido_form,
        'item_formset': item_formset,
    })
```

### Templates

#### Base Template
```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Minha Loja{% endblock %}</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    {% load static %}
    <link rel="stylesheet" href="{% static 'css/style.css' %}">
    
    {% block extra_css %}{% endblock %}
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="{% url 'home' %}">Minha Loja</a>
            
            <div class="navbar-nav ms-auto">
                {% if user.is_authenticated %}
                    <span class="navbar-text me-3">Olá, {{ user.get_full_name|default:user.username }}!</span>
                    <a class="nav-link" href="{% url 'logout' %}">Sair</a>
                {% else %}
                    <a class="nav-link" href="{% url 'login' %}">Entrar</a>
                    <a class="nav-link" href="{% url 'registro' %}">Registrar</a>
                {% endif %}
            </div>
        </div>
    </nav>
    
    <!-- Messages -->
    {% if messages %}
        <div class="container mt-3">
            {% for message in messages %}
                <div class="alert alert-{{ message.tags }} alert-dismissible fade show" role="alert">
                    {{ message }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            {% endfor %}
        </div>
    {% endif %}
    
    <!-- Main Content -->
    <main class="container my-4">
        {% block content %}{% endblock %}
    </main>
    
    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <p>&copy; 2023 Minha Loja. Todos os direitos reservados.</p>
        </div>
    </footer>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    {% block extra_js %}{% endblock %}
</body>
</html>
```

#### Lista de Produtos
```html
<!-- templates/produtos/lista.html -->
{% extends 'base.html' %}
{% load static %}

{% block title %}Produtos - {{ block.super }}{% endblock %}

{% block content %}
<div class="row">
    <div class="col-md-3">
        <!-- Filtros -->
        <div class="card">
            <div class="card-header">
                <h5>Filtros</h5>
            </div>
            <div class="card-body">
                <form method="get">
                    <!-- Busca -->
                    <div class="mb-3">
                        <input type="text" name="q" value="{{ q }}" 
                               placeholder="Buscar produtos..." class="form-control">
                    </div>
                    
                    <!-- Categoria -->
                    <div class="mb-3">
                        <select name="categoria" class="form-control">
                            <option value="">Todas as categorias</option>
                            {% for categoria in categorias %}
                                <option value="{{ categoria.id }}" 
                                        {% if categoria.id == categoria_id %}selected{% endif %}>
                                    {{ categoria.nome }}
                                </option>
                            {% endfor %}
                        </select>
                    </div>
                    
                    <!-- Ordenação -->
                    <div class="mb-3">
                        <select name="ordem" class="form-control">
                            <option value="-criado_em" {% if ordem == '-criado_em' %}selected{% endif %}>
                                Mais recentes
                            </option>
                            <option value="preco" {% if ordem == 'preco' %}selected{% endif %}>
                                Menor preço
                            </option>
                            <option value="-preco" {% if ordem == '-preco' %}selected{% endif %}>
                                Maior preço
                            </option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Filtrar</button>
                </form>
            </div>
        </div>
    </div>
    
    <div class="col-md-9">
        <!-- Resultados -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Produtos</h2>
            <span class="text-muted">{{ page_obj.paginator.count }} produto{{ page_obj.paginator.count|pluralize }}</span>
        </div>
        
        {% if page_obj %}
            <div class="row">
                {% for produto in page_obj %}
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            {% if produto.imagem %}
                                <img src="{{ produto.imagem.url }}" class="card-img-top" 
                                     alt="{{ produto.nome }}" style="height: 200px; object-fit: cover;">
                            {% else %}
                                <div class="card-img-top bg-light d-flex align-items-center justify-content-center"
                                     style="height: 200px;">
                                    <span class="text-muted">Sem imagem</span>
                                </div>
                            {% endif %}
                            
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">{{ produto.nome }}</h5>
                                <p class="card-text text-muted">{{ produto.categoria.nome }}</p>
                                <p class="card-text flex-grow-1">
                                    {{ produto.descricao|truncatewords:20 }}
                                </p>
                                <div class="mt-auto">
                                    <p class="h5 text-primary">R$ {{ produto.preco }}</p>
                                    <a href="{{ produto.get_absolute_url }}" class="btn btn-primary">
                                        Ver detalhes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                {% endfor %}
            </div>
            
            <!-- Paginação -->
            {% if page_obj.has_other_pages %}
                <nav>
                    <ul class="pagination justify-content-center">
                        {% if page_obj.has_previous %}
                            <li class="page-item">
                                <a class="page-link" href="?page=1{% if q %}&q={{ q }}{% endif %}{% if categoria_id %}&categoria={{ categoria_id }}{% endif %}">
                                    Primeira
                                </a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="?page={{ page_obj.previous_page_number }}{% if q %}&q={{ q }}{% endif %}{% if categoria_id %}&categoria={{ categoria_id }}{% endif %}">
                                    Anterior
                                </a>
                            </li>
                        {% endif %}
                        
                        <li class="page-item active">
                            <span class="page-link">
                                Página {{ page_obj.number }} de {{ page_obj.paginator.num_pages }}
                            </span>
                        </li>
                        
                        {% if page_obj.has_next %}
                            <li class="page-item">
                                <a class="page-link" href="?page={{ page_obj.next_page_number }}{% if q %}&q={{ q }}{% endif %}{% if categoria_id %}&categoria={{ categoria_id }}{% endif %}">
                                    Próxima
                                </a>
                            </li>
                            <li class="page-item">
                                <a class="page-link" href="?page={{ page_obj.paginator.num_pages }}{% if q %}&q={{ q }}{% endif %}{% if categoria_id %}&categoria={{ categoria_id }}{% endif %}">
                                    Última
                                </a>
                            </li>
                        {% endif %}
                    </ul>
                </nav>
            {% endif %}
        {% else %}
            <div class="text-center">
                <p class="text-muted">Nenhum produto encontrado.</p>
            </div>
        {% endif %}
    </div>
</div>
{% endblock %}
```

#### Custom Template Tags e Filters
```python
# templatetags/produto_extras.py
from django import template
from django.utils.html import format_html
from ..models import Categoria

register = template.Library()

@register.simple_tag
def total_produtos():
    """Retorna o total de produtos disponíveis."""
    from ..models import Produto
    return Produto.objects.filter(disponivel=True).count()

@register.simple_tag(takes_context=True)
def url_replace(context, **kwargs):
    """Substitui parâmetros na URL atual."""
    query = context['request'].GET.copy()
    for key, value in kwargs.items():
        query[key] = value
    return query.urlencode()

@register.inclusion_tag('produtos/categoria_menu.html')
def categoria_menu():
    """Renderiza menu de categorias."""
    return {'categorias': Categoria.objects.filter(ativa=True)}

@register.filter
def moeda(value):
    """Formata valor como moeda brasileira."""
    try:
        return f"R$ {float(value):,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
    except (ValueError, TypeError):
        return value

@register.filter
def destaque(text, term):
    """Destaca termo no texto."""
    if term:
        highlighted = f'<mark>{term}</mark>'
        return format_html(text.replace(term, highlighted))
    return text

# Uso nos templates
# {% load produto_extras %}
# {% total_produtos as total %}
# {{ produto.preco|moeda }}
# {% url_replace page=2 %}
```

### URLs

#### URL Configuration
```python
# meu_projeto/urls.py (URL principal)
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('meu_app.urls')),
    path('auth/', include('django.contrib.auth.urls')),
    path('api/', include('meu_app.api_urls')),
]

# Servir arquivos de media em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# meu_app/urls.py
from django.urls import path
from . import views

app_name = 'produtos'

urlpatterns = [
    # Function-based views
    path('', views.home, name='home'),
    path('produtos/', views.lista_produtos, name='lista-produtos'),
    path('produto/<slug:slug>/', views.detalhe_produto, name='detalhe-produto'),
    path('produto/criar/', views.criar_produto, name='criar-produto'),
    
    # Class-based views
    path('cbv/produtos/', views.ProdutoListView.as_view(), name='produtos-cbv'),
    path('cbv/produto/<slug:slug>/', views.ProdutoDetailView.as_view(), name='produto-detail-cbv'),
    path('cbv/produto/criar/', views.ProdutoCreateView.as_view(), name='produto-create-cbv'),
    path('cbv/produto/<slug:slug>/editar/', views.ProdutoUpdateView.as_view(), name='produto-update-cbv'),
    path('cbv/produto/<slug:slug>/deletar/', views.ProdutoDeleteView.as_view(), name='produto-delete-cbv'),
    
    # AJAX endpoints
    path('api/produtos/', views.api_produtos, name='api-produtos'),
    path('ajax/buscar-produtos/', views.buscar_produtos_ajax, name='buscar-produtos-ajax'),
    
    # Usuário
    path('registro/', views.RegistroView.as_view(), name='registro'),
    path('perfil/', views.perfil_usuario, name='perfil'),
]

# Padrões de URL avançados
from django.urls import re_path

# Regex patterns
re_path(r'^produto/(?P<categoria_slug>[\w-]+)/(?P<produto_slug>[\w-]+)/$', 
        views.produto_por_categoria, name='produto-categoria'),

# Múltiplos parâmetros
path('categoria/<int:categoria_id>/produtos/', views.produtos_categoria, name='produtos-categoria'),

# Parâmetros opcionais com regex
re_path(r'^busca/(?P<termo>[\w\s-]+)/(?:pagina/(?P<pagina>\d+)/)?$', 
        views.busca_produtos, name='busca-produtos'),
```

### Django REST Framework

#### Serializers
```python
# serializers.py
from rest_framework import serializers
from .models import Produto, Categoria, Pedido, ItemPedido

class CategoriaSerializer(serializers.ModelSerializer):
    total_produtos = serializers.SerializerMethodField()
    
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'descricao', 'ativa', 'total_produtos']
    
    def get_total_produtos(self, obj):
        return obj.produtos.filter(disponivel=True).count()

class ProdutoListSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Produto
        fields = [
            'id', 'nome', 'slug', 'preco', 'categoria', 'categoria_id',
            'disponivel', 'estoque', 'criado_em'
        ]

class ProdutoDetailSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    tags = serializers.StringRelatedField(many=True, read_only=True)
    em_estoque = serializers.ReadOnlyField()
    
    class Meta:
        model = Produto
        fields = '__all__'

class ProdutoCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        exclude = ['criado_por', 'criado_em', 'atualizado_em']
    
    def validate_preco(self, value):
        if value <= 0:
            raise serializers.ValidationError('Preço deve ser maior que zero.')
        return value
    
    def validate(self, data):
        if data.get('disponivel') and data.get('estoque', 0) == 0:
            raise serializers.ValidationError(
                'Produto não pode estar disponível com estoque zero.'
            )
        return data

# Serializer aninhado
class ItemPedidoSerializer(serializers.ModelSerializer):
    produto = ProdutoListSerializer(read_only=True)
    produto_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = ItemPedido
        fields = ['id', 'produto', 'produto_id', 'quantidade', 'preco_unitario', 'subtotal']

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, read_only=True)
    usuario = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'status', 'total', 'itens', 'criado_em']
```

#### API Views
```python
# api_views.py
from rest_framework import generics, viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Produto, Categoria
from .serializers import (
    ProdutoListSerializer, ProdutoDetailSerializer, 
    ProdutoCreateUpdateSerializer, CategoriaSerializer
)

# Function-based API views
@api_view(['GET', 'POST'])
def produto_list_api(request):
    if request.method == 'GET':
        produtos = Produto.objects.filter(disponivel=True)
        serializer = ProdutoListSerializer(produtos, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProdutoCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(criado_por=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Class-based API views
class ProdutoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Produto.objects.filter(disponivel=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'disponivel']
    search_fields = ['nome', 'descricao']
    ordering_fields = ['preco', 'criado_em']
    ordering = ['-criado_em']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProdutoCreateUpdateSerializer
        return ProdutoListSerializer
    
    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)

class ProdutoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produto.objects.all()
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProdutoCreateUpdateSerializer
        return ProdutoDetailSerializer

# ViewSets
class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['categoria', 'disponivel']
    search_fields = ['nome', 'descricao']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProdutoCreateUpdateSerializer
        elif self.action == 'list':
            return ProdutoListSerializer
        return ProdutoDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)
    
    @action(detail=True, methods=['post'])
    def toggle_disponibilidade(self, request, slug=None):
        produto = self.get_object()
        produto.disponivel = not produto.disponivel
        produto.save()
        return Response({
            'status': 'disponibilidade alterada',
            'disponivel': produto.disponivel
        })
    
    @action(detail=False)
    def disponiveis(self, request):
        produtos = self.queryset.filter(disponivel=True)
        serializer = self.get_serializer(produtos, many=True)
        return Response(serializer.data)

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.filter(ativa=True)
    serializer_class = CategoriaSerializer
```

#### API URLs
```python
# api_urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import api_views

# Router para ViewSets
router = DefaultRouter()
router.register(r'produtos', api_views.ProdutoViewSet)
router.register(r'categorias', api_views.CategoriaViewSet)

urlpatterns = [
    # ViewSets com router
    path('', include(router.urls)),
    
    # Views baseadas em classe
    path('v2/produtos/', api_views.ProdutoListCreateAPIView.as_view(), name='produto-list-api'),
    path('v2/produtos/<slug:slug>/', api_views.ProdutoDetailAPIView.as_view(), name='produto-detail-api'),
    
    # Autenticação
    path('auth/token/', obtain_auth_token, name='api-token'),
    path('auth/', include('rest_framework.urls')),  # Login/logout para browsable API
]
```

---

## 🎯 Resumo dos Conceitos Django

Este arquivo contém os principais conceitos do **Django** que todo desenvolvedor backend deve dominar:

### Framework Essenciais
- **MVT Pattern**: Model-View-Template architecture
- **ORM**: Object-Relational Mapping poderoso
- **Admin Interface**: Interface administrativa automática
- **URL Routing**: Sistema flexível de roteamento

### Models e Database
- **Model Definition**: Definição de estrutura de dados
- **Relationships**: ForeignKey, ManyToMany, OneToOne
- **Migrations**: Versionamento de esquema de banco
- **QuerySets**: Interface avançada para consultas

### Views e Templates
- **Function/Class-Based Views**: Diferentes paradigmas de views
- **Template System**: Sistema de templates poderoso
- **Forms**: Validação e renderização de formulários
- **Generic Views**: Views pré-construídas para casos comuns

### API Development
- **Django REST Framework**: Framework para APIs REST
- **Serializers**: Serialização de dados
- **ViewSets**: Views organizadas para APIs
- **Authentication**: Sistema de autenticação para APIs

### Segurança e Produção
- **Authentication**: Sistema de usuários built-in
- **Permissions**: Controle de acesso granular
- **CSRF Protection**: Proteção contra ataques
- **Static Files**: Gerenciamento de arquivos estáticos
