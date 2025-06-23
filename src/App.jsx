import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/NavBar';
import FiltersBar from './components/FiltersBar';
import MapView from './components/MapView';
import SidePanel from './components/SidePanel';
import DetailPanel from './components/DetailPanel';
import LayersButton from './components/LayersPanel/LayerButton';
import useUIStore from './store/useUIStore';
import MobilePanel from './components/MobileView/Panel';

/**
 * Main App Component
 * Provides global state and layout using Tailwind CSS
 */
function App() {
  const { showDetailPanel, selectedMobileMenu } = useUIStore();

  const height = selectedMobileMenu === 'filter' ? 163 : 95;

  return (
    <div className="h-screen overflow-hidden grid grid-rows-[auto_auto_1fr] grid-cols-1">
      <Navbar />
      <FiltersBar />
      <LayersButton />
      <div
        className={`grid grid-cols-1 md:grid-cols-[auto_1fr] h-full max-h-[calc(100vh-${height}px)]`}
      >
        <SidePanel />
        <div className={`relative h-[calc(100vh-${height}px)] w-full`}>
          <MapView />
          {showDetailPanel && <DetailPanel />}
        </div>
      </div>
      <MobilePanel />
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
    </div>
  );
}

export default App;
