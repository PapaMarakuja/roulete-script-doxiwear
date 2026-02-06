# 🎰 Roleta de Descontos - Doxiwear

Script de roleta de descontos pronto para integração com Shopify.

## 📋 Características

- ✅ Botão flutuante no canto inferior direito
- ✅ Modal responsivo com fundo escurecido
- ✅ Roleta animada com canvas HTML5
- ✅ Sistema de cookies (30 dias)
- ✅ Validação de e-mail
- ✅ Design moderno e responsivo
- ✅ Variáveis CSS para fácil customização
- ✅ Acessibilidade (ARIA labels)

## 🎨 Customização de Cores

Edite as variáveis CSS no arquivo `style.css`:

```css
:root {
    /* Cores Principais */
    --primary-color: #6366f1;        /* Cor principal */
    --primary-hover: #4f46e5;        /* Hover */
    --primary-dark: #4338ca;         /* Escuro */
    
    /* Cores da Roleta */
    --roulette-color-1: #ef4444;     /* Vermelho */
    --roulette-color-2: #f59e0b;     /* Laranja */
    --roulette-color-3: #10b981;     /* Verde */
    --roulette-color-4: #3b82f6;     /* Azul */
    --roulette-color-5: #8b5cf6;     /* Roxo */
    --roulette-color-6: #ec4899;     /* Rosa */
}
```

## 🎁 Customização de Prêmios

Edite o array `prizes` no arquivo `script.js`:

```javascript
const ROULETTE_CONFIG = {
    prizes: [
        { text: '5% OFF', color: '#ef4444', value: 5 },
        { text: '10% OFF', color: '#f59e0b', value: 10 },
        { text: '15% OFF', color: '#10b981', value: 15 },
        { text: '20% OFF', color: '#3b82f6', value: 20 },
        { text: '25% OFF', color: '#8b5cf6', value: 25 },
        { text: 'Frete Grátis', color: '#ec4899', value: 'free-shipping' }
    ]
};
```

## ⚙️ Configurações

No arquivo `script.js`, você pode ajustar:

```javascript
const ROULETTE_CONFIG = {
    spinDuration: 4000,           // Duração do giro (ms)
    minSpins: 5,                  // Mínimo de voltas completas
    cookieName: 'doxiwear_roulette_played',
    cookieExpireDays: 30          // Validade do cookie
};
```

## 🛍️ Integração com Shopify

### Método 1: Adicionar ao tema

1. No admin da Shopify, vá em **Online Store > Themes**
2. Clique em **Actions > Edit code**
3. Em **Assets**, clique em **Add a new asset**
4. Faça upload dos arquivos:
   - `style.css` → renomeie para `roulette.css`
   - `script.js` → renomeie para `roulette.js`

5. Edite o arquivo `theme.liquid` (em **Layout**)
6. Antes do `</head>`, adicione:
```liquid
{{ 'roulette.css' | asset_url | stylesheet_tag }}
```

7. Antes do `</body>`, adicione:
```liquid
{{ 'roulette.js' | asset_url | script_tag }}
```

8. Copie o HTML do modal (de `index.html`) e cole antes do `</body>`

### Método 2: Usar como snippet

1. Em **Snippets**, crie um novo snippet chamado `roulette.liquid`
2. Cole todo o conteúdo HTML do modal
3. No `theme.liquid`, adicione antes do `</body>`:
```liquid
{% render 'roulette' %}
```

## 📧 Captura de E-mail

O e-mail é capturado e salvo no cookie. Para enviar para um servidor:

```javascript
// No arquivo script.js, função handleFormSubmit
function handleFormSubmit(e) {
    // ... código existente ...
    
    rouletteWheel.spin((prize) => {
        // Enviar para servidor
        fetch('/api/roulette-signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                prize: prize.text,
                value: prize.value,
                timestamp: new Date().toISOString()
            })
        });
        
        // ... resto do código ...
    });
}
```

## 🎯 Aplicar Cupom Automaticamente (Shopify)

Para aplicar o cupom automaticamente após o giro:

```javascript
rouletteWheel.spin((prize) => {
    // Criar código do cupom
    const couponCode = `ROULETTE${prize.value}`;
    
    // Redirecionar para checkout com cupom
    if (prize.value !== 'free-shipping') {
        window.location.href = `/discount/${couponCode}`;
    }
    
    // ... resto do código ...
});
```

## 🔒 Cookies e LGPD

O script salva um cookie com:
- E-mail do usuário
- Prêmio ganho
- Data/hora

**Importante**: Adicione um aviso de cookies conforme LGPD/GDPR.

## 📱 Responsividade

O script é totalmente responsivo e se adapta a:
- Desktop (> 640px)
- Tablet (640px - 1024px)
- Mobile (< 640px)

## 🎨 Texto do Botão Flutuante

Para alterar o texto do botão, edite no `index.html`:

```html
<button id="rouletteButton" class="floating-button">
    🎰 Seu Texto Aqui
</button>
```

## 🔧 Funções Disponíveis

### CookieManager
- `CookieManager.hasPlayed()` - Verifica se já jogou
- `CookieManager.markAsPlayed(email, prize)` - Marca como jogado

### ModalManager
- `ModalManager.open()` - Abre o modal
- `ModalManager.close()` - Fecha o modal
- `ModalManager.showResult(prize, success)` - Mostra resultado

## 🐛 Debug

Para testar novamente (limpar cookie):

```javascript
// No console do navegador
document.cookie = 'doxiwear_roulette_played=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
location.reload();
```

## 📄 Estrutura de Arquivos

```
doxiwear-roulette/
├── index.html          # Estrutura HTML
├── style.css           # Estilos e variáveis CSS
├── script.js           # Lógica da roleta
└── README.md           # Este arquivo
```

## 🚀 Testar Localmente

1. Abra o arquivo `index.html` no navegador
2. Clique no botão "🎰 Roleta"
3. Preencha o e-mail e gire a roleta

## 💡 Dicas

- Use cores que combinem com sua marca
- Ajuste os prêmios conforme sua estratégia
- Teste em diferentes dispositivos
- Monitore a taxa de conversão
- Considere A/B testing com diferentes prêmios

## 📞 Suporte

Para dúvidas ou customizações adicionais, consulte a documentação da Shopify:
- [Shopify Theme Development](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/api/liquid)

---

Desenvolvido para Doxiwear 🎰
