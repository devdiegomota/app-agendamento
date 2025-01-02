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
  dropdown.appendChild(button);

  // Conteúdo do dropdown
  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  // Adicionar serviços como links no dropdown
  Object.keys(services).forEach(key => {
    const service = services[key];
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = `${service.nome} - R$ ${service.valor}`;
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


