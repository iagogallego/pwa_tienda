document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

// Referencia al formulario
const NFTForm = document.querySelector("#NFTForm");
  
NFTForm.addEventListener("submit", (e) => {

    // No refrescar la pagina cada vez que hagamos SAVE
    e.preventDefault();

    const title = NFTForm["title"].value;
    const description = NFTForm["description"].value;
    App.createNFT(title, description);

});