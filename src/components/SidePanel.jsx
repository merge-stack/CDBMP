import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';

const LayerCard = ({ layer, selected, onClick, onAddClick }) => {
  const handleAddClick = useCallback(
    (e) => {
      e.stopPropagation();
      onAddClick(layer);
    },
    [layer, onAddClick]
  );

  const imageUrl = useMemo(() => {
    try {
      return new URL('/public/images/forest1.jpeg', window.location.origin)
        .href;
    } catch {
      toast.error('Error creating image URL');
      return '';
    }
  }, []);

  const renderStatusTag = useCallback((status, selected) => {
    const statusConfig = {
      Recuperata: {
        bgColor: selected ? 'bg-[#BFFFB3]' : 'bg-[rgba(191,255,179,0.5)]',
        textColor: 'text-[#484747]',
        borderColor: 'border-[#92C68A]',
      },
      'In corso': {
        bgColor: selected ? 'bg-[#F6FFB3]' : 'bg-[rgba(246,255,179,0.5)]',
        textColor: 'text-[#484747]',
        borderColor: 'border-[#C0C68A]',
      },
      'Da recuperare': {
        bgColor: selected ? 'bg-[#FFB3B3]' : 'bg-[rgba(255,179,179,0.5)]',
        textColor: 'text-[#484747]',
        borderColor: 'border-[#C68A8A]',
      },
    };

    const { bgColor, textColor, borderColor } = statusConfig[status] || {
      bgColor: selected ? 'bg-gray-300' : 'bg-gray-200',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
    };

    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-normal border-2 ${bgColor} ${textColor} ${borderColor}`}
      >
        {status}
      </span>
    );
  }, []);

  return (
    <div
      className={`flex p-5 mb-4 cursor-pointer rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
        selected ? 'bg-[#719374] text-white' : 'bg-[#DEE8DC]'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center mr-4 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={layer.code}
            className="w-24 h-24 object-cover rounded-2xl"
            onError={(e) => {
              e.target.src = '/public/images/placeholder.jpg';
            }}
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center">
            <span className="text-sm text-gray-500">No image</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col min-w-0 gap-2">
        <div className="flex items-center justify-between">
          <h3
            className={`text-lg font-medium max-w-[150px] truncate ${
              selected ? 'text-white' : 'text-[#484747]'
            }`}
          >
            {layer.code}
          </h3>
          {renderStatusTag(layer.status || 'Da recuperare', selected)}
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between">
              <p
                className={`flex items-center text-sm ${
                  selected ? 'text-[#D3D3D3]' : 'text-[#818181]'
                }`}
              >
                <img
                  src="/public/svg/areaIcon.svg"
                  alt="Area"
                  className={`w-4 h-4 mr-2 ${
                    selected
                      ? 'filter invert() brightness(0.83)'
                      : 'filter invert() brightness(0.51)'
                  }`}
                />
                {layer.area || '12ha'}
              </p>
              <p
                className={`flex items-center text-sm ${
                  selected ? 'text-[#D3D3D3]' : 'text-[#818181]'
                }`}
              >
                <img
                  src="/public/svg/treeIcon.svg"
                  alt="Tree"
                  className={`w-4 h-4 mr-2 ${
                    selected
                      ? 'filter invert() brightness(0.83)'
                      : 'filter invert() brightness(0.51)'
                  }`}
                />
                {layer.status || 'Manutenzione'}
              </p>
            </div>
            <p
              className={`flex items-center text-sm ${
                selected ? 'text-[#D3D3D3]' : 'text-[#818181]'
              }`}
            >
              <img
                src="/public/svg/budgetIcon.svg"
                alt="Budget"
                className={`w-4 h-4 mr-2 ${
                  selected
                    ? 'filter invert() brightness(0.83)'
                    : 'filter invert() brightness(0.51)'
                }`}
              />
              {layer.budget || '200-250K euro'}
            </p>
          </div>
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-4 ${
              selected
                ? 'bg-[#DEE8DC] text-[#426345] hover:bg-gray-50'
                : 'bg-[#426345] text-white hover:bg-[#5C7A5E]'
            }`}
            onClick={handleAddClick}
            aria-label={selected ? 'remove from selection' : 'add to selection'}
          >
            {selected ? (
              <X className="text-2xl" />
            ) : (
              <Plus className="text-2xl" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

LayerCard.propTypes = {
  layer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    municipality: PropTypes.string,
    area: PropTypes.string,
    status: PropTypes.string,
    budget: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

const LayerCardSkeleton = () => (
  <div className="flex p-5 mb-4 bg-white rounded-2xl shadow-md">
    <div className="w-24 h-24 bg-gray-200 rounded-2xl mr-4 animate-pulse" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-3/5 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-md w-1/3 animate-pulse" />
      </div>
      <div className="flex justify-between items-end mt-2">
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse ml-4" />
      </div>
    </div>
  </div>
);

/**
 * SidePanel Component
 * Displays a list of forest layers with their details and allows selection
 */
function SidePanel({
  selectedLayer,
  onLayerSelect,
  onLayerAdd,
  geoJsonData,
  isLoading,
}) {
  const handleLayerClick = useCallback(
    (layer) => {
      onLayerSelect(layer);
    },
    [onLayerSelect]
  );

  const handleLayerAdd = useCallback(
    (layer) => {
      onLayerAdd?.(layer);
    },
    [onLayerAdd]
  );

  if (isLoading) {
    return (
      <div className="w-[450px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
        {[1, 2, 3].map((key) => (
          <LayerCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (!geoJsonData?.features?.length) {
    return (
      <div className="w-[450px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
        <div className="h-full flex items-center justify-center text-gray-500">
          No layers available
        </div>
      </div>
    );
  }

  return (
    <div className="w-[450px] h-full overflow-y-auto bg-gray-50 p-4 border-r border-primary/10">
      {geoJsonData.features.map((feature) => {
        const layer = feature.properties;
        const isSelected = selectedLayer?.id === layer.id;
        return (
          <LayerCard
            key={layer.id}
            layer={layer}
            selected={isSelected}
            onClick={() => handleLayerClick(layer)}
            onAddClick={handleLayerAdd}
          />
        );
      })}
    </div>
  );
}

SidePanel.propTypes = {
  selectedLayer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    municipality: PropTypes.string,
  }),
  onLayerSelect: PropTypes.func.isRequired,
  onLayerAdd: PropTypes.func,
  geoJsonData: PropTypes.shape({
    features: PropTypes.arrayOf(
      PropTypes.shape({
        properties: PropTypes.shape({
          id: PropTypes.number.isRequired,
          code: PropTypes.string.isRequired,
          municipality: PropTypes.string,
        }).isRequired,
      })
    ),
  }),
  isLoading: PropTypes.bool,
};

SidePanel.defaultProps = {
  selectedLayer: null,
  onLayerAdd: () => {},
  geoJsonData: { features: [] },
  isLoading: false,
};

export default SidePanel;
