import NFTDetailLeft from "./NFTDetailLeft";
import NFTDetailRight from "./NFTDetailRight";
const NFTDetail = () => {
 
  return (
    <div className="bg-[#151c25]  ">
      <div className="px-12 py-10 mx-auto flex flex-row justify-between space-x-16">
        <div className="w-[50%]">
          <NFTDetailLeft  />
        </div>

        <div className="w-[50%]">
          <NFTDetailRight />
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
