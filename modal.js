export function Modal() {
    const modal = document.getElementById('confirmModal');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const agendamentoSalvo = document.getElementById('agendamentoSalvo')
    const modalOk = document.getElementById('modal-ok')
    const erroDisponibilidadeHorarioButton = document.getElementById('erroDisponibilidadeModalButton')


    // Mostra o modal
    modal.style.display = 'block';

    // Lida com o botão "Sim"
    if (confirmYes) {
        confirmYes.onclick = function () {
            modal.style.display = 'none';
            RemovaTransacao(cliente);
        };
    }

    if (confirmNo) {
        // Lida com o botão "Não"
        confirmNo.onclick = function () {
            modal.style.display = 'none';
        };
    }

    if (agendamentoSalvo) {
        // Lida com o botão agendamento
        agendamentoSalvo.onclick = function () {
            modal.style.display = 'none';
            window.location.href = 'index.html'
        }
    }
    if (modalOk) {
        // Lida com o botão OK
        modalOk.onclick = function () {
            modal.style.display = 'none';
            
        }
    }
    if (erroDisponibilidadeHorarioButton) {
        // Lida com o botão OK
        erroDisponibilidadeHorarioButton.onclick = function () {
            modal.style.display = 'none';
            
        }
    }

}
