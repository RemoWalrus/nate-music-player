
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
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
          <MetadataHead />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </CustomSidebarProvider>
      </SidebarProvider>
    </Router>
  );
}

export default App;
