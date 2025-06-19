import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import FiltersBar from './components/FiltersBar';
import MapView from './components/MapView';
import SidePanel from './components/SidePanel';
import DetailPanel from './components/DetailPanel';
import LayersButton from './components/LayersButton';
import useUIStore from './store/useUIStore';

/**
 * Main App Component
 * Provides global state and layout using Tailwind CSS
 */
function App() {
  const { showDetailPanel } = useUIStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <FiltersBar />
      <LayersButton />
      <div className="flex flex-1 relative overflow-hidden">
        <SidePanel />
        <MapView />
        {showDetailPanel && <DetailPanel />}
      </div>
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
