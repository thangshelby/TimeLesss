import { FaTimes } from "react-icons/fa";
import useGlobalState from "../store";
import { truncate } from "../utils";
import { ethers } from "ethers";

import BlockiesAvatar from "./BlockiesAvatart";
import React from "react";
import Web3 from "web3";
import marketAbi from "../abis/TimeLess.json";
const ShowNFT = () => {
  const { showModal, connectedAccount, nft, setGlobalState, provider } =
    useGlobalState();

  const onChangePrice = () => {
    setGlobalState({ updateModal: "scale-100", showModal: "scale-0" });
  };

  const handleNFTPurchase = async () => {
    setGlobalState({
      showModal: "scale-0",
      loading: { show: true, msg: "Initializing NFT transfer..." },
    });
    try {

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        marketAbi,
        "0x326611fce71580864D4173830cB5D86409f13B71"
      );
      console.log("NFT ID:", nft?.id);
      const butNFT = await contract.methods
        .payToBuy(nft?.id)
        .send({
          from: connectedAccount,
          value: web3.utils.toWei(`${nft?.cost!*1e18}`, "wei"),
          gas: '3000000',
        });
   
      setGlobalState({
        alert: { show: true, msg: "Transfer completed...", color: "green" },
      });

      window.location.reload();
    } catch (error) {
      console.log("Error transfering NFT: ", error);
      setGlobalState({
        alert: { show: true, msg: "Transfer failed...", color: "red" },
      });
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
          justify-center bg-black/50 bg-opa transform
          transition-transform duration-300 ${showModal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5  p-6">
        <div className="flex flex-col ">
          <div className="flex flex-row justify-between items-center ">
            <p className="font-semibold text-gray-400">Buy NFT</p>
            <button
              type="button"
              onClick={() =>
                setGlobalState({
                  showModal: "scale-0",
                  nft: null,
                })
              }
              className="border-0 bg-transparent focus:outline-none hover:cursor-pointer hover:scale-125 duration-300"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40">
              <img
                className="h-full w-full object-cover cursor-pointer"
                src={nft?.metadataURI}
                alt={nft?.title}
              />
            </div>
          </div>

          <div className="flex flex-col justify-start rounded-xl mt-5">
            <h4 className="text-white font-semibold">{nft?.title}</h4>
            <p className="text-gray-400 text-xs my-1">{nft?.description}</p>

            <div className="flex justify-between items-center mt-3 text-white">
              <div className="flex justify-start items-center">
                {connectedAccount && (
                  <BlockiesAvatar
                    address={
                      nft?.owner || "0x3574cC3Ad823493B2516f2bC6b08F3C1E88f3685"
                    }
                    size={30}
                    scale={8}
                  />
                )}

                <div className="flex flex-col justify-center items-start pl-2">
                  <small className="text-white font-bold">@owner</small>
                  <small className="text-pink-800 font-semibold">
                    {nft?.owner ? truncate(nft.owner, 4, 4, 11) : "..."}
                  </small>
                </div>
              </div>

              <div className="flex flex-col">
                <small className="text-xs">Current Price</small>
                <p className="text-sm font-semibold">{nft?.cost} ETH</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center space-x-2">
            <button
              className="flex flex-row justify-center items-center
                w-full text-[#e32970] text-md border-[#e32970]
                py-2 px-5 rounded-full bg-transparent 
                drop-shadow-xl border hover:bg-transparent
                hover:cursor-pointer hover:text-white
                hover:border hover:border-[#bd255f] 
                focus:outline-none focus:ring mt-5"
              onClick={
                connectedAccount.toLowerCase() == nft?.owner.toLowerCase()
                  ? onChangePrice
                  : nft?.id != 0
                  ? handleNFTPurchase
                  : () => {}
              }
            >
              {connectedAccount.toLowerCase() == nft?.owner.toLowerCase()
                ? "Change Price"
                : nft?.id != 0
                ? "Purchase"
                : "Just for show"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowNFT;
