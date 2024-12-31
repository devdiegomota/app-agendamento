import {initializeApp, getDocs, getFirestore, addDoc, query, collection, firebaseConfig} from "./firebase-config.js";

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

  
// Função para enviar os valores ao Firestore
async function enviarDadosParaFirestore() {
    try {
      // Capturando os valores dos inputs
      const categoria = document.getElementById("categoria").value;
      const servico = document.getElementById("servico").value;
      const valor = document.getElementById("valor").value;
      const duracao = document.getElementById("duracao").value;
  
      // Dados a serem enviados
      const dados = {
        categoria,
        servico,
        valor,
        duracao,
      };
  
      // Enviando para o Firestore
      const docRef = await addDoc(collection(db, "servicos"), dados);
      console.log("Dados enviados com sucesso! ID do documento:", docRef.id);
    } catch (erro) {
      console.error("Erro ao enviar dados para o Firestore:", erro);
    }
  }
  
  // Exemplo: Chamando a função ao clicar em um botão
  document.getElementById("enviarServiceBtn").addEventListener("click", enviarDadosParaFirestore);
