
//Dados formulario cliente
export function dadosform(){
    const nome = document.getElementById('nome').value
    const telefone = document.getElementById('telefone').value
    return {nome, telefone}
}

// Função para validar se os campos estão preenchidos
export function validarCampos() {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();

    if (!nome || !telefone) {
        alert('Por favor, preencha todos os campos.');
        return false; // Impede o envio do formulário
    }

    // Validação passou
    return true;
}
