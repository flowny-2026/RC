// Menu hamburger toggle
// Adicione este código ao arquivo script.js para garantir que o menu hambúrguer funcione
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Adiciona classe ao body para prevenir rolagem quando menu está aberto
            document.body.classList.toggle('menu-open');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
});


// ══════════════════════════════════════════════════════════════
// CALCULADORA DE TINTA
// ══════════════════════════════════════════════════════════════

// Dados dos tipos de tinta
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

// Renderiza os cards de tinta
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

// Seleciona um tipo de tinta
function selectPaint(id) {
    selectedPaint = id;
    document.querySelectorAll('.paint-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.id === id);
    });
}

// Cálculo principal
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

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCards);
} else {
    renderCards();
}


// ══════════════════════════════════════════════════════════════
// FILTRO DE PORTFÓLIO
// ══════════════════════════════════════════════════════════════

// Função para inicializar o filtro de portfólio
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length === 0 || portfolioItems.length === 0) return;

    // Mostrar apenas residencial ao carregar a página
    portfolioItems.forEach(item => {
        if (item.dataset.category === 'residencial') {
            item.classList.add('show');
        } else {
            item.classList.remove('show');
        }
    });

    // Adicionar event listeners aos botões
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.dataset.filter;

            // Remove active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona active ao botão clicado
            this.classList.add('active');

            // Filtra os itens
            portfolioItems.forEach(item => {
                if (item.dataset.category === filterValue) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });
        });
    });
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioFilter);
} else {
    initPortfolioFilter();
}



// ══════════════════════════════════════════════════════════════
// FORMULÁRIO DE CONTATO - WEB3FORMS
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Desabilita o botão durante o envio
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            // Coleta os dados do formulário
            const formData = new FormData(form);

            try {
                // Envia para o Web3Forms
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Sucesso
                    formMessage.style.display = 'block';
                    formMessage.style.backgroundColor = '#d4edda';
                    formMessage.style.color = '#155724';
                    formMessage.style.border = '1px solid #c3e6cb';
                    formMessage.innerHTML = '<i class="fas fa-check-circle"></i> Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    
                    // Limpa o formulário
                    form.reset();
                    
                    // Esconde a mensagem após 5 segundos
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                } else {
                    // Erro
                    throw new Error('Erro ao enviar formulário');
                }
            } catch (error) {
                // Erro
                formMessage.style.display = 'block';
                formMessage.style.backgroundColor = '#f8d7da';
                formMessage.style.color = '#721c24';
                formMessage.style.border = '1px solid #f5c6cb';
                formMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erro ao enviar mensagem. Por favor, tente novamente.';
            } finally {
                // Reabilita o botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Solicitar Orçamento Gratuito';
            }
        });
    }
});
