// ============================================
// CONFIGURAÇÃO DOS TEMAS DA ROLETA
// ============================================
//
// Cada tema define:
//   cssVars       → variáveis CSS aplicadas ao container
//   wheelColors   → cores alternadas das fatias da roleta
//   pointerColor  → cor do ponteiro triangular
//   centerColor   → cor do círculo central da roleta
//   confettiEmojis→ emojis usados no confetti (null = confetti padrão)
//   floatingTexts → textos animados na bolha do botão flutuante
//   resultEmoji   → emoji exibido no "PARABÉNS!" após girar
//   badgeEmoji    → emoji decorativo sobre o botão flutuante
//   decoEmojis    → emojis decorativos no header do modal
// ============================================

export const THEMES = {

    // -------------------------------------------
    // PADRÃO — cores originais Doxiwear
    // -------------------------------------------
    default: {
        name: 'Padrão',
        cssVars: {
            '--primary-color': '#204457',
            '--primary-hover': '#1a3646',
            '--primary-dark': '#0f1f29',
            '--secondary-color': '#F5B8BF',
            '--secondary-hover': '#F1A4AC',
            '--secondary-dark': '#b58587',
            '--bg-overlay': 'rgba(32, 68, 87, 0.7)',
            '--border-focus': '#F5B8BF',
        },
        wheelColors: ['#F5B8BF', '#F1A4AC'],
        pointerColor: '#204457',
        centerColor: '#AB7C7B',
        confettiEmojis: null,
        floatingTexts: ['Descontos Doxi', 'Tente a sorte', 'Gire e ganhe'],
        resultEmoji: '🎉',
        badgeEmoji: '🐶',
        decoEmojis: ['🐶', '🦴', '🐾', '🌭'],
        cookieExpireDays: 7,
    },

    // -------------------------------------------
    // VALENTINES — Valentine's Day (Internacional)
    // -------------------------------------------
    valentines: {
        name: 'Valentines Day 💝',
        cssVars: {
            '--primary-color': '#B5254B',
            '--primary-hover': '#8E1A39',
            '--primary-dark': '#6B1028',
            '--secondary-color': '#FF6B8B',
            '--secondary-hover': '#E8456C',
            '--secondary-dark': '#C0304F',
            '--bg-overlay': 'rgba(131, 20, 60, 0.75)',
            '--border-focus': '#FF6B8B',
        },
        wheelColors: ['#FF8FA3', '#C0395A'],
        pointerColor: '#B5254B',
        centerColor: '#FF6B8B',
        confettiEmojis: ['💕', '❤️', '💘', '💝', '💖', '🌹'],
        floatingTexts: ['Amor está no ar! 💕', 'Descontos com amor 💘', 'Gire e ganhe 💖'],
        resultEmoji: '💝',
        badgeEmoji: '💕',
        decoEmojis: ['💕', '❤️', '💘', '💖'],
        cookieExpireDays: 1,
    },

    // -------------------------------------------
    // NAMORADOS — Dia dos Namorados (Brasil)
    // -------------------------------------------
    namorados: {
        name: 'Dia dos Namorados 💝',
        cssVars: {
            '--primary-color': '#B5254B',
            '--primary-hover': '#8E1A39',
            '--primary-dark': '#6B1028',
            '--secondary-color': '#FF6B8B',
            '--secondary-hover': '#E8456C',
            '--secondary-dark': '#C0304F',
            '--bg-overlay': 'rgba(131, 20, 60, 0.75)',
            '--border-focus': '#FF6B8B',
        },
        wheelColors: ['#FF8FA3', '#C0395A'],
        pointerColor: '#B5254B',
        centerColor: '#FF6B8B',
        confettiEmojis: ['💕', '❤️', '💘', '💝', '💖', '🌹'],
        floatingTexts: ['Amor está no ar! 💕', 'Descontos amorosos 💘', 'Gire e se apaixone 🌹'],
        resultEmoji: '💝',
        badgeEmoji: '💕',
        decoEmojis: ['💕', '❤️', '💘', '💖'],
        cookieExpireDays: 1,
    },

    // -------------------------------------------
    // HALLOWEEN
    // -------------------------------------------
    halloween: {
        name: 'Halloween 🎃',
        cssVars: {
            '--primary-color': '#6B2D8B',
            '--primary-hover': '#4F1F6B',
            '--primary-dark': '#3A1050',
            '--secondary-color': '#FF6B00',
            '--secondary-hover': '#E05500',
            '--secondary-dark': '#B84400',
            '--bg-overlay': 'rgba(15, 5, 30, 0.88)',
            '--border-focus': '#FF6B00',
        },
        wheelColors: ['#FF6B00', '#5C1F80'],
        pointerColor: '#FF6B00',
        centerColor: '#FF8C00',
        confettiEmojis: ['🎃', '👻', '🦇', '🕷️', '💀', '🕸️'],
        floatingTexts: ['Cupons especiais 🎃', 'Descontos ou travessuras?', 'Não tenha medo 👻'],
        resultEmoji: '🎃',
        badgeEmoji: '👻',
        decoEmojis: ['🎃', '👻', '🦇', '🕷️'],
        cookieExpireDays: 1,
    },

    // -------------------------------------------
    // CHRISTMAS — Natal
    // -------------------------------------------
    christmas: {
        name: 'Natal 🎄',
        cssVars: {
            '--primary-color': '#165C30',
            '--primary-hover': '#0F4022',
            '--primary-dark': '#0A2C17',
            '--secondary-color': '#DC1C2E',
            '--secondary-hover': '#B81424',
            '--secondary-dark': '#8B0D1A',
            '--bg-overlay': 'rgba(10, 28, 15, 0.80)',
            '--border-focus': '#DC1C2E',
        },
        wheelColors: ['#DC1C2E', '#165C30'],
        pointerColor: '#DC1C2E',
        centerColor: '#FFD700',
        confettiEmojis: ['⭐', '❄️', '🎄', '🎁', '🦌', '🔔'],
        floatingTexts: ['Feliz Natal! 🎄', 'Desconto natalino', 'Presente de Natal 🎁'],
        resultEmoji: '🎁',
        badgeEmoji: '⭐',
        decoEmojis: ['⭐', '❄️', '🎄', '🎁'],
        cookieExpireDays: 1,
    },
};
