import { getStorage, ref, uploadBytes, getDownloadURL, setDoc, getDoc, initializeApp, getDocs, getFirestore, addDoc, doc, where, query, collection, onSnapshot, firebaseConfig } from "./firebase-config.js";
import { dadosform } from "./formulario.js";
import { validarCampos } from "./formulario.js";
import { Modal } from "./modal.js";

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let dataSelecionada = null;
let horarioSelecionado = null;

// SEÇÃO IMAGEM DE PERFIL BARBEIRO DA PAGINA

// Seletores do DOM
const profileCircle = document.getElementById('profileCircle');
const profileImage = document.getElementById('profileImage');

// ID do usuário (simulado aqui, use autenticação real em um app completo)
const userId = "user123";

// Carrega a imagem do perfil ao carregar a página
async function loadProfileImage() {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.profileImageUrl) {
        profileImage.src = data.profileImageUrl;
      }
    }
  } catch (error) {
    console.error("Erro ao carregar a imagem de perfil:", error);
  }
}

// Chama a função para carregar a imagem do perfil ao inicializar
loadProfileImage();

//FIM SEÇÃO IMAGEM PERFIL

// Função para obter o valor de um parâmetro da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Capturar os parâmetros nome e valor do serviço
  const serviceName = getQueryParam("servico");
  const serviceValue = getQueryParam("valor");
  
  // Exibir o nome e o valor do serviço na página
  if (serviceName && serviceValue) {
    document.getElementById("service-name").textContent = `Você escolheu: ${decodeURIComponent(serviceName)}`;
    document.getElementById("service-value").textContent = `Valor: R$ ${parseFloat(serviceValue).toFixed(2)}`;
  } else {
    document.getElementById("service-name").textContent = "Nenhum serviço selecionado.";
    document.getElementById("service-value").textContent = "";
  }
  

//Função para criar datas
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
            const tituloHorario = document.getElementById('titulo-horario')

            selecionarData(item);
            tituloHorario.style.display = "block"
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
    const nome = dadosform().nome
    const telefone = dadosform().telefone

    try {
        await addDoc(collection(db, "agendamentos"), { data, horario, nome, telefone, servico: serviceName, valor: serviceValue });
        //alert("Agendamento salvo com sucesso!");
        Modal()
        dataSelecionada = null;
        horarioSelecionado = null;  
        verificarSePodeSalvar();
    } catch (error) {
        console.error("Erro ao salvar agendamento:", error);
    }
}

// Evento do botão salvar
document.getElementById("btnSalvar").addEventListener("click", () => {
    if (dataSelecionada && horarioSelecionado && validarCampos()) {
        salvarAgendamento(dataSelecionada, horarioSelecionado); 

    }
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    criarDatas("date-container");
});
