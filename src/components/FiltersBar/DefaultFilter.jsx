import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const DefaultFilter = ({
  filter,
  selectedValue,
  onSelect,
  buttonRect,
  onClose,
}) => {
  if (!buttonRect) return null;

  const handleSelect = (filterId, value) => {
    onSelect(filterId, value);
    onClose();
  };

  return createPortal(
    <div
      className="fixed bg-white rounded-md shadow-lg overflow-hidden z-50 filter-dropdown-content"
      style={{
        top: `${buttonRect.bottom + 8}px`,
        left: `${buttonRect.left}px`,
        width: `${buttonRect.width}px`,
      }}
    >
      <div className="py-1 max-h-64 overflow-auto">
        {filter.options.map((option) => (
          <button
            key={option.value}
            className={`
                w-full text-left px-4 py-2 text-sm
                ${
                  selectedValue === option.value
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            onClick={() => {
              handleSelect(filter.id, option.value);
              onClose();
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};

DefaultFilter.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onSelect: PropTypes.func.isRequired,
  buttonRect: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};

export default DefaultFilter;
