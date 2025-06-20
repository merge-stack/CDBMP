import PropTypes from 'prop-types';

const LayerCard = ({ layer, isActive, onToggle }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer transition-all duration-200 p-3"
      onClick={() => onToggle(layer)}
    >
      {/* Icon Container */}
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-2 transition-all duration-200 ${
          isActive ? 'bg-[#426345] ring-2 ring-[#426345] ring-offset-2' : ''
        }`}
      >
        <img
          src={layer.icon || 'images/placeholder.jpg'}
          alt={layer.name}
          className={`w-16 h-16`}
        />
      </div>

      {/* Label */}
      <span
        className={`text-sm font-medium text-center leading-tight ${
          isActive ? 'text-[#426345] font-semibold' : 'text-gray-700'
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
