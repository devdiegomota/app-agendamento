
//Dados formulario cliente
export function dadosform(){
    const nome = document.getElementById('nome').value
    const telefone = document.getElementById('telefone').value
    return {nome, telefone}
}
