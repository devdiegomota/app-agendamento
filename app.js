import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, query, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC6CNIyYzP5jjwih2_AagpP3zsmzqxEPVo",
    authDomain: "agendamento-2974c.firebaseapp.com",
    projectId: "agendamento-2974c",
    storageBucket: "agendamento-2974c.firebasestorage.app",
    messagingSenderId: "180079994438",
    appId: "1:180079994438:web:3322290845c5c625128c47",
    measurementId: "G-JQ31P0VMG8"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let dataSelecionada = null;
let horarioSelecionado = null;

//criar datas
function criarDatas(containerId, diasAdiante = 15) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contêiner com ID "${containerId}" não encontrado.`);
        return;
    }

    container.innerHTML = ""; // Limpa conteúdo existente
    const fragment = document.createDocumentFragment();
    const dataAtual = new Date();

    for (let i = 0; i <= diasAdiante; i++) {
        const data = new Date(dataAtual);
        data.setDate(dataAtual.getDate() + i);

        const item = document.createElement("div");
        item.className = "item";
        item.textContent = data.toLocaleDateString("pt-BR");
        item.dataset.date = data.toISOString().split("T")[0];
        item.setAttribute("aria-label", `Data: ${data.toLocaleDateString("pt-BR")}`);

        item.addEventListener("click", () => {
            selecionarData(item);
        });

        fragment.appendChild(item);
    }

    container.appendChild(fragment);
}

// Função para criar horários no DOM
function criarHorarios(container, data) {
    container.innerHTML = "";
    container.classList.add("active");

    const inicio = new Date();
    inicio.setHours(8, 0, 0, 0);

    const fim = new Date();
    fim.setHours(18, 0, 0, 0);

    while (inicio <= fim) {
        const item = document.createElement("div");
        item.className = "item";
        item.textContent = `${inicio.getHours()}:${inicio.getMinutes().toString().padStart(2, "0")}`;
        item.dataset.time = inicio.toISOString();

        item.addEventListener("click", () => {
            if (!item.classList.contains("disabled")) {
                selecionarHorario(item);
            }
        });

        container.appendChild(item);
        inicio.setMinutes(inicio.getMinutes() + 30);
    }

    carregarHorariosReservados(container, data);
}

// Função para carregar horários reservados do Firebase
async function carregarHorariosReservados(container, data) {
    try {
        const q = query(collection(db, "agendamentos"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            const agendamento = doc.data();
            if (agendamento.data === data) {
                const timeItem = container.querySelector(`[data-time='${agendamento.horario}']`);
                if (timeItem) {
                    timeItem.classList.add("disabled");
                }
            }
        });
    } catch (error) {
        console.error("Erro ao carregar horários reservados:", error);
    }
}

// Função para selecionar uma data
function selecionarData(item) {
    const dateItems = document.querySelectorAll("[data-date]");
    dateItems.forEach(dateItem => dateItem.classList.remove("selected"));

    dataSelecionada = item.dataset.date;
    item.classList.add("selected");

    const horariosContainer = document.getElementById("time-container");
    criarHorarios(horariosContainer, dataSelecionada);
    verificarSePodeSalvar();
}

// Função para selecionar um horário
function selecionarHorario(item) {
    const timeItems = document.querySelectorAll("[data-time]");
    timeItems.forEach(timeItem => timeItem.classList.remove("selected"));

    horarioSelecionado = item.dataset.time;
    item.classList.add("selected");

    verificarSePodeSalvar();
}

// Função para verificar se o botão de salvar deve ser habilitado
function verificarSePodeSalvar() {
    const btnSalvar = document.getElementById("btnSalvar");
    btnSalvar.disabled = !(dataSelecionada && horarioSelecionado);
}

// Função para salvar agendamento no Firebase
async function salvarAgendamento(data, horario) {
    try {
        await addDoc(collection(db, "agendamentos"), { data, horario });
        alert("Agendamento salvo com sucesso!");
        dataSelecionada = null;
        horarioSelecionado = null;
        verificarSePodeSalvar();
    } catch (error) {
        console.error("Erro ao salvar agendamento:", error);
    }
}

// Evento do botão salvar
document.getElementById("btnSalvar").addEventListener("click", () => {
    if (dataSelecionada && horarioSelecionado) {
        salvarAgendamento(dataSelecionada, horarioSelecionado);
    }
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    criarDatas("date-container");
});
