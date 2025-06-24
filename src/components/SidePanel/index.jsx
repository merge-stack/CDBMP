import { useCallback } from 'react';
import useMapStore from '../../store/useMapStore';
import useUIStore from '../../store/useUIStore';
import LayerCard from './LayerCard';
import LayerCardSkeleton from './LayerCardSkeleton';

/**
 * SidePanel Component
 * Displays a list of forest layers with their details and allows selection
 */
const SidePanel = () => {
  // Store states
  const { selectedLayer, setSelectedLayer, geoJsonData } = useMapStore();
  const { setShowDetailPanel, isLoading } = useUIStore();

  const handleLayerClick = useCallback(
    (layer) => {
      setSelectedLayer(layer);
      setShowDetailPanel(true);
    },
    [setSelectedLayer, setShowDetailPanel]
  );

  if (isLoading) {
    return (
      <div className="hidden md:block w-[450px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
        {Array.from({ length: 7 }).map((_, index) => (
          <LayerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!geoJsonData?.features?.length) {
    return (
      <div className="hidden md:block w-[450px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
        <div className="h-full flex items-center justify-center text-gray-500">
          No layers available
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block w-[450px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
      {geoJsonData.features.map((feature) => {
        const layer = feature.properties;
        const isSelected = selectedLayer?.id === layer.id;
        return (
          <LayerCard
            key={layer.id}
            layer={layer}
            selected={isSelected}
            onClick={() => handleLayerClick(layer)}
            onAddClick={() => {}}
          />
        );
      })}
    </div>
  );
};

export default SidePanel;
 