import { FaHandshake } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import useGlobalState from "../../store";
import { FaEye } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { formatDate } from "../../utils";

import { ethers } from "ethers";
import marketAbi from "../../abis/TimeLess.json";
const NFTDetailRight = () => {
  const { nft, connectedAccount, setGlobalState } = useGlobalState();
  const handleBuyNFT = async () => {
    console.log("Buying NFT");
    setGlobalState({ showModal: "scale-100" });
  };

  const handleActiveNFTForSale = async () => {
    console.log("Active NFT for sale");
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0x326611fce71580864D4173830cB5D86409f13B71",
        marketAbi,
        signer
      );

      const weiCost = ethers.parseEther(nft?.cost?.toString() || "0");
      const response = await contract.activeForSale(nft?.id, weiCost, 0, 100000000);
      await response.wait();

      console.log("Response:", response);
    }
  };
  console.log("NFT:", nft);
  return (
    <div className="flex flex-col p-4 space-y-8 items-start h-full">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-blue-300 font-semibold">
          {nft?.contractInfo?.openSeaMetadata?.collectionName}
        </h1>
        <div className="flex flex-row space-x-4 items-center justify-end w-full">
          <FaHandshake className="text-lg text-gray-400" />
          <FaUpload className="text-lg text-gray-400" />
          <HiDotsHorizontal className="text-lg text-gray-400" />
        </div>
      </div>

      <div className="flex flex-col space-y-2 items-start w-full">
        <p className="text-3xl text-white font-semibold">{nft?.title}</p>
        <div className="text-gray-400 flex flex-row space-x-1">
          <p>Owned by</p>
          <p className="text-blue-300">
            {nft?.contractInfo?.openSeaMetadata?.twitterUsername}
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center space-x-8">
        <div className="flex flex-row space-x-1 items-center">
          <FaEye className="text-lg text-gray-400" />
          <p className="text-sm text-gray-400">
            {Math.floor(Math.random() * 1000)} Views Views
          </p>
        </div>
        <div className="flex flex-row space-x-1 items-center">
          <svg
            fill="none"
            height="24"
            color="#99a1af"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              height="24"
              id="mask0_1845_35583"
              maskUnits="userSpaceOnUse"
              width="24"
              x="0"
              y="0"
            >
              <rect fill="currentColor" height="24" width="24"></rect>
            </mask>
            <g>
              <path
                d="M6.5 11L12 2L17.5 11H6.5ZM17.5 22C16.25 22 15.1873 21.5627 14.312 20.688C13.4373 19.8127 13 18.75 13 17.5C13 16.25 13.4373 15.1873 14.312 14.312C15.1873 13.4373 16.25 13 17.5 13C18.75 13 19.8127 13.4373 20.688 14.312C21.5627 15.1873 22 16.25 22 17.5C22 18.75 21.5627 19.8127 20.688 20.688C19.8127 21.5627 18.75 22 17.5 22ZM3 21.5V13.5H11V21.5H3ZM17.5 20C18.2 20 18.7917 19.7583 19.275 19.275C19.7583 18.7917 20 18.2 20 17.5C20 16.8 19.7583 16.2083 19.275 15.725C18.7917 15.2417 18.2 15 17.5 15C16.8 15 16.2083 15.2417 15.725 15.725C15.2417 16.2083 15 16.8 15 17.5C15 18.2 15.2417 18.7917 15.725 19.275C16.2083 19.7583 16.8 20 17.5 20ZM5 19.5H9V15.5H5V19.5ZM10.05 9H13.95L12 5.85L10.05 9Z"
                fill="currentColor"
              ></path>
            </g>
          </svg>

          <p className="text-sm text-gray-400">
            {Math.floor(Math.random() * 100)} Memberships
          </p>
        </div>
      </div>

      <div className=" rounded-md  border-1 border-white bg-gray-800 w-full">
        <div className="flex flex-row space-x-2 items-center p-6 border-b-[1px] border-white">
          <FaRegClock className="text-lg text-gray-400" />

          {nft?.contractInfo && (
            <p className="text-md text-gray-400">
              Sales ends{" "}
              {formatDate(nft?.contractInfo.openSeaMetadata.lastIngestedAt)}
            </p>
          )}
        </div>

        <div className="p-6 flex flex-col space-y-4 w-full">
          <p className="text-sm text-gray-400">Current Price</p>
          <div className="flex flex-row space-x-2 items-end">
            <p className="text-white text-2xl font-semibold ">
              {nft?.cost} ETH
            </p>
            <p className="text-gray-300 text-xs font-extralight mb-1">
              $ {((nft?.cost ? nft?.cost : 0.05) * 2032.9).toFixed(3)}
            </p>
          </div>

          <div className="flex flex-row justify-between items-center w-full">
            {/* BUT BUTTON  */}
            <div className="flex flex-row items-center rounded-lg ">
              <div
                onClick={
                  nft?.id == 0
                    ?  () => {}
                    : nft?.owner === connectedAccount
                    ? handleActiveNFTForSale
                    : handleBuyNFT
                }
                className={`${
                  nft?.id == 0
                    ? "hover:cursor-not-allowed"
                    : "hover:bg-[#bd255f] hover:cursor-pointer"
                } text-lg text-white bg-[#e32970] rounded-md shadow-xl shadow-black px-4 py-2`}
              >
                {nft?.id == 0
                  ? "Cannot Buy Now"
                  : nft?.owner === connectedAccount
                  ? "Active For Sale"
                  : "Buy Now"}
              </div>
              {/* <div className="p-[10px] pl-4 bg-blue-200 rounded-r-lg">
                {nft?.id == 0 ? (
                  <MdRemoveShoppingCart className="text-2xl text-gray-400" />
                ) : (
                  <MdShoppingCart className="text-2xl text-gray-400" />
                )}
              </div> */}
            </div>

            {/* MAKE OFFER BUTTON */}
            {/* <div className="flex flex-row items-center rounded-lg overflow-hidden bg-gray-600 font-medium w-[50%]">
              <div className="p-[10px] pl-4 ">
                {nft?.id == 0 ? (
                  <TbRosetteDiscountOff className="text-2xl text-gray-400" />
                ) : (
                  <TbDiscount className="text-2xl text-gray-400" />
                )}
              </div>
              <div
                className={`${
                  nft?.id == 0
                    ? "hover:cursor-not-allowed"
                    : "hover:bg-[#bd255f] hover:cursor-pointer"
                } text-lg text-white    px-4 py-2`}
              >
                {nft?.id == 0 ? "Cannot Make Offer" : "Make Offer"}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailRight;
