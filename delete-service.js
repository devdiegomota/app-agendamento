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
  button.addEventListener("click", () => {
    dropdownContent.classList.toggle("show"); // Alterna a classe "show"
  });

  // Botão de deletar categoria
  const deleteCategoryButton = document.createElement("button");
  deleteCategoryButton.textContent = "Deletar";
  deleteCategoryButton.classList.add("botao-two");

  // Eventos do botao deletar categoria
  deleteCategoryButton.addEventListener("click", () => {
    const modal = document.getElementById("deleteCategoryModal");
    const message = document.getElementById("deleteCategoryMessage");
    const feedback = document.getElementById("deleteCategoryFeedback");
    const confirmButton = document.getElementById("deleteCategoryConfirm");
    const cancelButton = document.getElementById("deleteCategoryCancel");

    // Atualiza a mensagem do modal
    message.textContent = `Deseja realmente deletar a categoria "${category}" e todos os serviços associados?`;

    // Limpa qualquer mensagem de feedback anterior
    feedback.textContent = "";

    // Mostra o modal
    modal.style.display = "block";

    // Função para confirmar a exclusão
    const confirmAction = async () => {
      try {
        await deleteCategory(categoryDocId);
        message.textContent = `Categoria "${category}" deletada com sucesso.`;
        setTimeout(() => {
          modal.style.display = "none"; // Fecha o modal após exibir o sucesso
        }, 1000);
      } catch (error) {
        feedback.style.marginBottom = "15px"
        console.error("Erro ao deletar a categoria:", error);
        feedback.style.color = "red";
        feedback.textContent = "Erro ao tentar deletar a categoria. Me avise o quanto antes por favor!.";
      }
    };

    // Lida com o botão "Sim"
    confirmButton.onclick = confirmAction;

    // Lida com o botão "Não"
    cancelButton.onclick = () => {
      modal.style.display = "none"; // Fecha o modal
    };
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
    link.innerHTML = `
    <span>${service.nome}</span><br>
    <span>R$ ${service.valor.toFixed(2)}</span><br>
    <span>Duração: ${service.duracao} min</span>`;



    serviceContainer.appendChild(link);

    // Cria o botão de deletar serviço
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Deletar";
    deleteButton.classList.add("botao-two");

    deleteButton.addEventListener("click", () => {
      const modal = document.getElementById("deleteServiceModal");
      const message = document.getElementById("deleteServiceMessage");
      const feedback = document.getElementById("deleteServiceFeedback");
      const confirmButton = document.getElementById("deleteServiceConfirm");
      const cancelButton = document.getElementById("deleteServiceCancel");

      // Atualiza a mensagem do modal
      message.textContent = `Deseja realmente deletar o serviço "${service.nome}"?`;

      // Limpa qualquer mensagem de feedback anterior
      feedback.textContent = "";

      // Mostra o modal
      modal.style.display = "block";

      // Função para confirmar a exclusão
      const confirmAction = async () => {
        try {
          await deleteService(categoryDocId, serviceId);
          message.textContent = `Serviço "${service.nome}" deletado com sucesso.`;
          setTimeout(() => {
            modal.style.display = "none"; // Fecha o modal após exibir sucesso
          }, 2000);
        } catch (error) {
          console.error("Erro ao deletar o serviço:", error);
          feedback.style.color = "red";
          feedback.textContent = "Ocorreu um erro ao tentar deletar o serviço. Verifique o console para mais detalhes.";
        }
      };

      // Lida com o botão "Sim"
      confirmButton.onclick = confirmAction;

      // Lida com o botão "Não"
      cancelButton.onclick = () => {
        modal.style.display = "none"; // Fecha o modal
      };
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

  } catch (error) {
    console.error("Erro ao deletar a categoria:", error);
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

