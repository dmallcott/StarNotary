// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract StarNotary is ERC721 {
    
    constructor() ERC721("Star Notary", "STR") { }

    struct Star {
        string name;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;


    function createStar(string memory _name, uint256 _tokenId) public { 
        Star memory newStar = Star(_name); 
        tokenIdToStarInfo[_tokenId] = newStar; 
        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sell a star you don't own");
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");

        uint starCost = starsForSale[_tokenId];
        uint buyerOffer = msg.value;
        bool buyerSentMoreThanRequired = buyerOffer > starCost;

        address ownerAddress = ownerOf(_tokenId);
        address buyerAddress = msg.sender;

        require(buyerSentMoreThanRequired, "You need to have enough Ether");

        _transfer(ownerAddress, buyerAddress, _tokenId); // Very dodgy to use this. I'd prefer to implement an approval flow.  
        payable(ownerAddress).transfer(starCost);
        
        if (buyerSentMoreThanRequired) {
            payable(buyerAddress).transfer(buyerOffer - starCost);
        }

        delete starsForSale[_tokenId];
    }

    // getStarInfo would be a nicer name
    function lookUptokenIdToStarInfo(uint _tokenId) public view returns (string memory) {
        return tokenIdToStarInfo[_tokenId].name;
    }

    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        address owner1 = ownerOf(_tokenId1);
        address owner2 = ownerOf(_tokenId2);

        require(msg.sender == owner1 || msg.sender == owner2, "You need to own one of the tokens");

        _transfer(owner1, owner2, _tokenId1);
        _transfer(owner2, owner1, _tokenId2);
    }

    function transferStar(address _recipient, uint256 _tokenId) public {
        safeTransferFrom(msg.sender, _recipient, _tokenId);
    }
}