// Menu Mobile com animação igual à página index.html
document.addEventListener('DOMContentLoaded', function() {
    // Menu Mobile
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

    // Funcionalidade das Paletas
    const paletaCards = document.querySelectorAll('.paleta-card');
    const paletaSelecionada = document.getElementById('paletaSelecionada');
    const coresSelecionadas = document.getElementById('coresSelecionadas');
    const descricaoSelecionada = document.getElementById('descricaoSelecionada');

    paletaCards.forEach(card => {
        const btnSelecionar = card.querySelector('.btn-selecionar');
        
        btnSelecionar.addEventListener('click', function() {
            // Remove seleção anterior
            paletaCards.forEach(c => c.classList.remove('selecionada'));
            
            // Adiciona seleção ao card clicado
            card.classList.add('selecionada');
            
            // Obtém informações da paleta
            const nomePaleta = card.querySelector('h3').textContent;
            const descricao = card.querySelector('.paleta-desc').textContent;
            const cores = card.querySelectorAll('.cor-circulo');
            
            // Atualiza a seção de paleta selecionada
            coresSelecionadas.innerHTML = '';
            cores.forEach(cor => {
                const corClone = cor.cloneNode(true);
                coresSelecionadas.appendChild(corClone);
            });
            
            descricaoSelecionada.innerHTML = `<strong>${nomePaleta}:</strong> ${descricao}`;
            
            // Mostra a seção de paleta selecionada
            paletaSelecionada.style.display = 'block';
            
            // Scroll suave até a paleta selecionada
            paletaSelecionada.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
});

// Função para calcular a quantidade de tinta
function calcularTinta() {
    // Obtém os valores dos inputs
    const largura = parseFloat(document.getElementById('largura').value) || 0;
    const comprimento = parseFloat(document.getElementById('comprimento').value) || 0;
    const altura = parseFloat(document.getElementById('altura').value) || 0;
    const portas = parseInt(document.getElementById('portas').value) || 0;
    const janelas = parseInt(document.getElementById('janelas').value) || 0;
    const demãos = parseInt(document.getElementById('demãos').value) || 2;
    const rendimento = parseFloat(document.getElementById('tipoTinta').value) || 12;

    // Validação básica
    if (largura <= 0 || comprimento <= 0 || altura <= 0) {
        alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
        return;
    }

    // Cálculo da área total das paredes
    const areaParedes = 2 * (largura * altura) + 2 * (comprimento * altura);
    
    // Área das portas (aproximadamente 1.5m x 2.1m cada)
    const areaPortas = portas * 1.5 * 2.1;
    
    // Área das janelas (aproximadamente 1.2m x 1.2m cada)
    const areaJanelas = janelas * 1.2 * 1.2;
    
    // Área total a pintar (descontando portas e janelas)
    const areaPintar = areaParedes - areaPortas - areaJanelas;
    
    // Quantidade de tinta necessária (considerando demãos)
    const litrosNecessarios = (areaPintar * demãos) / rendimento;
    
    // Cálculo otimizado de latas (combinando 18L e 3,6L)
    let latas18L = Math.floor(litrosNecessarios / 18);
    let litrosRestantes = litrosNecessarios - (latas18L * 18);
    let latas36L = Math.ceil(litrosRestantes / 3.6);
    
    // Se precisar de muitas latas de 3,6L, pode ser melhor usar mais uma de 18L
    if (latas36L > 5) {
        latas18L += 1;
        litrosRestantes = litrosNecessarios - (latas18L * 18);
        latas36L = litrosRestantes > 0 ? Math.ceil(litrosRestantes / 3.6) : 0;
    }
    
    // Monta o texto das latas necessárias
    let textoLatas = '';
    if (latas18L > 0 && latas36L > 0) {
        textoLatas = `${latas18L} lata(s) de 18L + ${latas36L} lata(s) de 3,6L`;
    } else if (latas18L > 0) {
        textoLatas = `${latas18L} lata(s) de 18L`;
    } else {
        textoLatas = `${latas36L} lata(s) de 3,6L`;
    }
    
    // Atualiza os resultados na tela
    document.getElementById('areaTotal').textContent = areaParedes.toFixed(2) + ' m²';
    document.getElementById('areaPintar').textContent = areaPintar.toFixed(2) + ' m²';
    document.getElementById('quantidadeTinta').textContent = litrosNecessarios.toFixed(2) + ' L';
    document.getElementById('latasNecessarias').textContent = textoLatas;
    
    // Mostra a seção de resultado
    document.getElementById('resultado').style.display = 'block';
    
    // Scroll suave até o resultado
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para solicitar orçamento via WhatsApp
function solicitarOrcamento() {
    const largura = document.getElementById('largura').value || 'não informado';
    const comprimento = document.getElementById('comprimento').value || 'não informado';
    const altura = document.getElementById('altura').value || 'não informado';
    const areaPintar = document.getElementById('areaPintar').textContent;
    const quantidadeTinta = document.getElementById('quantidadeTinta').textContent;
    
    const mensagem = `Olá! Usei a calculadora do site e gostaria de um orçamento.%0A%0A` +
                    `*Dados do ambiente:*%0A` +
                    `Largura: ${largura}m%0A` +
                    `Comprimento: ${comprimento}m%0A` +
                    `Altura: ${altura}m%0A` +
                    `Área a pintar: ${areaPintar}%0A` +
                    `Quantidade de tinta: ${quantidadeTinta}%0A%0A` +
                    `Poderia me fazer um orçamento?`;
    
    const numeroWhatsApp = '5511955838039';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    
    window.open(urlWhatsApp, '_blank');
}