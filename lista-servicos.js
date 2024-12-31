function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('active');
  }

  function toggleDropdown2() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns[1].classList.toggle('active');
  }

  function toggleDropdown3() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns[2].classList.toggle('active');
  }

  function toggleDropdown4() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns[3].classList.toggle('active');
  }

  function toggleDropdown5() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns[4].classList.toggle('active');
  }

   // Variável global para armazenar o valor do link clicado no dropdown
   let valorSelecionado = null;

   // Função que armazena o valor do link clicado
   function armazenarValor(valor) {
       valorSelecionado = valor;
       console.log("Valor armazenado:", valorSelecionado);
   }