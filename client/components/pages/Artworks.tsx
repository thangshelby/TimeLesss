import React, { useEffect, useState, CSSProperties } from "react";
import CircleLoader from "react-spinners/CircleLoader";
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
import { ownerAddress } from "../../constant/index";
import { NFTType } from "../../type";
import { Alchemy, Network } from "alchemy-sdk";
import Card from "../Card";

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY || 'yYRxohNniCpcgMX63oi_iX3VAtg1vhy8';

const settings = {
  apiKey: apiKey, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);
const Artworks = () => {
  const [end, setEnd] = useState(8);
  const [count] = useState(4);
  const [allNFTs, setAllNFTs] = useState<NFTType[]>([]);

  const fetchNFTs = async (address: string) => {
    const nft = await alchemy.nft.getNftsForOwner(address);
    return nft;
  };

  let [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    const delay = Math.floor(Math.random() * (3000 - 500 + 1)) + 500;
    setLoading(true);
    setTimeout(() => {
      setEnd((prev) => prev + count);
      setLoading(false);
    }, delay);
  };
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Chọn ngẫu nhiên chỉ số từ 0 đến i
      [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi phần tử
    }
    return array;
  }
  //FETCH NFTS BY ALCAHEMY
  useEffect(() => {
    ownerAddress.map((address) => {
      const response = fetchNFTs(address);
      response.then((res) => {
        // console.log(res);
        const ownedNfts = res.ownedNfts;
        const nfts = ownedNfts.map((nft: any) => {
          return {
            id: 0,
            title: nft.name,
            owner: address,
            description: nft.description,
            cost: nft.contract.openSeaMetadata.floorPrice,
            metadataURI: nft.image.cachedUrl,
            contractInfo: nft.contract
          };
        });
        setAllNFTs((prev) => [...prev, ...nfts]);
      });
    });
    const newNfts = shuffleArray(allNFTs);
    setAllNFTs(newNfts);
  }, []);

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



export default Artworks;
