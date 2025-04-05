import React, { useState, CSSProperties } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import Web3 from "web3";
import Card from "../Card";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
import useGlobalState from "../../store";
import { NFTType } from "../../type";
import nftAbi from "../../abis/TimeLessNFT.json";
const SellNFT = () => {
  const [end, setEnd] = useState(8);
  const [count] = useState(4);
  const [allNFTs, setAllNFTs] = useState<NFTType[]>([]);

  const {
    connectedAccount,
  }: { provider: any; connectedAccount: string } = useGlobalState();

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

        const NFTContract = new web3.eth.Contract(
          nftAbi,
          "0x5CF3e214FD40F287F6Bf4efAc643CC6f6fF2F16e"
        );

        let tokenId = 1;

        try {
          while (true) {
            let tokenURI = await NFTContract.methods.tokenURI(tokenId).call();
            const tokenURIString = String(tokenURI);
            const getOwner = await NFTContract.methods.ownerOf(tokenId).call();
            const owner = String(getOwner).toLowerCase();
          
            if (owner == connectedAccount) {
              const response = await fetch(tokenURIString);
              const metadataURI = await response.json();
              const NFT: NFTType = {
                id: tokenId,
                title: metadataURI.name,
                owner: connectedAccount,
                description: metadataURI.description,
                cost: 0,
                metadataURI: metadataURI.image,
              };
              setAllNFTs((prev) => [...prev, NFT]);
            }
            tokenId += 1;
          }
        } catch (error) {
          console.log("Không còn NFT nào nữa hoặc lỗi xảy ra:", error);
        }
      }
    };
    if (connectedAccount) {
      getAllNfts();
    }
  }, []);
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
