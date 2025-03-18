// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract MultiNFTAuction {
    IERC721 nftContract;
    struct Auction {
        address payable seller;
        uint256 nftId;
        string metadataURI;
        uint256 highestBid;
        address highestBidder;
        uint256 floorPrice;
        uint256 endAt;
        bool started;
        bool ended;
    }

    constructor(address _nftAddress) {
        nftContract = IERC721(_nftAddress);
    }

    uint256 public auctionCounter;
    uint256 [] activeToken;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bids;

    event Start(uint256 auctionId);
    event End(uint256 auctionId, address highestBidder, uint256 highestBid);
    event Bid(uint256 auctionId, address indexed sender, uint256 amount);
    event Withdraw(uint256 auctionId, address indexed bidder, uint256 amount);

    function start(uint256 tokenId, uint256 startingBid) external {
        require(msg.sender == nftContract.ownerOf(tokenId), "Not owner of NFT");
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        auctionCounter++;
        activeToken.push(tokenId);
        string memory metadataURI = IERC721Metadata(address(nftContract))
            .tokenURI(tokenId);

        auctions[tokenId] = Auction({
            seller: payable(msg.sender),
            nftId: tokenId,
            metadataURI: metadataURI,
            floorPrice:startingBid,
            highestBid: startingBid,
            highestBidder: address(0),
            endAt: block.timestamp + (3 * 1 minutes),
            started: true,
            ended: false
        });

        emit Start(auctionCounter);
    }

    function getAllAuctions() external view returns   (Auction[] memory) {
        Auction[] memory result = new Auction[](activeToken.length);
        uint256 index = 0;
        for (uint256 i = 0; i < activeToken.length; i++) {
            result[index] = auctions[activeToken[i]];
            index++;
        }
        return result;
    }

    function bid(uint256 tokenId) external payable {
        Auction storage auction = auctions[tokenId];
        require(auction.started, "Auction not started");
        require(block.timestamp < auction.endAt, "Auction ended");
        require(msg.value > auction.highestBid, "Bid too low");

        if (auction.highestBidder != address(0)) {
            bids[tokenId][auction.highestBidder] += auction.highestBid;
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit Bid(tokenId, msg.sender, msg.value);
    }

    function withdraw(uint256 tokenId) external {
        uint256 amount = bids[tokenId][msg.sender];
        require(amount > 0, "No funds to withdraw");

        bids[tokenId][msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw failed");

        emit Withdraw(tokenId, msg.sender, amount);
    }

    function end(uint256 tokenId) external {
        Auction storage auction = auctions[tokenId];
        require(auction.started, "Auction not started");
        require(block.timestamp >= auction.endAt, "Auction ongoing");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            nftContract.transferFrom(address(this),auction.highestBidder, auction.nftId);
    
            (bool sent, ) = auction.seller.call{value: auction.highestBid}("");
            require(sent, "Failed to send ETH to seller");
        } else {
            nftContract.transferFrom(
                address(this),
                auction.seller,
                auction.nftId
            );
        }
        emit End(tokenId, auction.highestBidder, auction.highestBid);
    }
}
