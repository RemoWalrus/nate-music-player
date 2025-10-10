
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import AlbumPage from './pages/AlbumPage';
import NotFound from './pages/NotFound';
import Todita from './pages/Todita';
import { Toaster } from './components/ui/toaster';
import { MetadataHead } from './components/MetadataHead';
import { SidebarProvider } from './context/SidebarContext';
import { CustomSidebarProvider } from './components/ui/custom-sidebar-provider';
import './App.css';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <CustomSidebarProvider>
          <div className="w-full h-full">
            <MetadataHead />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/albums/:albumName" element={<AlbumPage />} />
              <Route path="/albums" element={<Navigate to="/albums/chipotle" replace />} />
              <Route path="/todita" element={<Todita />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </CustomSidebarProvider>
      </SidebarProvider>
    </Router>
  );
}

export default App;
