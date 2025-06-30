import PropTypes from 'prop-types';
import useMapStore from '../../store/useMapStore';
import LayerCard from './LayerCard';
import { MAP_LAYERS } from '../../constants/map';

const Panel = ({ isOpen }) => {
  const { toggleMapLayer, isMapLayerActive } = useMapStore();

  const handleLayerToggle = (layer) => {
    toggleMapLayer(layer.id);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Panel */}
      <div className="fixed left-0 top-[95px] w-full md:left-[540px] md:top-[200px] z-10 md:w-auto bg-white md:rounded-2xl shadow-xl border border-gray-100 p-4">
        <div className="flex gap-3 justify-evenly md:justify-between">
          {MAP_LAYERS.map((layer) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              isActive={isMapLayerActive(layer.id)}
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
