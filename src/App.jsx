import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/utils.css';
import Navbar from './components/NavBar';
import FiltersBar from './components/FiltersBar';
import MapView from './components/MapView';
import SidePanel from './components/SidePanel';
import DetailPanel from './components/DetailPanel';
import LayersButton from './components/LayersPanel/LayerButton';
import MobilePanel from './components/MobileView/Panel';
import { Routes, Route } from 'react-router-dom';

/**
 * Main App Component
 * Provides global state and layout using Tailwind CSS
 */
function App() {
  return (
    <div className="h-screen overflow-hidden grid grid-rows-[auto_auto_1fr] grid-cols-1">
      <Navbar />
      <FiltersBar />
      <LayersButton />
      <div
        className={`grid grid-cols-1 mt-[95px] md:mt-[163px] md:grid-cols-[auto_1fr] h-[calc(100vh-95px)] md:h-[calc(100vh-163px)]`}
      >
        <SidePanel />
        <div className={`relative h-full w-full`}>
          <MapView />
        </div>
        <Routes>
          <Route path="/area/:id" element={<DetailPanel />} />
        </Routes>
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
