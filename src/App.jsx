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

/**
 * Main App Component
 * Provides theme context and manages global state
 */
function App() {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const handleLayerSelect = (layer) => {
    setSelectedLayer(layer);
    setShowDetailPanel(true);
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
          />
          <MapView
            onLayerSelect={handleLayerSelect}
            selectedLayer={selectedLayer}
          />
          {showDetailPanel && (
            <DetailPanel
              layer={selectedLayer}
              onClose={() => setShowDetailPanel(false)}
            />
          )}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
