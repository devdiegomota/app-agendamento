import { initializeApp, getDocs, getDoc, setDoc, doc, getFirestore, addDoc, updateDoc, where, query, collection, onSnapshot, firebaseConfig } from "./firebase-config.js";


// Inicializar Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência ao formulário e ao status
const form = document.getElementById("update-form");
const statusDiv = document.getElementById("status");

// Manipulador de evento para o formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obter valores do formulário
  const category = form.category.value.trim();
  const serviceId = form["service-name"].value.trim();
  const serviceName = form["service-name"].value.trim();
  const serviceValue = parseFloat(form["service-value"].value);
  const serviceDuration = parseFloat(form["service-duration"].value);


  // Referências ao modal
  const modal = document.getElementById("statusModal");
  const statusMessage = document.getElementById("statusMessage");
  const closeButton = document.getElementById("statusCloseButton");

  // Função para exibir o modal com uma mensagem
  const showModal = (message) => {
    statusMessage.textContent = message;
    modal.style.display = "block";
  };

  // Lidar com o botão de fechar
  closeButton.onclick = () => {
    modal.style.display = "none";
  };

  // Verificação de campos
  if (!category || !serviceDuration || !serviceId || !serviceName || isNaN(serviceValue)) {
    showModal("Por favor, preencha todos os campos corretamente.");
    return;
  }

  try {
    // Verificar se a categoria já existe no Firestore
    const categoryDocRef = doc(db, "servicos", category.toLowerCase());
    const categorySnapshot = await getDoc(categoryDocRef);

    if (!categorySnapshot.exists()) {
      // Criar uma nova categoria se não existir
      await setDoc(categoryDocRef, {
        category: category,
        services: {
          [serviceId]: {
            nome: serviceName,
            valor: serviceValue,
            duracao: serviceDuration
          }
        }
      });
      console.log(serviceDuration)
      showModal(`Categoria "${category}" criada com o serviço "${serviceName}".`);
    } else {
      // Atualizar a categoria existente
      const currentData = categorySnapshot.data();
      const updatedServices = {
        ...currentData.services,
        [serviceId]: {
          nome: serviceName,
          valor: serviceValue,
          duracao: serviceDuration
        }
      };

      await updateDoc(categoryDocRef, { services: updatedServices });
      showModal(`Serviço "${serviceName}" atualizado na categoria "${category}".`);
    }

    // Limpar o formulário
    form.reset();
  } catch (error) {
    console.error("Erro ao atualizar o serviço:", error);
    showModal("Ocorreu um erro ao atualizar o serviço. Verifique o console.");
  }
});
