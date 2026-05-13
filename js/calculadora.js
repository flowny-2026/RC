// ═══════════════════════════════════════════
//   CALCULADORA DE TINTA — RC Pintura e Decorações
//   Adicione este arquivo em: js/calculadora.js
//   E no HTML antes de </body>:
//   <script src="js/calculadora.js"></script>
// ═══════════════════════════════════════════

// ── Dados dos tipos de tinta ──
const tintas = [
    { id: 'acrilica', name: 'Tinta Acrílica',   icon: '🪣', rend: 12, latas: [3.6, 18],       cor: '#4a90d9', desc: '12 m²/L' },
    { id: 'latex',    name: 'Látex PVA',         icon: '🫙', rend: 10, latas: [3.6, 18],       cor: '#d4c254', desc: '10 m²/L' },
    { id: 'massa',    name: 'Massa Corrida',     icon: '🧱', rend: 8,  latas: [3.6, 18],       cor: '#c4a97d', desc: '8 m²/L'  },
    { id: 'oleo',     name: 'Tinta Óleo',        icon: '🎨', rend: 10, latas: [0.9, 3.6],      cor: '#c0392b', desc: '10 m²/L' },
    { id: 'esmalte',  name: 'Esmalte Sintético', icon: '✨', rend: 14, latas: [0.9, 3.6],      cor: '#7f8c8d', desc: '14 m²/L' },
    { id: 'epoxi',    name: 'Tinta Epóxi',       icon: '⚗️', rend: 8,  latas: [3.6, 18],       cor: '#8e44ad', desc: '8 m²/L'  },
    { id: 'verniz',   name: 'Verniz',             icon: '🪵', rend: 15, latas: [0.9, 3.6, 18], cor: '#d4893a', desc: '15 m²/L' },
];

let selectedPaint = null;

// ── Renderiza os cards de tinta ──
function renderCards() {
    const grid = document.getElementById('paintGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    tintas.forEach(t => {
        const div = document.createElement('div');
        div.className = 'paint-card';
        div.dataset.id = t.id;
        div.innerHTML = `
            <span class="paint-icon">${t.icon}</span>
            <div class="paint-name">${t.name}</div>
            <div class="paint-info">${t.desc}</div>
            <span class="paint-dot" style="background:${t.cor}"></span>
        `;
        div.addEventListener('click', () => selectPaint(t.id));
        grid.appendChild(div);
    });
}

// ── Seleciona um tipo de tinta ──
function selectPaint(id) {
    selectedPaint = id;
    document.querySelectorAll('.paint-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.id === id);
    });
}

// ── Cálculo principal (nome usado no seu HTML) ──
function calcularTintaNova() {
    const largura     = parseFloat(document.getElementById('largura').value);
    const comprimento = parseFloat(document.getElementById('comprimento').value);
    const altura      = parseFloat(document.getElementById('altura').value);
    const portas      = parseInt(document.getElementById('portas').value)  || 0;
    const janelas     = parseInt(document.getElementById('janelas').value) || 0;
    const demaos      = parseInt(document.getElementById('demaos').value);
    const err         = document.getElementById('errorMsg');

    if (!largura || !comprimento || !altura || !selectedPaint) {
        err.style.display = 'block';
        return;
    }
    err.style.display = 'none';

    const tinta = tintas.find(t => t.id === selectedPaint);

    // Perímetro × altura (4 paredes)
    const areaTotal   = 2 * (largura + comprimento) * altura;
    const areaPortas  = portas  * 2.0;  // porta padrão ≈ 2 m²
    const areaJanelas = janelas * 1.5;  // janela padrão ≈ 1,5 m²
    const areaLiquida = Math.max(0, areaTotal - areaPortas - areaJanelas);
    const litros      = (areaLiquida / tinta.rend) * demaos;

    // Preenche resultado
    document.getElementById('resArea').textContent    = areaTotal.toFixed(1) + ' m²';
    document.getElementById('resLiquida').textContent = areaLiquida.toFixed(1) + ' m²';
    document.getElementById('resLitros').textContent  = litros.toFixed(1) + ' L';
    document.getElementById('resTipo').textContent    = tinta.name;
    document.getElementById('resRend').textContent    = `Rendimento: ${tinta.rend} m²/L · ${demaos} demão${demaos > 1 ? 's' : ''}`;

    // Sugestão de latas (algoritmo guloso: maiores primeiro)
    const latasRow = document.getElementById('latasRow');
    latasRow.innerHTML = '';
    let restante = litros;
    const latasOrdenadas = [...tinta.latas].sort((a, b) => b - a);
    const compra = {};

    latasOrdenadas.forEach(tam => {
        const qtd = Math.floor(restante / tam);
        if (qtd > 0) {
            compra[tam] = qtd;
            restante -= qtd * tam;
        }
    });

    // Arredonda para cima na menor lata disponível
    if (restante > 0.01) {
        const menor = latasOrdenadas[latasOrdenadas.length - 1];
        compra[menor] = (compra[menor] || 0) + 1;
    }

    Object.entries(compra)
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
        .forEach(([tam, qtd]) => {
            const badge = document.createElement('div');
            badge.className = 'lata-badge';
            badge.textContent = `${qtd}× ${parseFloat(tam)}L`;
            latasRow.appendChild(badge);
        });

    // Mostra resultado e scrolla até ele
    const box = document.getElementById('resultBox');
    box.classList.add('visible');
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Inicializa quando a página carregar ──
document.addEventListener('DOMContentLoaded', renderCards);
