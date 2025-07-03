import PropTypes from 'prop-types';

const LayerCard = ({ layer, isActive, onToggle }) => {
  return (
    <div
      className="flex flex-col items-center transition-all duration-200 p-1 cursor-pointer"
      onClick={() => onToggle(layer)}
    >
      {/* Icon Container */}
      <div
        className={`w-[60px] h-[60px] rounded-xl flex items-center justify-center mb-2 transition-all duration-200 ${
          isActive ? 'bg-[#426345] ring-2 ring-[#426345] ring-offset-2' : ''
        }`}
      >
        <img
          src={layer.icon || 'images/placeholder.png'}
          alt={layer.name}
          className={`w-[60px] h-[60px]`}
        />
      </div>

      {/* Label */}
      <span
        className={`text-[12px] font-medium text-center leading-tight ${
          isActive ? 'text-[#426345] font-semibold' : 'text-[#4A4A4A]'
        }`}
      >
        {layer.name}
      </span>
    </div>
  );
};

LayerCard.propTypes = {
  layer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default LayerCard;
