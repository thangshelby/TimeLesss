import { create } from "zustand";
import { GlobalStateType } from "../type";

const useGlobalState = create<GlobalStateType>((set) => ({
  modal: "scale-0",
  updateModal: "scale-0",
  showModal: "scale-0",
  alert: {
    show: false,
    msg: "",
    color: "",
  },
  loading: { show: false, msg: "" },
  connectedAccount: "",
  page:'home',
  nft: null,
  nfts: [],
  transactions: [],
  contract: null,
  provider: null,
  setProvider: (provider: any) => set
    ((state) => ({ ...state, provider })),  
  setGlobalState: (newState: any) =>
    set((state) => ({ ...state, ...newState })),
}));

export default useGlobalState;
