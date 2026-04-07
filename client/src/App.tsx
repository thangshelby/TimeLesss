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
import MyNFT from "../components/pages/MyNFT";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <Hero />
      </div>
      <Routes>
        <Route path="/" element={<Artworks />} />
        <Route path="/sell" element={<SellNFT />} />
        <Route path="/myNFT" element={<MyNFT />} />
        <Route path="/detail" element={<NFTDetail />} />
      </Routes>

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
