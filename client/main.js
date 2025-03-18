import { ethers } from "ethers";

const fetch = async()=>{
    const provider = await new ethers.BrowserProvider(window.ethereum);

    // Request accounts from the user's wallet (MetaMask)
    await provider.send("eth_requestAccounts", []);
    
    const signer = await provider.getSigner();
    
    // Contract setup with the signer
    const contract = await new  ethers.Contract("0xDa9F79d24d9dB0712336A3fb709CABc570e27f35", abi, signer);
    
    // Set metadata URI and other parameters for the transaction
    const metaDataUri = "https://gateway.pinata.cloud/ipfs/yourMetadataHash";
    
    // Call the smart contract function (e.g., awardItem)
    const tx = await contract.awardItem(connectedAccount, metaDataUri);
    
    console.log("Transaction hash:", tx.hash);
    
}

fetch();
