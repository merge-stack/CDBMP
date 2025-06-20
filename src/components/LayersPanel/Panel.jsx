import PropTypes from 'prop-types';
import useMapStore from '../../store/useMapStore';
import LayerCard from './LayerCard';

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

const Panel = ({ isOpen, position }) => {
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

Panel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

export default Panel;
