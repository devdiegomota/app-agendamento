// Função para criar contêineres de datas
function criarDatas(containerId, diasAdiante = 15) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contêiner com ID "${containerId}" não encontrado.`);
        return;
    }

    container.innerHTML = ""; // Limpa conteúdo existente
    const dataAtual = new Date();

    for (let i = 0; i <= diasAdiante; i++) {
        const data = new Date(dataAtual);
        data.setDate(dataAtual.getDate() + i);

        const item = document.createElement("div");
        item.className = "container-item";
        item.textContent = data.toLocaleDateString("pt-BR");
        item.dataset.date = data.toISOString().split("T")[0];
        item.setAttribute("aria-label", `Data: ${data.toLocaleDateString("pt-BR")}`);

        item.addEventListener("click", () => {
            selecionarData(item);
        });

        container.appendChild(item);
    }
}

// Função para selecionar uma data
function selecionarData(item) {
    const items = document.querySelectorAll(".container-item");
    items.forEach((el) => el.classList.remove("selected"));

    item.classList.add("selected");
    console.log(`Data selecionada: ${item.dataset.date}`);
}

// Configuração do carrossel
function configurarCarrossel(prevButtonId, nextButtonId, containerId) {
    const prevButton = document.getElementById(prevButtonId);
    const nextButton = document.getElementById(nextButtonId);
    const container = document.getElementById(containerId);

    prevButton.addEventListener("click", () => {
        container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
    });

    nextButton.addEventListener("click", () => {
        container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
    });

    container.addEventListener("scroll", () => {
        prevButton.disabled = container.scrollLeft === 0;
        nextButton.disabled = container.scrollLeft + container.clientWidth >= container.scrollWidth;
    });

    // Inicializa o estado dos botões
    prevButton.disabled = true;
    nextButton.disabled = container.scrollWidth <= container.clientWidth;
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    criarDatas("dateContainer");
    configurarCarrossel("carouselPrev", "carouselNext", "dateContainer");
});
