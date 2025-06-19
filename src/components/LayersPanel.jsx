import PropTypes from 'prop-types';
import useMapStore from '../store/useMapStore';

const LayerCard = ({ layer, isActive, onToggle }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer transition-all duration-200 p-3"
      onClick={() => onToggle(layer)}
    >
      {/* Icon Container */}
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-2 transition-all duration-200 ${
          isActive ? 'bg-[#426345] ring-2 ring-[#426345] ring-offset-2' : ''
        }`}
      >
        <img
          src={layer.icon || 'images/placeholder.jpg'}
          alt={layer.name}
          className={`w-16 h-16`}
        />
      </div>

      {/* Label */}
      <span
        className={`text-sm font-medium text-center leading-tight ${
          isActive ? 'text-[#426345] font-semibold' : 'text-gray-700'
        }`}
      >
        {layer.name}
      </span>
    </div>
  );
};

LayerCard.propTypes = {
  layer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const layers = [
  {
    id: 'attractions',
    name: 'Attrazioni',
    icon: '/svg/attrazioni.svg',
  },
  {
    id: 'fire2018',
    name: 'Incendio 2018',
    icon: '/svg/incendio.svg',
  },
  {
    id: 'paths',
    name: 'Sentieri',
    icon: '/svg/sentieri.svg',
  },
  {
    id: 'fountains',
    name: 'Fonti',
    icon: '/svg/fonti.svg',
  },
];

const LayersPanel = ({ isOpen, position }) => {
  const { selectedMapLayer, setSelectedMapLayer } = useMapStore();

  const handleLayerToggle = (layer) => {
    const newActiveMapLayer =
      layer.id === selectedMapLayer.id ? selectedMapLayer : layer;
    setSelectedMapLayer(newActiveMapLayer);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Panel */}
      <div
        className="absolute z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
        style={{
          left: position.x + 16,
          top: position.y,
        }}
      >
        {/* Layers Row */}
        <div className="flex gap-3">
          {layers.map((layer) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              isActive={selectedMapLayer.id === layer.id}
              onToggle={handleLayerToggle}
            />
          ))}
        </div>
      </div>
    </>
  );
};

LayersPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

export default LayersPanel;
