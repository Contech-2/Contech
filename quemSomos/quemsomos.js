let menu = document.getElementById("menu")
let iconeBarras = document.getElementById("icone-barras")
let iconeX = document.getElementById("icone-x")

function abreFechaMenu() {
    // Menu fechado - tem a classe menu-fechado
    // Menu aberto - não tem a classe menu-fechado

    // Alterna a classe menu-fechado
    // menu.classList.toggle("menu-fechado")


    if (menu.classList.contains("menu-fechado")) {
        // Abrir o menu - remover a classe menu-fechado
        menu.classList.remove("menu-fechado")

        // Esconder icone barras
        iconeBarras.style.display = "none"

        // Mostrar o icone do X
        iconeX.style.display = "inline"

    }

    else {
        // Fechar o menu - adicionar a classe menu-fechado
        menu.classList.add("menu-fechado")

        // Esconder icone do X
        iconeX.style.display = "none"

        // Mostrar o icone barras
        iconeBarras.style.display = "inline"
    }
}

onresize = () => {
    // Abrir o menu - remover a classe menu-fechado
    menu.classList.remove("menu-fechado")

    // Esconder icone barras
    iconeBarras.style.display = "none"

    // Mostrar o icone do X
    iconeX.style.display = "inline"
}




function alternarTema() {
    const body = document.body;
    
    // Alterna a classe 'dark-mode' no body
    body.classList.toggle('dark-mode');
    
    // (Opcional) Salva a preferência no navegador
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('tema', isDarkMode ? 'dark' : 'light');
}

// Verifica a preferência salva ao carregar a página
window.onload = function() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') {
        document.body.classList.add('dark-mode');
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
    inputUsuario.placeholder = "Techo está digitando...";
    await new Promise(r => setTimeout(r, 1500));
    
    let resposta = "";
    const textoLower = texto.toLowerCase();

    if (textoLower.includes("tributo") || textoLower.includes("imposto")) {
        resposta = "Ótima pergunta! **Tributos** é o gênero geral, e **Impostos** (como IR, ICMS) são uma espécie de tributo pagos ao governo.";
    } else if (textoLower.includes("balanço")) {
        resposta = "O **Balanço Patrimonial** é como uma **foto** 📸 da saúde financeira da sua empresa.";
    } else if (textoLower.includes("dre")) {
        resposta = "O **DRE** é como um **filme** 🎬 das finanças. Ele mostra se você teve **Lucro** ou **Prejuízo**.";
    } else if (textoLower.includes("fluxo")) {
        resposta = "O **Fluxo de Caixa** controla o dinheiro que entra e sai. Dica: tente receber à vista!";
    } else {
        resposta = `Entendi! Você disse: "**${texto}**". Como sou um protótipo, ainda estou aprendendo sobre isso!`;
    }
    
    adicionarMensagem(resposta, 'bot');
    
    inputUsuario.disabled = false;
    inputUsuario.placeholder = "Digite sua mensagem...";
    inputUsuario.focus();
}

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
}