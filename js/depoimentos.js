// Script para controlar o slider de depoimentos com animações
document.addEventListener('DOMContentLoaded', function() {
    // Selecionar todos os depoimentos
    const depoimentos = document.querySelectorAll('.depoimento');
    const totalDepoimentos = depoimentos.length;
    let currentIndex = 0;
    let isAnimating = false;
    
    // Inicializar: esconder todos os depoimentos exceto o primeiro
    depoimentos.forEach((depoimento, index) => {
        if (index === 0) {
            depoimento.classList.add('active');
        } else {
            depoimento.classList.add('inactive');
        }
    });
    
    // Função para mostrar o depoimento com animação
    function showDepoimento(newIndex) {
        if (isAnimating || newIndex === currentIndex) return;
        
        isAnimating = true;
        
        // Esconder o depoimento atual com animação
        depoimentos[currentIndex].classList.remove('active');
        depoimentos[currentIndex].classList.add('exit');
        
        setTimeout(() => {
            depoimentos[currentIndex].classList.add('inactive');
            depoimentos[currentIndex].classList.remove('exit');
            
            // Mostrar o novo depoimento com animação
            depoimentos[newIndex].classList.remove('inactive');
            depoimentos[newIndex].classList.add('active');
            
            // Atualizar indicadores
            updateIndicators(newIndex);
            
            currentIndex = newIndex;
            isAnimating = false;
        }, 700); // Tempo da animação
    }
    
    // Função para avançar para o próximo depoimento
    function nextDepoimento() {
        const newIndex = (currentIndex + 1) % totalDepoimentos;
        showDepoimento(newIndex);
    }
    
    // Função para voltar ao depoimento anterior
    function prevDepoimento() {
        const newIndex = (currentIndex - 1 + totalDepoimentos) % totalDepoimentos;
        showDepoimento(newIndex);
    }
    
    // Adicionar botões de navegação e indicadores
    const depoimentosContainer = document.querySelector('.depoimentos-slider');
    if (depoimentosContainer) {
        // Criar botões de navegação
        const navButtons = document.createElement('div');
        navButtons.className = 'slider-nav';
        navButtons.innerHTML = `
            <button class="prev-btn"><i class="fas fa-chevron-left"></i></button>
            <button class="next-btn"><i class="fas fa-chevron-right"></i></button>
        `;
        
        // Criar indicadores
        const indicators = document.createElement('div');
        indicators.className = 'slider-indicators';
        
        for (let i = 0; i < totalDepoimentos; i++) {
            const indicator = document.createElement('div');
            indicator.className = i === 0 ? 'indicator active' : 'indicator';
            indicator.dataset.index = i;
            indicators.appendChild(indicator);
        }
        
        // Adicionar ao DOM
        depoimentosContainer.parentNode.appendChild(navButtons);
        depoimentosContainer.parentNode.appendChild(indicators);
        
        // Adicionar eventos aos botões
        document.querySelector('.prev-btn').addEventListener('click', prevDepoimento);
        document.querySelector('.next-btn').addEventListener('click', nextDepoimento);
        
        // Adicionar eventos aos indicadores
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showDepoimento(index);
            });
        });
    }
    
    // Função para atualizar os indicadores
    function updateIndicators(activeIndex) {
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Avançar automaticamente a cada 5 segundos
    setInterval(nextDepoimento, 5000);
});