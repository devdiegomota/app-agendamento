import {getStorage, ref, uploadBytes, getDownloadURL, setDoc, getDoc, initializeApp, getDocs, getFirestore, addDoc, doc, where, query, collection, onSnapshot, firebaseConfig } from "./firebase-config.js";

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    link.innerHTML = `
    <span><b>${service.nome}</b></span><br>
    <span>R$ ${service.valor.toFixed(2)}</span><br>
    <span>Duração: ${service.duracao} min</span>`;
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


