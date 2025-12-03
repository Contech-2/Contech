
let menu = document.getElementById("menu")
let iconeBarras = document.getElementById("icone-barras")
let iconeX = document.getElementById("icone-x")

function abreFechaMenu() {
    if (menu.classList.contains("menu-fechado")) {
        menu.classList.remove("menu-fechado")
        iconeBarras.style.display = "none"
        iconeX.style.display = "inline"
    } else {
        menu.classList.add("menu-fechado")
        iconeX.style.display = "none"
        iconeBarras.style.display = "inline"
    }
}

onresize = () => {
    menu.classList.remove("menu-fechado")
    iconeBarras.style.display = "none"
    iconeX.style.display = "inline"
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

    chatIniciado = false;
    elementosBoasVindas.classList.remove('escondido');
    cabecalhoChatbot.classList.remove('modo-chat');
    cabecalhoEstadoInicial.classList.remove('escondido');
    cabecalhoEstadoChat.classList.add('escondido');

    corpoChat.innerHTML = '';
    
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
    
    let iconeHTML = '';
    if (remetente === 'bot') {
        divMensagem.classList.add('mensagem-bot');
        iconeHTML = `<img src="${URL_MASCOTE_TEKINHO}" alt="Tekinho" class="icone-mensagem-bot">`;
        divMensagem.innerHTML = `${iconeHTML} <span>${texto}</span>`;
    } else {
        divMensagem.classList.add('mensagem-usuario');
        iconeHTML = `<img src="${URL_ICONE_USUARIO}" alt="Você" class="icone-mensagem-usuario">`;
        divMensagem.innerHTML = `<span>${texto}</span> ${iconeHTML}`;
    }

    corpoChat.appendChild(divMensagem);
    corpoChat.scrollTop = corpoChat.scrollHeight;
}

async function processarMensagem(texto) {
    if (!texto.trim()) return;

    iniciarModoChatCompleto();

    adicionarMensagem(texto, 'user');
    inputUsuario.value = '';
    
    inputUsuario.disabled = true;
    botaoEnviar.disabled = true;
    inputUsuario.placeholder = "Techo está pensando...";
    
    try {
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
        
        adicionarMensagem(data.reply, 'bot');

    } catch (error) {
        console.error("Erro detalhado:", error);
        adicionarMensagem("Desculpe, estou com problemas de conexão agora. Tente recarregar a página! 🔌", 'bot');
    } finally {
        inputUsuario.disabled = false;
        botaoEnviar.disabled = false;
        inputUsuario.placeholder = "Digite sua mensagem...";
        inputUsuario.focus();
    }
}

// Event Listeners
botaoEnviar.addEventListener('click', () => processarMensagem(inputUsuario.value));

inputUsuario.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processarMensagem(inputUsuario.value);
});

botoesCategoria.forEach(btn => {
    btn.addEventListener('click', () => {
        let texto = btn.getAttribute('data-prompt');
        processarMensagem(texto);
    });
});

botaoEnviar.addEventListener('click', () => {
    console.log("O botão foi clicado!"); 
    alert("Teste: O botão funciona!");  
    processarMensagem(inputUsuario.value);
});