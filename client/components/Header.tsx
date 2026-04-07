import useGlobalState from "../store";
import { truncate } from "../utils";
declare global {
  interface Window {
    ethereum: any;
  }
}

import { useNavigate } from "react-router-dom";

const Header = () => {
  const { connectedAccount, setGlobalState } = useGlobalState();
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {

        // Kết nối Web3 với MetaMask
        // const web3 = new Web3(window.ethereum);

        // Yêu cầu tài khoản từ MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

     
        
 
        setGlobalState({
          connectedAccount: accounts[0],
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
            navigate("/");
          }}
        >
          Market
        </li>
        <li
          className="mx-8 cursor-pointer"
          onClick={() => {
            navigate("/sell");
          }}
        >
          NFTs On Sell
        </li>
        <li
          className="mx-8 cursor-pointer"
          onClick={() => {
            navigate("/auction");
          }}
        >
          NFTs On Auction
        </li>
        <li
          className="mx-8 cursor-pointer"
          onClick={() => {
            navigate("/myNFT");
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
