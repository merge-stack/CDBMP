import { useMemo, useCallback } from 'react';
import { Grid, AutoSizer } from 'react-virtualized';
import useMapStore from '../../store/useMapStore';
import useUIStore from '../../store/useUIStore';
import LayerCard from '../SidePanel/LayerCard';

const CARD_WIDTH = 270;
const CARD_HEIGHT = 180;

const LayerCardList = () => {
  const { geoJsonData, selectedLayer, setSelectedLayer } = useMapStore();
  const { setShowDetailPanel } = useUIStore();

  const layers = useMemo(
    () => geoJsonData?.default?.features?.map((f) => f.properties) || [],
    [geoJsonData?.default]
  );

  const handleLayerClick = useCallback(
    (layer) => {
      setSelectedLayer(layer);
      setShowDetailPanel(true);
    },
    [setSelectedLayer, setShowDetailPanel]
  );

  const cellRenderer = useCallback(
    ({ columnIndex, key, style }) => {
      const layer = layers[columnIndex];
      if (!layer) return null;

      const isSelected = selectedLayer?.ID === layer.ID;

      return (
        <div
          key={key}
          style={{ ...style, display: 'flex', justifyContent: 'center' }}
        >
          <LayerCard
            layer={layer}
            selected={isSelected}
            onClick={() => handleLayerClick(layer)}
            isMapTooltip={true}
          />
        </div>
      );
    },
    [layers, selectedLayer, handleLayerClick]
  );

  const selectedIndex = useMemo(
    () => layers.findIndex((l) => l.ID === selectedLayer?.ID),
    [layers, selectedLayer]
  );

  return (
    <div className="fixed bottom-[88px] left-0 right-0 z-50 md:hidden bg-transparent">
      <AutoSizer disableHeight>
        {({ width }) => (
          <Grid
            className="hide-scrollbar"
            columnCount={layers.length}
            columnWidth={CARD_WIDTH}
            height={CARD_HEIGHT}
            rowCount={1}
            rowHeight={CARD_HEIGHT}
            cellRenderer={cellRenderer}
            width={width}
            scrollToColumn={selectedIndex >= 0 ? selectedIndex : undefined}
            scrollToAlignment="center"
            style={{ outline: 'none' }}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default LayerCardList;
