import Header from "../components/Header";
import Hero from "../components/Hero";
import Alert from "../components/Alert";
import CreateNFT from "../components/CreateNFT";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import ShowNFT from "../components/ShowNFT";
import Transactions from "../components/Transactions";
import UpdateNFT from "../components/UpdateNFT";
import {SellNFT,Artworks} from "../components/pages";
import NFTDetail from "../components/NFTDetail/NFTDetail";
import useGlobalState from "../store";
import MyNFT from "../components/pages/MyNFT";
function App() {
  const { page } = useGlobalState();
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <Hero />
      </div>
      {page === "home" && <Artworks />}
      {page === "sell" && <SellNFT />}
      {page==='myNFT' && <MyNFT />}
      {page === "detail" && <NFTDetail />}
      {/* <Artworks /> */}

      <Transactions />
      <CreateNFT />
      <ShowNFT />
      <UpdateNFT />
      <Footer />
      <Alert />
      <Loading />
    </div>
  );
}

export default App;
