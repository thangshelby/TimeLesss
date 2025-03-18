import React from 'react'
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { BiDetail } from "react-icons/bi";
import { truncate } from "../../utils";
import useGlobalState from '../../store';
const NFTDetailLeft = () => {
    const {nft} = useGlobalState();
    const [liked, setLiked] = React.useState(false);
    const [likedCount, setLikedCount] = React.useState(
      Math.floor(Math.random() * 100)
    );
    
    const handleLiked = () => {
        setLiked(!liked);
        if (liked) {
            setLikedCount(likedCount - 1);
        } else {
            setLikedCount(likedCount + 1);
        }
    }
  return (
    <div className="flex flex-col space-y-8">
            {/* NFT IMAGE */}
            <div className="rounded-lg flex flex-col justify-between ">
              <div className="flex flex-row justify-between items-center px-4 py-3 bg-gray-800 rounded-t-lg">
                <div className="group relative flex flex-row space-x-2">
                  {nft?.id == 0 ? (
                    <img
                      className="w-[20px] h-[20px] object-cover"
                      src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
                    />
                  ) : (
                    <img
                      className="w-[20px] h-[20px] object-cover"
                      src="data:image/jpeg;base64,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"
                    />
                  )}

                  <div className="text-gray-400 text-sm font-bold">
                    Chain:{" "}
                    {nft?.id == 0
                      ? "Etherium mainnet"
                      : "Etherium Sepolia testnet"}
                  </div>
                </div>

                <div className="flex flex-row space-x-1 text-gray-400 items-center">
                  <p>{likedCount}</p>
                  <div onClick={handleLiked} className="hover:cursor-pointer">
                    {liked ? <FaHeart /> : <CiHeart />}
                  </div>
                </div>
              </div>
              <img
                className="w-full h-[510px] object-cover rounded-b-lg"
                src={nft!.metadataURI}
              />
            </div>

            {/* NFT INFO */}
            <div className="p-4 bg-gray-800 rounded-lg flex flex-col space-y-6">
              <div>
                <div className="flex flex-row items-center space-x-2 text-white">
                  <BiSolidCategory className="text-lg" />
                  <h1 className="text-md font-semibold text-white">
                    Description
                  </h1>
                </div>
                <p className="text-sm font-medium text-gray-400">
                  {nft?.description}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-2 text-white">
                  <BiDetail className="text-lg" />
                  <h1 className="text-md font-semibold text-white">Detail</h1>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm font-medium text-gray-400">
                    {" "}
                    Owner Address
                  </p>
                  <p className="text-sm font-medium text-blue-400">
                    {truncate(nft?.owner!, 6, 4, 14)}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm font-medium text-gray-400">Token Id</p>
                  <p className="text-sm font-medium text-blue-400">
                    {Math.floor(Math.random() * 4000)}
                  </p>
                </div>

                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm font-medium text-gray-400">
                    Token Standard
                  </p>
                  <p className="text-sm font-medium text-gray-400">ERC-721</p>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm font-medium text-gray-400">Chain</p>
                  <p className="text-sm font-medium text-gray-400">
                    {nft?.id == 0
                      ? "Etherium mainnet"
                      : "Etherium Sepolia testnet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
  )
}

export default NFTDetailLeft