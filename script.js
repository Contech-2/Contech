
let menu = document.getElementById("menu");
let iconeBarras = document.getElementById("icone-barras");
let iconeX = document.getElementById("icone-x");

function abreFechaMenu() {
    if (menu.classList.contains("menu-fechado")) {
        menu.classList.remove("menu-fechado");
        iconeBarras.style.display = "none";
        iconeX.style.display = "inline";
    } else {
        menu.classList.add("menu-fechado");
        iconeX.style.display = "none";
        iconeBarras.style.display = "inline";
    }
}

onresize = () => {
    menu.classList.remove("menu-fechado");
    iconeBarras.style.display = "none";
    iconeX.style.display = "inline";
}

function alternarTema() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('tema', isDarkMode ? 'dark' : 'light');
}

window.onload = function() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function Contatar(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button');
    const textoOriginal = btn.innerText;
    btn.innerText = 'Enviando...';

    const templateParams = {
        nome: document.getElementById('campo-nome').value,
        email: document.getElementById('campo-email').value,
        telefone: `(${document.getElementById('ddd').value}) ${document.getElementById('telefone').value}`,
        mensagem: document.getElementById('campo-texto').value
    };

    const serviceID = 'service_hmfbmmb';
    const templateID = 'template_hl0mhn3';

    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            console.log('SUCESSO!', response.status, response.text);
            alert('Mensagem enviada com sucesso!');
            event.target.reset();
            btn.innerText = textoOriginal;
        }, function(error) {
            console.log('FALHA...', error);
            alert('Ocorreu um erro ao enviar. Verifique o console para detalhes.');
            btn.innerText = textoOriginal;
        });
}

const iconeTekFechado = document.getElementById('icone-tek-fechado');
const containerChatbot = document.getElementById('container-chatbot');
const cabecalhoChatbot = document.getElementById('cabecalho-chatbot');

const cabecalhoEstadoInicial = document.getElementById('cabecalho-estado-inicial');
const cabecalhoEstadoChat = document.getElementById('cabecalho-estado-chat');

const elementosBoasVindas = document.getElementById('elementos-boasvindas');
const corpoChat = document.getElementById('corpo-chat');

const inputUsuario = document.getElementById('input-usuario');
const botaoEnviar = document.getElementById('botao-enviar');
const botoesCategoria = document.querySelectorAll('.botao-categoria');

const URL_MASCOTE_TEKINHO = "img/cabeca.png"; 
const URL_ICONE_USUARIO = "img/icone usuario.png"; 
const URL_VIDEO = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; 

let chatIniciado = false;

function abrirChatbot() {
    iconeTekFechado.style.display = 'none';
    containerChatbot.classList.remove('fechado');

    // Reseta visual para o estado inicial
    chatIniciado = false;
    elementosBoasVindas.classList.remove('escondido');
    cabecalhoChatbot.classList.remove('modo-chat');
    cabecalhoEstadoInicial.classList.remove('escondido');
    cabecalhoEstadoChat.classList.add('escondido');

    corpoChat.innerHTML = '';
    
    // Mensagens de saudação (Fixas)
    adicionarMensagem("Olá, Eu sou o Techo!", 'bot');
    adicionarMensagem("O que quer saber?", 'bot');

    inputUsuario.focus();
}

function fecharChatbot() {
    containerChatbot.classList.add('fechado');
    setTimeout(() => {
        iconeTekFechado.style.display = 'block';
    }, 300);
}

function minimizarChatbot() {
    fecharChatbot();
}

function mostrarVideo() {
    window.open(URL_VIDEO, '_blank');
}

function iniciarModoChatCompleto() {
    if (chatIniciado) return;
    chatIniciado = true;

    elementosBoasVindas.classList.add('escondido');
    cabecalhoChatbot.classList.add('modo-chat');
    cabecalhoEstadoInicial.classList.add('escondido');
    cabecalhoEstadoChat.classList.remove('escondido');
}

function adicionarMensagem(texto, remetente) {
    const divMensagem = document.createElement('div');
    
    // Formatação de texto (Negrito e Itálico)
    let textoFormatado = texto
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Converte **texto** para Negrito
        .replace(/\*(.*?)\*/g, '<i>$1</i>')     // Converte *texto* para Itálico
        .replace(/\n/g, '<br>');                // Quebra de linha

    let iconeHTML = '';
    if (remetente === 'bot') {
        divMensagem.classList.add('mensagem-bot');
        iconeHTML = `<img src="${URL_MASCOTE_TEKINHO}" alt="Tekinho" class="icone-mensagem-bot">`;
        divMensagem.innerHTML = `${iconeHTML} <span>${textoFormatado}</span>`;
    } else {
        divMensagem.classList.add('mensagem-usuario');
        iconeHTML = `<img src="${URL_ICONE_USUARIO}" alt="Você" class="icone-mensagem-usuario">`;
        divMensagem.innerHTML = `<span>${textoFormatado}</span> ${iconeHTML}`;
    }

    corpoChat.appendChild(divMensagem);
    corpoChat.scrollTop = corpoChat.scrollHeight;
}

/**
 * FUNÇÃO PRINCIPAL: Conecta com a API do Gemini
 */
async function processarMensagem(texto) {
    if (!texto.trim()) return;

    // 1. Muda visual para o chat completo
    iniciarModoChatCompleto();

    // 2. Adiciona mensagem do usuário na tela
    adicionarMensagem(texto, 'user');
    inputUsuario.value = '';
    
    // 3. Trava input e mostra estado de carregamento
    inputUsuario.disabled = true;
    botaoEnviar.disabled = true;
    inputUsuario.placeholder = "Techo está digitando...";
    
    try {
        // --- CONEXÃO COM A API ---
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: texto })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        
        // 4. Recebe a resposta da IA e mostra na tela
        adicionarMensagem(data.reply, 'bot');

    } catch (error) {
        console.error("Erro detalhado:", error);
        adicionarMensagem("Desculpe, estou com problemas de conexão agora. Tente recarregar a página! 🔌", 'bot');
    } finally {
        // 5. Destrava o chat
        inputUsuario.disabled = false;
        botaoEnviar.disabled = false;
        inputUsuario.placeholder = "Digite sua mensagem...";
        inputUsuario.focus();
    }
}

// --- Event Listeners ---

// Botão Enviar
botaoEnviar.addEventListener('click', () => {
    processarMensagem(inputUsuario.value);
});

// Tecla Enter
inputUsuario.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        processarMensagem(inputUsuario.value);
    }
});

// Botões de Categoria
botoesCategoria.forEach(btn => {
    btn.addEventListener('click', () => {
        let texto = btn.getAttribute('data-prompt');
        processarMensagem(texto);
    });
});