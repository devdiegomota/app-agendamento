import { initializeApp, getDocs, getDoc, deleteDoc, setDoc, doc, getFirestore, addDoc, updateDoc, where, query, collection, onSnapshot, firebaseConfig } from "./firebase-config.js";


// Inicializar Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Referência para o container
const dropdownContainer = document.getElementById("dropdown-container");

// Função para criar dropdown
function createDropdown(category, services, categoryDocId) {
  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");

  // Botão do dropdown
  const button = document.createElement("button");
  button.classList.add("dropdown-button");
  button.innerHTML = `${category} <img src="img/setadrop.png" alt="Abrir menu">`;

  // Botão de deletar categoria
  const deleteCategoryButton = document.createElement("button");
  deleteCategoryButton.textContent = "Deletar Categoria";
  deleteCategoryButton.classList.add("delete-category-button");
  

  deleteCategoryButton.addEventListener("click", async () => {
    if (confirm(`Deseja realmente deletar a categoria "${category}" e todos os serviços associados?`)) {
      try {
        await deleteCategory(categoryDocId);
        alert(`Categoria "${category}" deletada com sucesso.`);
      } catch (error) {
        console.error("Erro ao deletar a categoria:", error);
        alert("Ocorreu um erro ao tentar deletar a categoria.");
      }
    }
  });

  dropdown.appendChild(button);
  dropdown.appendChild(deleteCategoryButton); // Adiciona o botão de deletar categoria

  // Conteúdo do dropdown
  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  // Adicionar serviços como links no dropdown
  Object.keys(services).forEach(serviceId => {
    const service = services[serviceId];

    // Container para o serviço e o botão de deletar
    const serviceContainer = document.createElement("div");
    serviceContainer.classList.add("service-container");

    // Link do serviço
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = `${service.nome} - R$ ${service.valor.toFixed(2)}`;
    serviceContainer.appendChild(link);

    // Botão de deletar serviço
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Deletar";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", async () => {
      if (confirm(`Deseja realmente deletar o serviço "${service.nome}"?`)) {
        try {
          await deleteService(categoryDocId, serviceId);
          alert(`Serviço "${service.nome}" deletado com sucesso.`);
        } catch (error) {
          console.error("Erro ao deletar o serviço:", error);
          alert("Ocorreu um erro ao tentar deletar o serviço.");
        }
      }
    });

    serviceContainer.appendChild(deleteButton);
    dropdownContent.appendChild(serviceContainer);
  });

  dropdown.appendChild(dropdownContent);
  return dropdown;
}


async function deleteCategory(categoryDocId) {
  try {
    const categoryDocRef = doc(db, "servicos", categoryDocId);
    await deleteDoc(categoryDocRef);
    alert("Categoria deletada com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar a categoria:", error);
    throw new Error("Não foi possível deletar a categoria.");
  }
}

// Função para deletar um serviço do Firestore
async function deleteService(categoryDocId, serviceId) {
  const categoryDocRef = doc(db, "servicos", categoryDocId);

  // Obter o snapshot do documento
  const categoryDocSnapshot = await getDoc(categoryDocRef);

  if (categoryDocSnapshot.exists()) {
    const currentData = categoryDocSnapshot.data();
    const services = currentData.services || {};

    // Verificar se o serviço existe antes de tentar deletar
    if (services[serviceId]) {
      delete services[serviceId];

      // Atualizar o documento no Firestore
      await updateDoc(categoryDocRef, { services });
    } else {
      throw new Error(`Serviço com ID "${serviceId}" não encontrado.`);
    }
  } else {
    throw new Error(`Categoria com ID "${categoryDocId}" não encontrada.`);
  }
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
    const services = data.services || {}; // Serviços (map)
    const categoryDocId = doc.id; // ID do documento

    // Criar dropdown e adicionar ao container
    const dropdown = createDropdown(category, services, categoryDocId);
    dropdownContainer.appendChild(dropdown);
  });
});

// Cria um Botão flutuante com link no inicio da tela
const floatingButton = document.getElementById("floating-button");
const addServiceLink = document.getElementById("add-service-link");

floatingButton.addEventListener("click", () => {
  if (addServiceLink.style.display === "none") {
    addServiceLink.style.display = "block";
  } else {
    addServiceLink.style.display = "none";
  }
});
