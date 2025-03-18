// import useGlobalState from "../store";
// import { truncate } from "../utils";
// import { ethers } from "ethers";
// import abi from "../abis/TimeLess.json";
// import React from "react";
// declare global {
//   interface Window {
//     ethereum: any;
//   }
// }
// import timelessabi from "../abis/TimeLessNFT.json";
// const Header = () => {
//   const { connectedAccount, setGlobalState } = useGlobalState();

//   const connectWallet = async () => {
//     if (window.ethereum) {
//       const provider = await new ethers.BrowserProvider(window.ethereum);
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       const signer = await provider.getSigner();

//       const contract = new ethers.Contract(
//         "0xf0B85416210269934b6A5D8DCD58B285a57C03Aa",
//         timelessabi,
//         signer
//       );

//       const metadataURI =
//       "https://gateway.pinata.cloud/ipfs/QmdFGbE957MsnWELFWUrcwg6KAJ1fhZT1cUfqAXTzhsV6f";

//       const tokenId= await contract.awardItem('0xDa9F79d24d9dB0712336A3fb709CABc570e27f35',metadataURI);

//       setGlobalState({
//         connectedAccount: accounts[0],
//         provider: provider,
//         contract: contract,
//       });
//     } else {
//       console.log("Please install MetaMask");
//     }
//   };

//   return (
//     <nav className=" flex md:justify-center justify-between items-center py-4 mx-auto">
//       <div className="md:flex-[0.3] flex-initial justify-center items-center">
//         <img
//           className="w-32 cursor-pointer"
//           src={"../public/assets/timeless.png"}
//           alt="Timeless Logo"
//         />
//       </div>

//       <ul
//         className="md:flex-[0.7] text-white md:flex
//         hidden list-none flex-row justify-end
//         items-center flex-initial "
//       >
//         <li
//           className="mx-8 cursor-pointer"
//           onClick={() => {
//             setGlobalState({ page: "home" });
//           }}
//         >
//           Market
//         </li>
//         <li
//           className="mx-8 cursor-pointer"
//           onClick={() => {
//             setGlobalState({ page: "sell" });
//           }}
//         >
//           NFTs On Sell
//         </li>
//         <li
//           className="mx-8 cursor-pointer"
//           onClick={() => {
//             setGlobalState({ page: "auction" });
//           }}
//         >
//           NFTs On Auction
//         </li>
//         <li
//           className="mx-8 cursor-pointer"
//           onClick={() => {
//             setGlobalState({ page: "myNFT" });
//           }}
//         >
//           My collection
//         </li>
//         <li className="mx-8 cursor-pointer">
//           {" "}
//           {connectedAccount ? (
//             <button
//               className="shadow-xl shadow-black text-white
//         bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
//           rounded-full cursor-pointer"
//             >
//               {truncate(connectedAccount, 4, 4, 11)}
//             </button>
//           ) : (
//             <button
//               className="shadow-xl shadow-black text-white
//         bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
//           rounded-full cursor-pointer"
//               onClick={connectWallet}
//             >
//               Connect Wallet
//             </button>
//           )}
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Header;
import Web3 from "web3";
import useGlobalState from "../store";
import { truncate } from "../utils";
import abi from "../abis/TimeLess.json";
import timelessabi from "../abis/TimeLessNFT.json";
import React from "react";
declare global {
  interface Window {
    ethereum: any;
    web3: Web3;
  }
}

const Header = () => {
  const { connectedAccount, setGlobalState } = useGlobalState();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {

        // Kết nối Web3 với MetaMask
        const web3 = new Web3(window.ethereum);

        // Yêu cầu tài khoản từ MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

     
        
        // Lấy contract NFT
        const contract = new web3.eth.Contract(
          timelessabi,
          "0x397A4a0C4856E53737F319d377afE7FC927867B7"
          // "0xf0B85416210269934b6A5D8DCD58B285a57C03Aa"
        );

        const metadataURI =
          "https://gateway.pinata.cloud/ipfs/QmdFGbE957MsnWELFWUrcwg6KAJ1fhZT1cUfqAXTzhsV6f";

        const fromAddress = accounts[0]; // Người gọi giao dịch
        const toAddress = "0xDa9F79d24d9dB0712336A3fb709CABc570e27f35";

        // Gọi `awardItem()` để mint NFT
        // const tx = await contract.methods
        //   .awardItem(toAddress, metadataURI)
        //   .send({ from: fromAddress });
        // // Cập nhật state global
        setGlobalState({
          connectedAccount: accounts[0],
          // web3: web3,
          // contract: contract,
        });
      } catch (error) {
        console.error("🚨 Lỗi kết nối ví hoặc mint NFT:", error);
      }
    } else {
      console.log("❌ Vui lòng cài đặt MetaMask!");
    }
  };

  return (
    <nav className=" flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.3] flex-initial justify-center items-center">
        <img
          className="w-32 cursor-pointer"
          src={"../public/assets/timeless.png"}
          alt="Timeless Logo"
        />
      </div>

      <ul
        className="md:flex-[0.7] text-white md:flex
        hidden list-none flex-row justify-end
        items-center flex-initial "
      >
        <li
          className="mx-8 cursor-pointer"
          onClick={() => {
            setGlobalState({ page: "home" });
          }}
        >
          Market
        </li>
        <li
          className="mx-8 cursor-pointer"
          onClick={() => {
            setGlobalState({ page: "sell" });
          }}
        >
          NFTs On Sell
        </li>
        <li
          className="mx-8 cursor-pointer"
          onClick={() => {
            setGlobalState({ page: "auction" });
          }}
        >
          NFTs On Auction
        </li>
        <li
          className="mx-8 cursor-pointer"
          onClick={() => {
            setGlobalState({ page: "myNFT" });
          }}
        >
          My collection
        </li>
        <li className="mx-8 cursor-pointer">
          {connectedAccount ? (
            <button
              className="shadow-xl shadow-black text-white
        bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
          rounded-full cursor-pointer"
            >
              {truncate(connectedAccount, 4, 4, 11)}
            </button>
          ) : (
            <button
              className="shadow-xl shadow-black text-white
        bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2
          rounded-full cursor-pointer"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;
