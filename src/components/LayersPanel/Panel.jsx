import PropTypes from 'prop-types';
import useMapStore from '../../store/useMapStore';
import LayerCard from './LayerCard';
import useFiltersStore from '../../store/useFiltersStore';

const layers = [
  {
    id: 'attrazioni',
    name: 'Attrazioni',
    icon: '/svg/attrazioni.svg',
  },
  {
    id: 'incendio_2018',
    name: 'Incendio 2018',
    icon: '/svg/incendio.svg',
  },
  {
    id: 'fonti',
    name: 'Fonti',
    icon: '/svg/fonti.svg',
  },
];

const Panel = ({ isOpen }) => {
  const { selectedMapLayer, setSelectedMapLayer } = useMapStore();
  const { setSelectedFilters } = useFiltersStore();

  const handleLayerToggle = (layer) => {
    const newActiveMapLayer =
      layer.id === selectedMapLayer.id ? selectedMapLayer : layer;

    setSelectedFilters({ type: layer.id });
    setSelectedMapLayer(newActiveMapLayer);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Panel */}
      <div className="fixed left-0 top-[95px] w-full md:left-[540px] md:top-[200px] z-10 md:w-auto bg-white md:rounded-2xl shadow-xl border border-gray-100 p-4">
        <div className="flex gap-3 justify-between">
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
