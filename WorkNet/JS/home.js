// home.js - Sistema de Feed de Serviços

// Serviços iniciais para a seção "Divulgação de Serviços"
let servicos = [
    {
        id: 1,
        titulo: 'João - Pedreiro',
        subtitulo: 'Pedreiro',
        descricao: 'Serviços de construção e reforma com qualidade garantida.',
        preco: 150.00,
        autor: 'João Silva',
        imagem: '/WorkNet/img/listing1.jpg'
    },
    {
        id: 2,
        titulo: 'Paulo - Eletricista Profissional',
        subtitulo: 'Eletricista',
        descricao: 'Instalações elétricas residenciais e comerciais.',
        preco: 120.00,
        autor: 'Paulo Santos',
        imagem: '/WorkNet/img/listing2.jpg'
    },
    {
        id: 3,
        titulo: 'Lucas - Pintor',
        subtitulo: 'Pintor',
        descricao: 'Pintura residencial e comercial com acabamento perfeito.',
        preco: 100.00,
        autor: 'Lucas Costa',
        imagem: '/Worknet/img/listing3.jpg'
    },
    {
        id: 4,
        titulo: 'Mateus - Instalador de Persianas',
        subtitulo: 'Instalador',
        descricao: 'Instalação de persianas, cortinas e box.',
        preco: 80.00,
        autor: 'Mateus Lima',
        imagem: '/Worknet/img/listing4.jpg'
    }
];

let termoBusca = '';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário está logado
    verificarLogin();
    
    // Carregar serviços do localStorage se existirem
    carregarServicos();
    
    // Renderizar serviços iniciais
    renderizarServicos();
    
    // Event Listeners
    setupEventListeners();
});

function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/WorkNet/login.html';
        return;
    }
    
    const usuario = JSON.parse(usuarioLogado);
    document.getElementById('userWelcome').textContent = `Olá, ${usuario.nome.split(' ')[0]}!`;
}

function carregarServicos() {
    const servicosStorage = localStorage.getItem('servicos');
    if (servicosStorage) {
        servicos = JSON.parse(servicosStorage);
    }
}

function salvarServicos() {
    localStorage.setItem('servicos', JSON.stringify(servicos));
}

function setupEventListeners() {
    // Botão de logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Formulário de busca
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        realizarBusca();
    });
    
    // Input de busca em tempo real
    document.getElementById('searchInput').addEventListener('input', function() {
        if (this.value === '') {
            termoBusca = '';
            renderizarServicos();
        }
    });
    
    // Cards de categoria
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoria = this.dataset.category;
            document.getElementById('searchInput').value = categoria;
            termoBusca = categoria.toLowerCase();
            renderizarServicos();
            
            // Scroll para a seção de divulgação
            document.querySelector('.service-listings').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Modal de adicionar serviço
    document.getElementById('addServiceBtn').addEventListener('click', abrirModal);
    document.getElementById('closeModal').addEventListener('click', fecharModal);
    document.getElementById('cancelModal').addEventListener('click', fecharModal);
    
    // Formulário de adicionar serviço
    document.getElementById('serviceForm').addEventListener('submit', adicionarServico);
    
    // Fechar modal ao clicar fora
    document.getElementById('serviceModal').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModal();
        }
    });
}

function realizarBusca() {
    termoBusca = document.getElementById('searchInput').value.toLowerCase().trim();
    renderizarServicos();
    
    // Scroll para a seção de divulgação se houver busca
    if (termoBusca) {
        document.querySelector('.service-listings').scrollIntoView({ behavior: 'smooth' });
    }
}

function renderizarServicos() {
    const grid = document.getElementById('servicesGrid');
    const noResults = document.getElementById('noResults');
    
    // Filtrar serviços por busca
    let servicosFiltrados = servicos;
    
    if (termoBusca) {
        servicosFiltrados = servicosFiltrados.filter(s => 
            s.titulo.toLowerCase().includes(termoBusca) ||
            s.subtitulo.toLowerCase().includes(termoBusca) ||
            s.descricao.toLowerCase().includes(termoBusca) ||
            s.autor.toLowerCase().includes(termoBusca)
        );
    }
    
    // Mostrar ou ocultar mensagem de "sem resultados"
    if (servicosFiltrados.length === 0) {
        noResults.style.display = 'block';
        grid.innerHTML = '';
        return;
    } else {
        noResults.style.display = 'none';
    }
    
    // Renderizar cards
    grid.innerHTML = servicosFiltrados.map(servico => `
        <figure class="listing-card">
            <img src="${servico.imagem}" alt="${servico.titulo}">
            <figcaption>
                <header>
                    <h3>${servico.titulo}</h3>
                    <p class="listing-subtitle">${servico.subtitulo}</p>
                </header>
                <p>${servico.descricao}</p>
                <footer>
                    <span class="listing-price">R$ ${servico.preco.toFixed(2)}</span>
                    <span class="listing-author">Por ${servico.autor}</span>
                </footer>
            </figcaption>
        </figure>
    `).join('');
}

function abrirModal() {
    document.getElementById('serviceModal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('serviceModal').style.display = 'none';
    document.getElementById('serviceForm').reset();
}

function adicionarServico(e) {
    e.preventDefault();
    
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    const usuario = JSON.parse(usuarioLogado);
    
    const novoServico = {
        id: servicos.length > 0 ? Math.max(...servicos.map(s => s.id)) + 1 : 1,
        titulo: document.getElementById('serviceTitle').value,
        subtitulo: document.getElementById('serviceCategory').value,
        descricao: document.getElementById('serviceDescription').value,
        preco: parseFloat(document.getElementById('servicePrice').value),
        autor: usuario.nome,
        imagem: '/WorkNet/img/default-service.jpg'
    };
    
    servicos.unshift(novoServico);
    salvarServicos();
    
    alert('Serviço publicado com sucesso!');
    fecharModal();
    renderizarServicos();
}

function logout() {
    const confirmar = confirm('Deseja realmente sair?');
    if (confirmar) {
        localStorage.removeItem('usuarioLogado');
        sessionStorage.removeItem('usuarioLogado');
        alert('Logout realizado com sucesso!');
        window.location.href = '/WorkNet/login.html';
    }
}

// Tornar funções globais
window.logout = logout;