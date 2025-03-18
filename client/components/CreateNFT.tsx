import useGlobalState from "../store";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { uploadImageToPinata } from "../utils";
import marketAbi from "../abis/TimeLess.json";
import nftAbi from "../abis/TimeLessNFT.json";
import { CiImageOn } from "react-icons/ci";
import pinataSDK from "@pinata/sdk";
import Web3 from "web3";
const pinata = new pinataSDK(
  "1613dd607713ee1ec445",
  "1a51df876d1b1a897a6ce05b6fa83b15e954a62ebd980e151862b45b2c145dc8"
);
const CreateNFT = () => {
  const { modal, setGlobalState } = useGlobalState();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [imgBase64, setImgBase64] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title || !price || !description) return;

    setGlobalState({ modal: "scale-0" });
    setGlobalState({ loading: { show: true, msg: "Uploading IPFS data..." } });

    try {
      const imageURI = await uploadImageToPinata(fileUrl);

      const metadata = {
        name: title,
        description: description,
        image: imageURI,
        attributes: [],
      };

      const metadataa = await pinata.pinJSONToIPFS(metadata);
      const metadataURI = `https://gateway.pinata.cloud/ipfs/${metadataa.IpfsHash}`;

      setGlobalState({ loading: { show: true, msg: "Creating NFT.." } });

      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const NFTContract = new web3.eth.Contract(
          nftAbi,
          "0x5CF3e214FD40F287F6Bf4efAc643CC6f6fF2F16e"
        );

        await NFTContract.methods
          .awardItem(accounts[0], metadataURI)
          .send({ from: accounts[0] });

        let tokenId = 0;

        try {
          while (true) {
            let tokenURI = await NFTContract.methods.tokenURI(tokenId).call();
            console.log(`Token ID: ${tokenId}, URI: ${tokenURI}`);
            tokenId += 1;
          }
        } catch (error) {
          console.log("Không còn NFT nào nữa hoặc lỗi xảy ra:", error);
        }
        console.log(tokenId);
        console.log("Token ID:", tokenId);

        const marketContract = new web3.eth.Contract(
          marketAbi,
          "0x326611fce71580864D4173830cB5D86409f13B71"
        );

        console.log(tokenId, marketContract);
        const response = await marketContract.methods
          .activeForSale(17, 10, 0, 10000000000)
          .send({ from: accounts[0] });
        console.log(response);
      }

      resetForm();
      setGlobalState({
        alert: { show: true, msg: "Minting completed... ", color: "green" },
      });

      setTimeout(() => {
        setGlobalState({ loading: { show: false, msg: "" } });
      }, 2000);

      window.location.reload();
    } catch (error) {
      console.log("Error uploading file: ", error);
      setGlobalState({
        alert: { show: true, msg: "Minting failed... ", color: "red" },
      });
    }
  };

  const changeImage = async (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      if (readerEvent.target) {
        const file = readerEvent.target.result;

        if (typeof file === "string") {
          setImgBase64(file);
        }
        setFileUrl(e.target.files[0]);
      }
    };
  };

  const closeModal = () => {
    setGlobalState({ modal: "scale-0" });
    resetForm();
  };

  const resetForm = () => {
    setFileUrl("");
    setImgBase64(null);
    setTitle("");
    setPrice("");
    setDescription("");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black/50 bg-opacity-50 transform
        transition-transform duration-300 ${modal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5  p-6">
        <form className="flex flex-col space-y-4">
          {/* TITLE */}
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Add NFT</p>
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none hover:cursor-pointer"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* IMAGE DISPLAY */}
          <div className="w-full flex  justify-center items-center ">
            <div
              className="flex flex-row justify-center items-center
           rounded-xl  bg-white h-20 w-20 group"
            >
              {imgBase64 ? (
                <img
                  src={imgBase64}
                  alt="NFT"
                  className="h-full w-full object-cover cursor-pointer"
                />
              ) : (
                <CiImageOn className="h-6 w-6" />
              )}
            </div>
          </div>

          {/* IMAGE INPUT */}
          <div className="flex flex-row justify-between overflow-hidden items-center bg-gray-800 rounded-xl  ">
            {/* <label className="block"> */}

            <input
              type="file"
              accept="image/png, image/gif, image/jpeg, image/webp"
              className="block w-full text-sm text-slate-500 
                  file:mr-4 file:py-2 file:px-4
                 file:border-0
                  file:text-sm file:font-semibold 
                  file:bg-[#19212c] file:text-gray-400
                  hover:file:bg-[#1d2631]  hover:file:cursor-pointer
                  hover:cursor-pointer focus:ring-0 focus:outline-none"
              onChange={changeImage}
              required
            />
            {/* </label> */}
          </div>

          {/* TITLE */}
          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl  p-2">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          {/* PRICE */}
          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl  p-2">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Price (Eth)"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl  p-2">
            <textarea
              className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 "
              name="description"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          {/* MINT BUTTON */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#e32970]
              hover:bg-transparent py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:cursor-pointer hover:text-[#e32970]
              hover:border hover:border-[#bd255f]
              focus:outline-none focus:ring "
          >
            Mint Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNFT;
