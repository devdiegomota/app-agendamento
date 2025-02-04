import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, query, where, collection, getDocs, deleteDoc, doc, orderBy } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC6CNIyYzP5jjwih2_AagpP3zsmzqxEPVo",
    authDomain: "agendamento-2974c.firebaseapp.com",
    projectId: "agendamento-2974c",
    storageBucket: "agendamento-2974c.firebasestorage.app",
    messagingSenderId: "180079994438",
    appId: "1:180079994438:web:3322290845c5c625128c47",
    measurementId: "G-JQ31P0VMG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//LOGIN ANONIMO
const auth = getAuth();
signInAnonymously(auth)
    .then(() => {
        // Signed in..
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
    });
ProcuraClientes()
/*
UserLoged()
//VERIFICA SE O USUARIO TA LOGADO-----------------------------------------------------
function UserLoged() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {

            ProcuraClientes();

        } else {

            window.location.href = "delete-service.html"
        }
    });
}
*/
//-------------------------------------------------------------------------

//FUNÇÃO QUE PEGA OS DADOS NO FIRESTORE-------------------------------------------------
async function ProcuraClientes() {

    const q = query(collection(db, "agendamentos"))

    const querySnapshot = await getDocs(q);

    const clientes = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id

    }));

    console.log(clientes)
    AddClientesNaTela(clientes);//coloca essa arwey criada na função que joga na tela
}

//----------------------------------------------------//---------------------------------
function AddClientesNaTela(clientes) {
    const listaordenada = document.getElementById('lista-clientes')

    clientes.forEach(cliente => {
        const li = document.createElement('li');
        //li.classList.add('');
        li.id = cliente.uid; //adiciona o uid de cada transação como id de cada lista

        //criando o botão remover transação na tela
        const BotaoDelete = document.createElement('button')
        BotaoDelete.innerHTML = "Remover"
        BotaoDelete.classList.add('botao-two')
        BotaoDelete.style.float = "inline-end"
        BotaoDelete.addEventListener('click', event => {
            event.stopPropagation();
            ConfirmRemover(cliente)
        })
        li.appendChild(BotaoDelete)
        //botão criado----------------

        const nome = document.createElement('p')
        nome.innerHTML = '<b>Nome:</b> - ' + cliente.nome;
        li.appendChild(nome);

        const telefone = document.createElement('p');
        telefone.innerHTML = '<b>Telefone:</b> - ' + cliente.telefone;
        li.appendChild(telefone);

        const servico = document.createElement('p');
        servico.innerHTML = '<b>Serviço:</b> - ' + cliente.servico;
        li.appendChild(servico);

        const valor = document.createElement('p');
        valor.innerHTML = '<b>Valor:</b> - R$' + cliente.valor;
        li.appendChild(valor);

        const data = document.createElement('p');
        data.innerHTML = '<b>Data:</b>. - ' + formatFirebaseDate(cliente.data);
        li.appendChild(data);

        const horario = document.createElement('p');
        horario.innerHTML = '<b>Horario:</b>. - ' + formatFirebaseTime(cliente.horario);
        li.appendChild(horario)


        listaordenada.appendChild(li);
    });
}
//Função para formatar data recebida do firebase para Brasil
function formatFirebaseDate(firebaseTimestamp) {
    if (!firebaseTimestamp) return ""; // Verifica se a data é válida

    let date;

    // Verifica o tipo do timestamp e converte para Date
    if (firebaseTimestamp.toDate) {
        date = firebaseTimestamp.toDate(); // Firebase Timestamp
    } else if (typeof firebaseTimestamp === "string") {
        date = new Date(firebaseTimestamp); // String ISO
    } else if (typeof firebaseTimestamp === "number") {
        date = new Date(firebaseTimestamp); // Unix Time (milissegundos)
    } else {
        console.error("Formato de data desconhecido:", firebaseTimestamp);
        return "Data inválida";
    }

    // Formata a data para o padrão "dd/mm/aaaa"
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

//Função para formatar o horario recebido do firabase para Brasil
function formatFirebaseTime(firebaseTimestamp) {
    if (!firebaseTimestamp) return ""; // Verifica se o horário é válido

    let date;

    // Verifica o tipo do timestamp e converte para Date
    if (firebaseTimestamp.toDate) {
        date = firebaseTimestamp.toDate(); // Firebase Timestamp
    } else if (typeof firebaseTimestamp === "string") {
        date = new Date(firebaseTimestamp); // String ISO
    } else if (typeof firebaseTimestamp === "number") {
        date = new Date(firebaseTimestamp); // Unix Time (milissegundos)
    } else {
        console.error("Formato de horário desconhecido:", firebaseTimestamp);
        return "Horário inválido";
    }

    // Formata o horário para o padrão "HH:mm"
    return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Garante formato de 24 horas
    });
}

//-----------------------------------------------------------------------------------------

//FUNÇÃO QUE REMOVE A TRANSAÇÃO PELO BOTÃO
//etapa de confirmação antes de deletar
function ConfirmRemover(cliente) {
    const modal = document.getElementById('confirmModal');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    // Mostra o modal
    modal.style.display = 'block';

    // Lida com o botão "Sim"
    confirmYes.onclick = function () {
        modal.style.display = 'none';
        RemovaTransacao(cliente);
    };

    // Lida com o botão "Não"
    confirmNo.onclick = function () {
        modal.style.display = 'none';
    };
}

//remove direto do firestore e da tela
async function RemovaTransacao(cliente) {
    await deleteDoc(doc(db, "agendamentos", cliente.uid));
    document.getElementById(cliente.uid).remove();
}

//------------------------------------//-------------------------------------------------------//

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


