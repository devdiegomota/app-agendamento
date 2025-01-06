import {getStorage, ref, uploadBytes, getDownloadURL, setDoc, getDoc, initializeApp, getDocs, getFirestore, addDoc, doc, where, query, collection, onSnapshot, firebaseConfig } from "./firebase-config.js";
import { Modal } from "./modal.js";


// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Seletores do DOM
const profileCircle = document.getElementById('profileCircle');
const profileImage = document.getElementById('profileImage');
const fileInput = document.getElementById('fileInput');

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

// Ao clicar no círculo, abre o seletor de arquivos
profileCircle.addEventListener('click', () => {
  fileInput.click();
});

// Atualiza a imagem e salva no Firebase
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileRef = ref(storage, `profile_pictures/${userId}.jpg`);

    try {
      // Upload da imagem ao Firebase Storage
      await uploadBytes(fileRef, file);
      const imageUrl = await getDownloadURL(fileRef);

      // Atualização da imagem no DOM
      profileImage.src = imageUrl;

      // Salva a URL no Firestore
      await setDoc(doc(db, "users", userId), {
        profileImageUrl: imageUrl,
      });
      Modal();
    } catch (error) {
      console.error("Erro ao atualizar a imagem de perfil:", error);
      alert("Erro ao atualizar a imagem de perfil.");
    }
  }
});

//botao agendamentos pagina
const botaoAgendamentos = document.getElementById('botao-agendamentos');

  botaoAgendamentos.addEventListener('click', () => {
    location.href = "agendamentos.html";
  });
//fim botao
//botao adicionar serviço pagina
const botaoAdicionarServico = document.getElementById('botao-adicionar-servico');

  botaoAdicionarServico.addEventListener('click', () => {
    location.href = "add-service2.html";
    ;
  });
//fim botao
//botao adicionar serviço pagina
const agendarCliente = document.getElementById('botao-agendar-cliente');

  agendarCliente.addEventListener('click', () => {
    location.href = "index.html";
    ;
  });
//fim botao
//botao editar serviço pagina
const editarServico = document.getElementById('botao-editar-servicos');

  editarServico.addEventListener('click', () => {
    location.href = "delete-service.html";
    ;
  });
//fim botao
