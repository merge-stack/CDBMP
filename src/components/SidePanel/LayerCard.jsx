import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Plus, X } from 'lucide-react';
import React from 'react';
import StatusTag from './StatusTag';
import { formatBudgetRange, formatNumericValue } from '../../helpers/common';

const LayerCard = ({
  layer,
  selected,
  onClick,
  onRemoveClick,
  isMapTooltip,
}) => {
  const [imgError, setImgError] = useState(false);

  const imageUrl = useMemo(() => {
    if (imgError || !layer.immagine)
      return `${window.location.origin}/images/placeholder.png`;
    try {
      return new URL(layer.immagine, window.location.origin).href;
    } catch {
      toast.error('Error creating image URL');
      return `${window.location.origin}/images/placeholder.png`;
    }
  }, [imgError, layer.immagine]);

  // Desktop layout (unchanged)
  const desktopCard = (
    <div
      className={`hidden md:flex p-4 mb-4 cursor-pointer rounded-xl min-w-[340px] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full ${
        selected
          ? 'bg-[#719374] text-white'
          : isMapTooltip
          ? 'bg-white'
          : 'bg-[#DEE8DC]'
      }`}
    >
      <div className="flex items-center justify-center mr-4 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={layer?.code}
            className="w-[83px] h-[81px] object-cover rounded-md"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center">
            <span className="text-sm text-gray-500">No image</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col min-w-0 gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`text-lg font-medium max-w-[150px] truncate ${
              selected ? 'text-white' : 'text-[#484747]'
            }`}
          >
            {layer.id ? `Area ${layer.id}` : 'N/A'}
          </h3>
          <StatusTag status={layer.stato_area || 'N/A'} selected={selected} />
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
                  src="/svg/areaIcon.svg"
                  alt="Area"
                  className={`w-4 h-4 mr-2 ${
                    selected
                      ? 'filter invert() brightness(0.83)'
                      : 'filter invert() brightness(0.51)'
                  }`}
                />
                <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis w-[10ch]">{`${formatNumericValue(
                  layer.area_ha,
                  2
                )} ha`}</span>
              </p>
              <p
                className={`flex items-center text-sm ${
                  selected ? 'text-[#D3D3D3]' : 'text-[#818181]'
                }`}
              >
                <img
                  src="/svg/treeIcon.svg"
                  alt="Tree"
                  className={`w-4 h-4 mr-2 ${
                    selected
                      ? 'filter invert() brightness(0.83)'
                      : 'filter invert() brightness(0.51)'
                  }`}
                />
                <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis w-[10ch]">
                  {layer.tipo_intervento || 'N/A'}
                </span>
              </p>
            </div>
            <p
              className={`flex items-center text-sm ${
                selected ? 'text-[#D3D3D3]' : 'text-[#818181]'
              }`}
            >
              <img
                src="/svg/budgetIcon.svg"
                alt="Budget"
                className={`w-4 h-4 mr-2 ${
                  selected
                    ? 'filter invert() brightness(0.83)'
                    : 'filter invert() brightness(0.51)'
                }`}
              />
              <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                {formatBudgetRange(layer.budget_min, layer.budget_max)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-end">
        {!isMapTooltip && (
          <button
            type="button"
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-4 ${
              selected
                ? 'bg-[#DEE8DC] text-[#426345] hover:bg-gray-50'
                : 'bg-[#426345] text-white hover:bg-[#5C7A5E]'
            }`}
            onClick={selected ? onRemoveClick : onClick}
            aria-label={selected ? 'remove from selection' : 'add to selection'}
            aria-pressed={selected}
          >
            {selected ? (
              <X className="text-2xl" />
            ) : (
              <Plus className="text-2xl" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  // Mobile layout (compact horizontal card)
  const mobileCard = (
    <div
      className="md:hidden flex flex-row items-center p-4 rounded-2xl shadow-md mb-4 bg-white w-[260px] min-w-[260px] max-w-[90vw] mx-2"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={layer?.code}
        className="w-[85px] h-[111px] object-cover rounded-md mr-3 flex-shrink-0"
        onError={() => setImgError(true)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col mb-1">
          <StatusTag status={layer.stato_area || 'N/A'} selected={selected} />
          <h3 className="text-base font-semibold text-[#484747] truncate mt-1">
            {layer.id ? `Area ${layer.id}` : 'N/A'}
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-xs text-[#818181]">
            <img
              src="/svg/areaIcon.svg"
              alt="Area"
              className="w-3 h-w-3 mr-2"
            />
            {`${formatNumericValue(layer.area_ha, 2)} ha`}
          </div>
          <div className="flex items-center text-xs text-[#818181]">
            <img
              src="/svg/treeIcon.svg"
              alt="Tree"
              className="w-3 h-w-3 mr-2"
            />
            {layer.status || 'Manutenzione'}
          </div>
          <div className="flex items-center text-xs text-[#818181]">
            <img
              src="/svg/budgetIcon.svg"
              alt="Budget"
              className="w-3 h-w-3 mr-2"
            />
            {formatBudgetRange(layer.budget_min, layer.budget_max)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {desktopCard}
      {mobileCard}
    </>
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
  isMapTooltip: PropTypes.bool,
};

LayerCard.defaultProps = {
  isMapTooltip: false,
};

export default React.memo(LayerCard);
