import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import DetailPage from './pages/DetailPage';
import VideoPage from './pages/VideoPage';
import GalleryPage from './pages/GalleryPage';
import MastersPage from './pages/MastersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/encyclopedia" element={<EncyclopediaPage />} />
          <Route path="/encyclopedia/:id" element={<DetailPage />} />
          <Route path="/videos" element={<VideoPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/masters" element={<MastersPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
