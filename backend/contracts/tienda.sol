// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./ObrasDeArte.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract tienda is IERC721Receiver{
    
    onSaleNST[] public onSaleNSTs;
    
    mapping(uint => address) public propietarioToken;
    mapping(uint => uint) public ventaId;
    
    struct onSaleNST {
        uint256 tokenId;
        uint256 price;
        address payable owner; // payable es para poder usar las llamadas .transfer() o .send()
        bool onSale;
        bool sold;
    }
    
    
    function onERC721Received(address, address _from, uint256 _tokenId, bytes memory) public virtual override returns (bytes4) {
        uint saleId = onSaleNSTs.length;
        onSaleNST memory newSale;
        newSale.tokenId = _tokenId;
        newSale.price = 0;
        newSale.owner = payable(_from);
        newSale.onSale = false;
        newSale.sold = false;
        onSaleNSTs.push(newSale);
        propietarioToken[_tokenId] = _from;
        ventaId[_tokenId] = saleId;
        emit ventaCreada(propietarioToken[_tokenId],_tokenId,saleId);
        return this.onERC721Received.selector;
    }
    
    
    function setPrice(uint256 _tokenId, uint256 _price) public{
        require(msg.sender == propietarioToken[_tokenId]);
        onSaleNSTs[ventaId[_tokenId]].price = _price;
        onSaleNSTs[ventaId[_tokenId]].onSale = true;
    }
    
    function totalSales() public view returns (uint){
        return onSaleNSTs.length;
    }
    
    function onSale(uint _tokenId) public view returns (bool){
        return (onSaleNSTs[ventaId[_tokenId]].onSale && !onSaleNSTs[ventaId[_tokenId]].sold);
    }
    
    function buyNFT(uint _tokenId) public payable {
        require(onSaleNSTs[ventaId[_tokenId]].onSale == true);
        require(onSaleNSTs[ventaId[_tokenId]].sold == false);
        require(msg.value >= onSaleNSTs[ventaId[_tokenId]].price);
        payable(propietarioToken[_tokenId]).transfer(msg.value);
        ObrasDeArte remoteContract = ObrasDeArte(0x15Ec0f1928662713E217D92575623B0287a012c8);
        remoteContract.safeTransferFrom(address(this),msg.sender,_tokenId);
        onSaleNSTs[ventaId[_tokenId]].sold = true;
    }
    
    // EVENTOS
    
    event ventaCreada(address _propietario, uint _tokenId, uint nose);
    
    event ventaRealizada(address _comprador, address _propietario, uint _tokenId);
    
}