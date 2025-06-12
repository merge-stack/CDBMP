'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { useState } from 'react';
import theme from './styles/theme';
import Navbar from './components/Navbar';
import FiltersBar from './components/FiltersBar';
import MapView from './components/MapView';
import SidePanel from './components/SidePanel';
import DetailPanel from './components/DetailPanel';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Main App Component
 * Provides theme context and manages global state
 */
function App() {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const handleLayerSelect = (layer) => {
    setSelectedLayer(layer);
    setShowDetailPanel(true);
  };

  const handleDetailPanelClose = () => {
    setShowDetailPanel(false);
    setSelectedLayer(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Navbar />
        <FiltersBar />
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <SidePanel
            onLayerSelect={handleLayerSelect}
            selectedLayer={selectedLayer}
            geoJsonData={geoJsonData}
          />
          <MapView
            onLayerSelect={handleLayerSelect}
            selectedLayer={selectedLayer}
            geoJsonData={geoJsonData}
            setGeoJsonData={setGeoJsonData}
          />
          {showDetailPanel && (
            <DetailPanel
              layer={selectedLayer}
              onClose={handleDetailPanelClose}
            />
          )}
        </Box>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
