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
      <div className="fixed left-0 top-[95px] w-full lg:left-[500px] lg:top-[200px] z-10 lg:w-auto bg-white lg:rounded-2xl shadow-xl border border-gray-100 p-4">
        <div className="flex gap-3 justify-evenly lg:justify-between">
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
