App = {

    api_ipfs : 'http://ec2-3-144-209-232.us-east-2.compute.amazonaws.com:8080/ipfs/',

    //Contiene todos los contratos implicados en la aplicacion
    contracts: {},

    init: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
        await App.renderNFT();
    },

    /**
     * Carga el objeto del navegador que contiene la extensión del wallet 
     * que contiene las cuentas para la red BlockChain
     */
    loadWeb3: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            await window.ethereum.request({ method: "eth_requestAccounts" });

        } else if (web3) 
            web3 = new Web3(window.web3.currentProvider);

        else 
            console.log("No ethereum browser is installed. Try it installing MetaMask ");
    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        App.account = accounts[0];
    },

    /**
     * Carga los contratos descritos en .json (resultado de la compilación del contrato en el backend)
     * 
     */
    loadContract: async () => {
        try {
            // Obtenemos los contratos compilados desde local
            const ObrasDeArteFile = await fetch("ObrasDeArte.json");
            const ObrasDeArteContractJSON = await ObrasDeArteFile.json();

            const tiendaFile = await fetch("tienda.json");
            const tiendaContractJSON = await tiendaFile.json();

            // Creamos la estructura del contrato
            App.contracts.ObrasDeArteContract = TruffleContract(ObrasDeArteContractJSON);
            App.contracts.tiendaContract = TruffleContract(tiendaContractJSON);
            // Nos conectamos al contrato a través de la cuenta del wallet (Metamask)
            App.contracts.ObrasDeArteContract.setProvider(App.web3Provider);
            App.ObrasDeArteContract = await App.contracts.ObrasDeArteContract.deployed();

            App.contracts.tiendaContract.setProvider(App.web3Provider);
            App.tiendaContract = await App.contracts.tiendaContract.deployed();

        } catch (error) {
            console.error(error);
        }
    },

    /**
     * Escribe la direccion de la wallet en el frontend
     */
    render: async () => {
        document.getElementById("account").innerText = App.account;
    },

    /**
     * Obtiene la cantidad de obras disponibles y las muestra
     */
    renderNFT: async () => {

        const nftCounter = await App.tiendaContract.totalSales();
        const nftCounterNumber = nftCounter.toNumber();

        console.log('Numero de NFTs creados actualmente: ' + nftCounterNumber);
        
        //let html = "";
        for (let i = 0; i < nftCounterNumber; i++) {

            const nft = await App.tiendaContract.onSaleNSTs(i);

            /*
            console.log(web3.utils.toWei('1', 'ether'));

            let etherString = "4.2"
            //convert units ether in units wei (return value BigNumber) 
            let wei = ethers.utils.parseEther(etherString)
            //convert wei a decimal string 
            let weiString = wei.toString()
            console.log(weiString)
            */
            
            const tokenIdNFT = nft.tokenId.toNumber();
            const ownerNFT   = nft.owner;
            const onSaleNFT  = nft.onSale;
            const soldNFT    = nft.sold;
            const priceNFT   = nft.price/(Math.pow(10, 18));   // Para pasar de Weis a ETH

            console.log('Identificador NFT: ' + tokenIdNFT);

            const obraArte = await App.ObrasDeArteContract.tokenURI(tokenIdNFT);
            dataJSON = await App.getNFTJSON(obraArte);
            
            const nameNFT   = dataJSON.name;
            const imageNFT  = dataJSON.image;
            const hashNFT   = dataJSON.hash;
            const authorNFT = dataJSON.author;
            const yearNFT   = dataJSON.year;
            
            // Creamos la tarjeta de cada NFT disponible
            let nftElement = `
            <div class="card bg-dark rounded-lg mb-2">
                <div class="card-header">
                    <div class="d-flex justify-content-between mt-3 ml-30">
                        <span>Identificador NFT: ${tokenIdNFT}</span>
                        <div>
                            <button class="btn btn-primary" id="boton${tokenIdNFT}" data-id="${tokenIdNFT}" onclick="App.buyNFT(this)">Comprar</button>
                        </div>
                    </div>
                    <div> 
                        <span>Nombre del NFT: ${nameNFT}</span>
                    </div>
                    <div> 
                        <span>Autor del NFT: ${authorNFT}</span>
                    </div>
                    <div> <span>Año de creación del NFT: ${yearNFT}</span></div>
                </div>
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Propietario del NFT: ${ownerNFT}</span>
                    <div class="fs-2 mb-3">
                        <i class="bi bi-currency-exchange" id='precio${tokenIdNFT}'>  ${priceNFT.toFixed(4)} </i>ETH
                    </div>
                </div>
                <div class="card-body text-center">
                    <span>
                        <button id="show${tokenIdNFT}" class="btn btn-primary" class="imageZoom" onclick="clickZoom(this)" data-alt="${nameNFT}">
                            <i class="bi-image-fill"></i>
                        </button>
                    </span>
                    
                </div>
            </div>`;

            //<button class="btn btn-primary"><i class="bi-image-fill"></i></button>
            //<img src="" id="imagen${tokenIdNFT}" class="imageZoom" onclick="clickZoom(this)" alt="${nameNFT}"/>

            document.querySelector("#NFTList").innerHTML += nftElement;
            document.getElementById('boton' + tokenIdNFT).disabled = !onSaleNFT || soldNFT;
            await App.setImageNFT(imageNFT, tokenIdNFT);
        }
    
        //document.querySelector("#NFTList").innerHTML = html;
    },

    buyNFT: async (element) => {

        var tokenId = element.dataset.id;

        var priceNFT_ETH = document.getElementById('precio' + tokenId).innerText;
        var priceNFT_WEI = priceNFT_ETH * (Math.pow(10, 18));
        console.log('El precio de la transacción será ' + priceNFT_ETH + ' ETH + gasTransaction');

        await App.tiendaContract.buyNFT(tokenId, {
            from: App.account,
            value: priceNFT_WEI
        });

        window.location.reload();
        
    },

    /**
     * Devuelve el JSON del NFT en la red IPFS
     */
    getNFTJSON: async (addressIPFS) => {

        const url_json = addressIPFS.replace('ipfs://', App.api_ipfs);

        response = await fetch(url_json);
        return await response.json();
    },

    /**
     * Dada la direccion IPFS de la imagen del NFT, la incluye en la tarjeta correspondiente
     */
    setImageNFT: async(addressImage, tokenId) => {

        const url_image = addressImage.replace('ipfs://', App.api_ipfs);

        try{
            respuestaImagen = await fetch(url_image);
            blob = await respuestaImagen.blob();
            document.getElementById('show' + tokenId).src = URL.createObjectURL(blob);
        } catch(error){
            console.log(error);
        }
    },

    prueba: async () => {

        return;
    }

};