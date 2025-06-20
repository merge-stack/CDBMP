import { useState, useRef } from 'react';
import Panel from './Panel';
import { X } from 'lucide-react';

const LayerButton = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

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
    <div className="hidden md:block">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="absolute top-[200px] left-[480px] z-30 w-12 h-12 rounded-full flex items-center justify-center bg-[#426345] shadow-lg transition-all duration-200 hover:bg-[#5C7A5E]"
        aria-label="Toggle map layers"
      >
        {isPanelOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <img src="/svg/layersIcon.svg" alt="Layers" className="w-6 h-6" />
        )}
      </button>

      <Panel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        position={buttonPosition}
      />
    </div>
  );
};

export default LayerButton;
