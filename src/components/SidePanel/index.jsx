import { useCallback, useMemo } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import useMapStore from '../../store/useMapStore';
import useUIStore from '../../store/useUIStore';
import LayerCard from './LayerCard';
import LayerCardSkeleton from './LayerCardSkeleton';

/**
 * SidePanel Component
 * Displays a list of forest layers with their details and allows selection
 */

const CARD_HEIGHT = 140; // px, adjust to match LayerCard's desktop height (including margin)

const SidePanel = () => {
  // Store states
  const { selectedLayer, setSelectedLayer, geoJsonData } = useMapStore();
  const { setShowDetailPanel, isLoading } = useUIStore();

  // Memoize layers for performance - only show default layer data in cards
  const layers = useMemo(
    () => geoJsonData?.default?.features?.map((f) => f.properties) || [],
    [geoJsonData?.default]
  );

  // Find the index of the selected layer
  const selectedIndex = useMemo(
    () => layers.findIndex((l) => l.ID === selectedLayer?.ID),
    [layers, selectedLayer]
  );

  // Click handler
  const handleLayerClick = useCallback(
    (layer) => {
      setSelectedLayer(layer);
      setShowDetailPanel(true);
    },
    [setSelectedLayer, setShowDetailPanel]
  );

  // Click handler
  const handleRemoveClick = useCallback(() => {
    setShowDetailPanel(false);
    setSelectedLayer(null);
  }, [setSelectedLayer, setShowDetailPanel]);

  // Memoized row renderer
  const rowRenderer = useCallback(
    ({ index, key, style }) => {
      const layer = layers[index];
      const isSelected = selectedLayer?.ID === layer.ID;
      return (
        <div key={key} style={style}>
          <LayerCard
            layer={layer}
            selected={isSelected}
            onClick={() => handleLayerClick(layer)}
            onRemoveClick={handleRemoveClick}
          />
        </div>
      );
    },
    [layers, selectedLayer, handleLayerClick, handleRemoveClick]
  );

  if (isLoading) {
    return (
      <div className="hidden md:block w-[430px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
        {Array.from({ length: 7 }).map((_, index) => (
          <LayerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!layers.length) {
    return (
      <div className="hidden md:block w-[430px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
        <div className="h-full flex items-center justify-center text-gray-500">
          No layers available
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block w-[430px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={layers.length}
            rowHeight={CARD_HEIGHT}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
            style={{ outline: 'none', width: '410px' }}
            scrollToIndex={selectedIndex >= 0 ? selectedIndex : undefined}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default SidePanel;
