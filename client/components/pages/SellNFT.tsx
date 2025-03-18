import React, {  useState, CSSProperties } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import Web3 from "web3";
import marketAbi from "../../abis/TimeLess.json";
import Card from "../Card";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

import useGlobalState from "../../store";
import { NFTType } from "../../type";

const SellNFT = () => {
  const [end, setEnd] = useState(8);
  const [count] = useState(4);
  const [allNFTs, setAllNFTs] = useState<NFTType[]>([]);

  const { provider, connectedAccount } = useGlobalState();

  let [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    const delay = Math.floor(Math.random() * (3000 - 500 + 1)) + 500;
    setLoading(true);
    setTimeout(() => {
      setEnd((prev) => prev + count);
      setLoading(false);
    }, delay);
  };

  //FETCH NFTS BY MY SMART CONTRACT
  React.useEffect(() => {
    const getAllNfts = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        // Lấy contract NFT
        const contract = new web3.eth.Contract(
          marketAbi,
          "0x326611fce71580864D4173830cB5D86409f13B71"
        );

        const allNFTs: { owner: string; metadataURI: string; id: any,cost:any }[] =
          (await contract.methods.getAllNFTForSale().call()) || [];
        console.log(allNFTs);
        for (let i = 0; i < allNFTs.length; i++) {
          const response = await fetch(`${allNFTs[i].metadataURI!}`);
          const nft = await response.json();
          const newNFT: NFTType = {
            id: Number(allNFTs[i].id),
            title: nft.name,
            owner: allNFTs[i].owner,
            description: nft.description,
            cost: Number(allNFTs[i].cost)/ 1e18,
            metadataURI: nft.image,
          };
          setAllNFTs((prev) => [...prev, newNFT]);
        }
      }
    };
    if (connectedAccount) {
      getAllNfts();
    }
  }, [provider]);

  console.log("All NFTs:", allNFTs);
  return (
    <div className="bg-[#151c25] gradient-bg-artworks">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          Trending NFTs around the world !
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {allNFTs.slice(0, end).map((nft, i) => (
            <Card key={i} nft={nft} />
          ))}
        </div>

        {!loading ? (
          <div className="text-center my-5">
            <button
              className="shadow-xl shadow-black text-white
            bg-[#e32970] hover:bg-[#bd255f]
            rounded-full cursor-pointer p-2"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        ) : (
          <CircleLoader
            color={"#e32970"}
            loading={loading}
            cssOverride={override}
            size={60}
            aria-label="Loading"
            data-testid="loader"
          />
        )}
      </div>
    </div>
  );
};

export default SellNFT;
