import  { useEffect, useState } from "react";
import { BiTransfer } from "react-icons/bi";
import { MdOpenInNew } from "react-icons/md";
import { truncate } from "../utils";
import useGlobalState from "../store";
const etherScanApiKey = "JV4DPTBF1ERTDSB6DEICXYJI2DXQHDEHY9";
import { TransactionType } from "../type";

const Transactions = () => {
  const { transactions, connectedAccount, setGlobalState } = useGlobalState();

  const [end, setEnd] = useState(3);
  const [count] = useState(3);
  const [collection, setCollection] = useState<TransactionType[]>([]);


  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${connectedAccount}&startblock=0&endblock=99999999&sort=asc&apikey=${etherScanApiKey}`
      );
      const data = await response.json();
      const transactions: TransactionType[] = data.result.map((tx:any) => {
        const transaction: TransactionType = {
          title: tx.to === connectedAccount ? "Received" : "Sent",
          from: tx.from,
          to: tx.to,
          gas: tx.gas,
          value: tx.value,
        };
        return transaction;
      });

      setGlobalState({ transactions });
      setCollection(transactions.slice(0, end));
    };
    if (connectedAccount) {
      fetchTransactions();
    }
    // setCollection(getCollection())
  }, [ connectedAccount]);

  return (
    <div className="bg-[#151c25]">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          {collection.length > 0 ? "Latest Transactions" : "No Transaction Yet"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-2 py-2.5">
          {collection.map((tx,index) => (
            <div
              key={index}
              className="flex justify-between items-center border border-pink-500 text-gray-400 w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3"
            >
              <div className="rounded-md shadow-sm shadow-pink-500 p-2">
                <BiTransfer />
              </div>

              <div>
                <h4 className="text-sm">{tx.title} Transfered</h4>
                <small className="flex flex-row justify-start items-center">
                  <span className="mr-1">Received by</span>
                  <a href="#" className="text-pink-500 mr-2">
                    {truncate(tx.from, 4, 4, 11)}
                  </a>
                  <a href="#">
                    <MdOpenInNew />
                  </a>
                </small>
              </div>

              <p className="text-sm font-medium">{tx.gas}ETH</p>
            </div>
          ))}
        </div>

        {collection.length > 0 && transactions.length > collection.length ? (
          <div className="text-center my-5">
            <button
              className="shadow-xl shadow-black text-white
            bg-[#e32970] hover:bg-[#bd255f]
            rounded-full cursor-pointer p-2"
              onClick={() => setEnd(end + count)}
            >
              Load More
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Transactions;
