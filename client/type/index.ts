
export interface NFTType {
  id:number,
  title:string,
  description:string,
  owner:string,
  cost:number,
  metadataURI:string,
  contractInfo?:any
}

export interface TransactionType{
  title:string,
  from:string,
  to:string,
  gas:string
  value:string,
}

export interface GlobalStateType {
    modal: string;
    updateModal: string;
    showModal: string;
    alert: {
      show: boolean;
      msg: string;
      color: string;
    };
    loading: { show: boolean; msg: string };
    connectedAccount: string;
    page:string;
    nft: NFTType | null;
    nfts: NFTType[];
    transactions: TransactionType[];
    contract: null;
    provider: any;
    setProvider: (provider: any) => void;
    setGlobalState: (newState: any) => void;
  }
