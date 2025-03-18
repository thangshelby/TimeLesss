// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TimeLess is Ownable {
    mapping(uint256 => address) public holderOf;
    mapping(string => uint8) existingURIs;
    address public artist;
    uint256 public royalityFee;
    uint256 public supply = 0;
    uint256 public totalTx = 0;
    uint256 public cost = 1 wei;
    uint256[] activeToken;

    IERC721 public nftContract;

    constructor(
        address _nftAddress,
        uint256 _royalityFee,
        address _artist
    ) Ownable(msg.sender) {
        nftContract = IERC721(_nftAddress);
        nftContract.setApprovalForAll(address(this), true);
        royalityFee = _royalityFee;
        artist = _artist;
    }

    event Sale(
        uint256 id,
        address indexed owner,
        uint256 cost,
        string metadataURI,
        uint256 timestamp
    );

    event unActiveNFT(uint256 indexed tokenId, uint256 timeStamp);

    event ChangePrice(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 priceSale
    );

    struct TransactionStruct {
        uint256 id;
        uint256 cost;
        address owner;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        string metadataURI;
    }
    mapping(uint256 => TransactionStruct) public listedForSale;

    function activeForSale(
        uint256 tokenId,
        uint256 priceSale,
        uint256 from,
        uint256 to
    ) external payable {
        require(msg.sender == nftContract.ownerOf(tokenId));

        string memory metadataURI = IERC721Metadata(address(nftContract))
            .tokenURI(tokenId);
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        listedForSale[tokenId] = (
            TransactionStruct(
                tokenId,
                priceSale,
                msg.sender,
                from,
                to,
                true,
                metadataURI
            )
        );
        activeToken.push(tokenId);
        holderOf[tokenId] = msg.sender;
        existingURIs[metadataURI] += 1;
        totalTx += 1;
        supply += 1;
        emit Sale(totalTx, msg.sender, priceSale, metadataURI, block.timestamp);
    }

    function reActiveForSale(uint256 tokenId) external {
        listedForSale[tokenId].isActive = true;
    }

    function unActiveNFTForSale(uint256 tokenId) external {
        require(
            msg.sender == listedForSale[tokenId].owner,
            "Only Owner can do this!"
        );
        require(listedForSale[tokenId].isActive, "NFT is not listed for sale!");
        nftContract.transferFrom(
            address(this),
            listedForSale[tokenId].owner,
            tokenId
        );

        listedForSale[tokenId].isActive = false;
        supply -= 1;

        emit unActiveNFT(tokenId, block.timestamp);
    }

    function getAllNFTForSale()
        external
        view
        returns (TransactionStruct[] memory)
    {
        TransactionStruct[] memory result = new TransactionStruct[](
            activeToken.length
        );
        uint256 index = 0;
        for (uint256 i = 0; i < activeToken.length; i++) {
            if (listedForSale[activeToken[i]].isActive) {
                result[index] = listedForSale[activeToken[i]];
                index++;
            }
        }

        return result;
    }

    function payToBuy(uint256 tokenId) external payable {
        require(
            msg.value >= listedForSale[tokenId].cost,
            "Ether too low for purchase!"
        );
        require(
            msg.sender != listedForSale[tokenId].owner,
            "Operation Not Allowed!"
        );

        uint256 royality = (msg.value * royalityFee) / 100;
        payTo(artist, royality);
        payTo(listedForSale[tokenId].owner, (msg.value - royality));

        totalTx++;

        emit Sale(
            totalTx,
            msg.sender,
            msg.value,
            listedForSale[tokenId].metadataURI,
            block.timestamp
        );

        nftContract.transferFrom(address(this), msg.sender, tokenId);
        listedForSale[tokenId].isActive = false;
        listedForSale[tokenId].owner= msg.sender;
        holderOf[tokenId] = msg.sender;
    }

    function changePrice(uint256 tokenId, uint256 newPrice)
        external
        returns (bool)
    {
        require(newPrice > 0 ether, "Ether too low!");
        require(
            msg.sender == listedForSale[tokenId].owner,
            "Operation Not Allowed!"
        );

        listedForSale[tokenId].cost = newPrice;
        emit ChangePrice(tokenId, msg.sender, newPrice);
        return true;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}
