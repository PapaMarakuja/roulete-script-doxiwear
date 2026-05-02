// ============================================
// IMPORTS
// ============================================

import './style.css';
import rouletteHTML from './roulette.html?raw';
import { CONFIG } from './config';
import confetti from 'canvas-confetti';

import '@fortawesome/fontawesome-free/css/all.min.css';

// ============================================
// CONFIGURAÇÕES DA ROLETA
// ============================================

const ROULETTE_CONFIG = {
    // Prêmios da roleta
    prizes: [
        { text: '20% OFF', color: '#F5B8BF', value: 20, weight: 0, coupon: null },
        { text: '5% OFF', color: '#F1A4AC', value: 5, weight: 0, coupon: null },
        { text: '15% OFF', color: '#F5B8BF', value: 15, weight: 10, coupon: 'SALSICHA15' },
        { text: 'Frete Grátis', color: '#F1A4AC', value: 'free-shipping', weight: 0, coupon: null },
        { text: '25% OFF', color: '#F5B8BF', value: 25, weight: 0, coupon: null },
        { text: '10% OFF', color: '#F1A4AC', value: 10, weight: 90, coupon: 'SORTE10' },
    ],

    // Configurações de animação
    spinDuration: 4000,
    minSpins: 5,

    // Cookie
    cookieName: 'doxiwear_roulette_played',
    cookieExpireDays: 7
};

// ============================================
// ELEMENTOS DO DOM
// ============================================

const elements = {
    floatingButton: document.getElementById('rouletteButton'),
    modal: document.getElementById('rouletteModal'),
    modalOverlay: document.querySelector('.modal-overlay'),
    modalClose: document.querySelector('.modal-close'),
    form: document.getElementById('rouletteForm'),
    emailInput: document.getElementById('emailInput'),
    acceptTerms: document.getElementById('acceptTerms'),
    spinButton: document.getElementById('spinButton'),
    canvas: document.getElementById('rouletteCanvas'),
    resultMessage: document.getElementById('resultMessage'),
    formInputs: document.querySelector('.form-inputs-container')
};

// ============================================
// GERENCIAMENTO DE COOKIES
// ============================================

const CookieManager = {
    set(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    },

    get(name) {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    },

    hasPlayed() {
        return this.get(ROULETTE_CONFIG.cookieName) !== null;
    },

    markAsPlayed(email, prize) {
        const data = {
            email,
            prize,
            date: new Date().toISOString()
        };
        this.set(ROULETTE_CONFIG.cookieName, JSON.stringify(data), ROULETTE_CONFIG.cookieExpireDays);
    }
};

// ============================================
// DESENHO DA ROLETA
// ============================================

class RouletteWheel {
    constructor(canvas, prizes) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.prizes = prizes;
        this.currentRotation = 0;
        this.isSpinning = false;

        this.draw();
    }

    draw(rotation = 0) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 10;
        const numPrizes = this.prizes.length;
        const anglePerPrize = (2 * Math.PI) / numPrizes;

        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Salvar estado
        ctx.save();

        // Aplicar rotação
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);

        // Desenhar cada fatia
        this.prizes.forEach((prize, index) => {
            const startAngle = index * anglePerPrize - Math.PI / 2;
            const endAngle = startAngle + anglePerPrize;

            // Desenhar fatia
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = prize.color;
            ctx.fill();

            // Borda branca
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Texto
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + anglePerPrize / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px Arial';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.fillText(prize.text, radius * 0.65, 5);
            ctx.restore();
        });

        // Desenhar círculo central
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#AB7C7B';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Restaurar estado
        ctx.restore();
    }

    spin(onComplete) {
        if (this.isSpinning) return;

        this.isSpinning = true;
        const startTime = Date.now();
        const duration = ROULETTE_CONFIG.spinDuration;

        // Escolher prêmio com base nos pesos (Probabilidade Viciada)
        const totalWeight = this.prizes.reduce((sum, prize) => sum + (prize.weight || 0), 0);
        let randomValue = Math.random() * totalWeight;

        let prizeIndex = 0;
        for (let i = 0; i < this.prizes.length; i++) {
            randomValue -= (this.prizes[i].weight || 0);
            if (randomValue <= 0) {
                prizeIndex = i;
                break;
            }
        }

        const prize = this.prizes[prizeIndex];

        // Calcular ângulo para centralizar o prêmio no ponteiro (Direita / 0 radianos)
        const anglePerPrize = (2 * Math.PI) / this.prizes.length;
        const sliceCenterAngle = prizeIndex * anglePerPrize + anglePerPrize / 2 - Math.PI / 2;

        // Adicionar voltas mínimas e ajustar para chegar no alvo
        const minRotation = ROULETTE_CONFIG.minSpins * 2 * Math.PI;

        // Adicionar um pequeno jitter aleatório (+/- 20% da fatia)
        const jitter = (Math.random() - 0.5) * anglePerPrize * 0.4;

        let targetRotation = -sliceCenterAngle + jitter;

        // Normalizar para positivo
        while (targetRotation < 0) targetRotation += 2 * Math.PI;

        const totalRotation = minRotation + targetRotation;

        // Função de easing (ease-out)
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Aplicar easing
            const easedProgress = easeOut(progress);
            this.currentRotation = totalRotation * easedProgress;

            this.draw(this.currentRotation);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                onComplete(prize);
                scrollIntoVIew(elements.resultMessage);
            }
        };

        animate();
    }
}

// ============================================
// GERENCIAMENTO DO MODAL
// ============================================

const ModalManager = {
    open() {
        elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        if (!elements.modal.classList.contains('active') || elements.modal.classList.contains('closing')) return;

        elements.modal.classList.add('closing');

        const handleAnimationEnd = () => {
            elements.modal.classList.remove('active');
            elements.modal.classList.remove('closing');
            document.body.style.overflow = '';
            elements.modal.removeEventListener('animationend', handleAnimationEnd);
        };

        elements.modal.addEventListener('animationend', handleAnimationEnd, { once: true });
    },

    showResult(prize, success = true) {
        // Extrair apenas o número do texto se possível (ex: "20% OFF" -> "20%")
        const discountText = prize.text.match(/\d+%/)?.[0] || prize.text;

        const message = success
            ? `
            <div class="result-content animate-coupon">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <p class="title">🎉 PARABÉNS!</p>
                
                <div class="coupon-card">
                    <div class="coupon-left">
                        <span class="percentage-badge">${discountText}</span>
                    </div>
                    <div class="coupon-right">
                        <p class="coupon-label">CUPOM DE DESCONTO</p>
                        <div class="coupon-code-box" data-coupon="${prize.coupon}">
                            <span class="coupon-code">${prize.coupon}</span>
                            <i class="far fa-copy"></i>
                        </div>
                        <p class="coupon-hint">Toque para copiar</p>
                    </div>
                    <div class="coupon-cutout top"></div>
                    <div class="coupon-cutout bottom"></div>
                </div>

                <span class="copy-feedback"><i class="fas fa-check"></i> Copiado!</span>
            </div>
        `
            : `
            <div class="result-content error">
                <i class="fas fa-times-circle" style="font-size: 3rem; color: var(--error-text);"></i>
                <p>❌ Ops! Algo deu errado. Tente novamente.</p>
            </div>
            `;

        elements.resultMessage.innerHTML = message;
        elements.resultMessage.className = `result-message show ${success ? 'success' : 'error'}`;

        if (success) this.initCopy();
    },

    initCopy() {
        const couponWrapper = document.querySelector('.coupon-code-box');
        const feedback = document.querySelector('.copy-feedback');

        if (!couponWrapper || !feedback) return;

        const couponCode = couponWrapper.dataset.coupon;

        const copyToClipboard = async () => {
            try {
                await navigator.clipboard.writeText(couponCode);

                feedback.classList.add('show');
                setTimeout(() => feedback.classList.remove('show'), 2000);

            } catch (err) {
                console.error('Erro ao copiar:', err);
                const textArea = document.createElement('textarea');
                textArea.value = couponCode;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                    feedback.classList.add('show');
                    setTimeout(() => feedback.classList.remove('show'), 2000);
                } catch (err) {
                    console.error('Falha ao copiar:', err);
                }

                document.body.removeChild(textArea);
            }
        };

        couponWrapper.addEventListener('click', copyToClipboard);

        couponWrapper.addEventListener('touchstart', (e) => {
            e.preventDefault();
            copyToClipboard();
        });
    }

};

// ============================================
// INICIALIZAÇÃO
// ============================================

let rouletteWheel = null;

function injectRouletteHTML() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rouletteHTML;

    while (tempDiv.firstChild) {
        document.body.appendChild(tempDiv.firstChild);
    }
}

function init() {
    injectRouletteHTML();

    elements.floatingButton = document.getElementById('rouletteButton');
    elements.modal = document.getElementById('rouletteModal');
    elements.modalOverlay = document.querySelector('.modal-overlay');
    elements.modalClose = document.querySelector('.modal-close');
    elements.form = document.getElementById('rouletteForm');
    elements.emailInput = document.getElementById('emailInput');
    elements.acceptTerms = document.getElementById('acceptTerms');
    elements.spinButton = document.getElementById('spinButton');
    elements.canvas = document.getElementById('rouletteCanvas');
    elements.resultMessage = document.getElementById('resultMessage');
    elements.formInputs = document.querySelector('.form-inputs-container');

    if (CookieManager.hasPlayed()) {
        elements.floatingButton.style.display = 'none';
        return;
    }

    rouletteWheel = new RouletteWheel(elements.canvas, ROULETTE_CONFIG.prizes);

    setupEventListeners();
}

function setupEventListeners() {
    // Abrir modal
    elements.floatingButton.addEventListener('click', () => {
        ModalManager.open();
    });

    // Fechar modal - overlay
    elements.modalOverlay.addEventListener('click', () => {
        if (!rouletteWheel.isSpinning) {
            ModalManager.close();
        }
    });

    // Fechar modal - botão X
    elements.modalClose.addEventListener('click', () => {
        if (!rouletteWheel.isSpinning) {
            ModalManager.close();
        }
    });

    // Fechar modal - ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !rouletteWheel.isSpinning) {
            ModalManager.close();
        }
    });

    // Submit do formulário
    elements.form.addEventListener('submit', handleFormSubmit);
}

// ============================================
// INTEGRAÇÃO SUPABASE
// ============================================

async function saveToSupabase(email, prize) {
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_KEY) {
        console.warn('Supabase credentials not found in config.');
        return;
    }

    try {
        const response = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/emails`, {
            method: "POST",
            headers: {
                "apikey": CONFIG.SUPABASE_KEY,
                "Authorization": `Bearer ${CONFIG.SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({
                email: email,
                prize: prize.text
            })
        });

        if (!response.ok) {
            throw new Error(`Supabase error: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao salvar no Supabase:', error);
    }
}

// ============================================
// HANDLER DO FORMULÁRIO
// ============================================

function handleFormSubmit(e) {
    e.preventDefault();

    const email = elements.emailInput.value.trim();
    const acceptTerms = elements.acceptTerms.checked;

    if (!email || !isValidEmail(email) || !isRealEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    if (!acceptTerms) {
        alert('Por favor, aceite os termos para participar.');
        return;
    }

    // HIDE INPUTS AND CHECKBOX
    if (elements.formInputs) {
        elements.formInputs.classList.add('hiding-during-spin');
    }
    elements.spinButton.classList.add('hiding');

    elements.spinButton.disabled = true;
    elements.emailInput.disabled = true;

    rouletteWheel.spin((prize) => {
        CookieManager.markAsPlayed(email, prize);

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 2000
        });

        ModalManager.showResult(prize, true);
        saveToSupabase(email, prize);
    });
}



// ============================================
// UTILITÁRIOS
// ============================================

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isRealEmail(email) {
    if (!isValidEmail(email)) return false;

    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const domain = parts[1].toLowerCase();
    const domainParts = domain.split('.');

    const tld = domainParts[domainParts.length - 1];
    const validTLDs = ['com', 'org', 'net', 'edu', 'gov', 'br', 'io', 'me', 'pt', 'co', 'biz', 'info'];
    if (!validTLDs.includes(tld)) return false;

    const domainName = domainParts[0];
    const invalidDomains = ['abc', 'teste', 'test', 'exemplo', 'example', 'xyz', '123'];
    if (invalidDomains.includes(domainName)) return false;

    return true;
}



function scrollIntoVIew(element) {
    setTimeout(() => {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }, 100);
}

// ============================================
// INICIAR APLICAÇÃO
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// LÓGICA TEXTO FLUTUANTE ANIMADO
// ============================================

const floatingTexts = ["Descontos Doxi", "Tente a sorte", "Gire e ganhe"];
let currentTextIndex = 0;

function startTextAnimation() {
    const textElement = document.getElementById('rouletteText');
    if (!textElement) return;

    setInterval(() => {
        currentTextIndex = (currentTextIndex + 1) % floatingTexts.length;

        textElement.classList.remove('roulette-text-anim');
        void textElement.offsetWidth;

        textElement.innerText = floatingTexts[currentTextIndex];
        textElement.classList.add('roulette-text-anim');
    }, 2500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTextAnimation);
} else {
    startTextAnimation();
}
