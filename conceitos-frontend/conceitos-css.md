# Resumo de Conceitos CSS e Frontend

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais de CSS e frontend que todo desenvolvedor deve dominar.

## CSS/Frontend - Responsividade e Media Queries
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

## CSS/Frontend - Flexbox e Grid Layout
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

## Seletores CSS Avançados
```css
/* Seletores de atributo */
input[type="email"] {
  border-color: blue;
}

/* Pseudo-classes */
button:hover {
  background-color: #007bff;
}

button:focus {
  outline: 2px solid #007bff;
}

/* Pseudo-elementos */
p::before {
  content: "👉 ";
}

/* Combinadores */
.parent > .child {
  /* filho direto */
}

.element + .next {
  /* próximo irmão */
}

.element ~ .siblings {
  /* todos os irmãos seguintes */
}
```

## CSS Variables (Custom Properties)
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
  --spacing-unit: 8px;
}

.button {
  background-color: var(--primary-color);
  font-size: var(--font-size-base);
  padding: calc(var(--spacing-unit) * 2);
}

/* Valores de fallback */
.element {
  color: var(--text-color, #333);
}
```

## Animações e Transições
```css
/* Transições */
.button {
  background-color: #007bff;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

/* Animações com keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Animação infinita */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading {
  animation: spin 1s linear infinite;
}
```

## Frontend/Accessibility - Acessibilidade (a11y)
Práticas para tornar aplicações utilizáveis por pessoas com deficiência.
```html
<!-- Formulário acessível -->
<form>
  <label for="email">Email:</label>
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

<!-- Navegação por teclado -->
<div 
  role="button" 
  tabindex="0"
  onkeydown="if(event.key === 'Enter') handleClick()"
  onclick="handleClick()"
>
  Botão customizado
</div>

<!-- Skip links para navegação -->
<a href="#main-content" class="skip-link">Pular para conteúdo principal</a>

<!-- Landmarks -->
<header role="banner">
  <nav role="navigation" aria-label="Menu principal">
    <!-- navegação -->
  </nav>
</header>

<main role="main" id="main-content">
  <!-- conteúdo principal -->
</main>

<footer role="contentinfo">
  <!-- rodapé -->
</footer>
```

## CSS para Acessibilidade
```css
/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}

/* Focus visível */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Contraste para modo escuro */
@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #fff;
    --bg-color: #333;
  }
}

/* Redução de movimento */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Metodologias CSS

### BEM (Block Element Modifier)
```css
/* Block */
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Element */
.card__title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.card__content {
  padding: 1rem;
}

/* Modifier */
.card--featured {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card__title--large {
  font-size: 2rem;
}
```

### CSS Modules (nomenclatura)
```css
/* styles.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttonPrimary {
  composes: button;
  background-color: #007bff;
  color: white;
}
```

## Performance CSS
```css
/* Otimização com will-change */
.animated-element {
  will-change: transform;
}

/* Remoção após animação */
.animation-complete {
  will-change: auto;
}

/* Use transform em vez de mudanças de layout */
/* ❌ Evite */
.element {
  left: 100px;
  top: 100px;
}

/* ✅ Prefira */
.element {
  transform: translate(100px, 100px);
}

/* Containment para isolamento */
.isolated-component {
  contain: layout style paint;
}
```
