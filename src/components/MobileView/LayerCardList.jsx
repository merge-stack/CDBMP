import useMapStore from '../../store/useMapStore';
import useUIStore from '../../store/useUIStore';
import LayerCard from '../SidePanel/LayerCard';

const LayerCardList = () => {
  const { geoJsonData, selectedLayer, setSelectedLayer } = useMapStore();
  const { setShowDetailPanel } = useUIStore();

  const handleLayerClick = (layer) => {
    setSelectedLayer(layer);
    setShowDetailPanel(true);
  };

  return (
    <div className="fixed bottom-[88px] left-0 right-0 z-50 md:hidden">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 px-4">
          {geoJsonData?.features?.map((feature) => {
            const layer = feature.properties;
            const isSelected = selectedLayer?.id === layer.id;
            return (
              <div key={layer.id}>
                <LayerCard
                  layer={layer}
                  selected={isSelected}
                  onClick={() => handleLayerClick(layer)}
                  onAddClick={() => {}}
                  isMapTooltip={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LayerCardList;
