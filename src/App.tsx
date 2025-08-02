
import { useGetCollectionInfo } from "./hooks/use-get-collection-info";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { Navbar } from "./components/navbar";
import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/home-pages';
import { CollectionDetail } from './pages/collection-detail';
import { AnimatePresence } from 'framer-motion';



export function App() {
  // Mengambil seluruh objek koleksi dari networkConfig
  const collections = useNetworkVariable("collectionId");

  // Membuat daftar nama dan ID untuk dropdown dan state
  // const collectionNames = Object.keys(collections);
  const collectionIds = Object.values(collections);
  // const collectionCount = Object.keys(collections).length;

  // Menginisialisasi state dengan ID koleksi pertama dari daftar. Ini cara yang aman.
  const [selectedCollectionId] = useState(
    collectionIds[0],
  );

  // Mengambil info koleksi berdasarkan ID yang sedang dipilih dari state
  const [collectionInfo] = useGetCollectionInfo(selectedCollectionId);


  // Tampilan loading jika data koleksi belum siap
  if (!collectionInfo) return <div>Loading Collection...</div>;
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">

      {/* Header Section */}
      <Navbar/>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection/:id" element={<CollectionDetail />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
