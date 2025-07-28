import { useState, useRef } from 'react';
import Panel from './Panel';
import { X } from 'lucide-react';
import useUIStore from '../../store/useUIStore';

const LayerButton = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const { selectedMobileMenu } = useUIStore();

  const isLayerPanelOpen = selectedMobileMenu?.id === 'layer';

  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.right,
        y: rect.top,
      });
    }
    setIsPanelOpen(!isPanelOpen);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      <div className="hidden lg:block">
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className="absolute top-[184px] left-[450px] z-30 w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#426345] shadow-lg transition-all duration-200 hover:bg-[#5C7A5E]"
          aria-label="Toggle map layers"
        >
          {isPanelOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <img src="/svg/layersIcon.svg" alt="Layers" className="w-5 h-5" />
          )}
        </button>
      </div>

      <Panel
        isOpen={isPanelOpen || isLayerPanelOpen}
        onClose={handleClosePanel}
        position={buttonPosition}
      />
    </>
  );
};

export default LayerButton;
