import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const DefaultFilter = ({
  filter,
  selectedValue,
  onSelect,
  onMultiSelect,
  buttonRect,
  onClose,
}) => {
  if (!buttonRect) return null;

  const handleSelect = (filterId, value) => {
    onSelect(filterId, value);
    onClose();
  };

  const handleMultiSelect = (filterId, value, isSelected) => {
    onMultiSelect(filterId, value, isSelected);
  };

  const isMultiSelect = filter.multiSelect;
  const selectedValues = isMultiSelect ? selectedValue || [] : [];

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
        {filter.options.map((option) => {
          const isSelected = isMultiSelect
            ? selectedValues.includes(option.value)
            : selectedValue === option.value;

          return (
            <button
              key={option.value}
              className={`
                w-full text-left px-4 py-2 text-sm flex items-center gap-2
                ${
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
              onClick={() => {
                if (isMultiSelect) {
                  handleMultiSelect(filter.id, option.value, !isSelected);
                } else {
                  handleSelect(filter.id, option.value);
                }
              }}
            >
              {isMultiSelect && (
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by button onClick
                    className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary accent-secondary"
                    style={{ accentColor: '#6F8D70' }}
                  />
                </div>
              )}
              <span className="flex-1">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
};

DefaultFilter.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    multiSelect: PropTypes.bool,
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
    PropTypes.array,
  ]),
  onSelect: PropTypes.func.isRequired,
  onMultiSelect: PropTypes.func,
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
