import { initializeApp, getDocs, getFirestore, addDoc, where, query, collection, onSnapshot, firebaseConfig } from "./firebase-config.js";

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência para o container
const dropdownContainer = document.getElementById("dropdown-container");

// Função para criar dropdown
function createDropdown(category, services) {
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");

  // Botão do dropdown
  const button = document.createElement("button");
  button.classList.add("dropdown-button");
  button.innerHTML = `${category} <img src="img/setadrop.png" alt="Abrir menu">`;
  //teste
  button.addEventListener("click", () => {
    dropdownContent.classList.toggle("show"); // Alterna a classe "show"
  });  
  dropdown.appendChild(button);

  // Conteúdo do dropdown
  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  // Adicionar serviços como links no dropdown
  Object.keys(services).forEach(key => {
    const service = services[key];
    const link = document.createElement("a");
    link.href = `agendar.html?servico=${encodeURIComponent(service.nome)}&valor=${encodeURIComponent(service.valor)}`;
    link.textContent = `${service.nome} - R$ ${service.valor.toFixed(2)}`;
    dropdownContent.appendChild(link);

  });

  dropdown.appendChild(dropdownContent);
  return dropdown;
}

// Listener para dados do Firestore
const servicosRef = collection(db, "servicos");
onSnapshot(servicosRef, snapshot => {
  // Limpar container
  dropdownContainer.innerHTML = "";

  // Iterar pelos documentos
  snapshot.forEach(doc => {
    const data = doc.data();
    const category = data.category; // Categoria
    const services = data.services || {}; // Serviços (map com nome e valor)

    // Criar dropdown e adicionar ao container
    const dropdown = createDropdown(category, services);
    dropdownContainer.appendChild(dropdown);
  });
});

// Cria um Botão flutuante com link no início da tela
const floatingButton = document.getElementById("floating-button");
const addServiceLink = document.getElementById("add-service-link");

// Alterna a visibilidade do link
floatingButton.addEventListener("click", () => {
  if (addServiceLink.classList.contains("show")) {
    addServiceLink.classList.remove("show");
  } else {
    addServiceLink.classList.add("show");
  }
});


