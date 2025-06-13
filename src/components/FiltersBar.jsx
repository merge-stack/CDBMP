import { useCallback, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import CustomSelect from './shared/fields/CustomSelectField';

const defaultOptions = [
  { label: 'Option1', value: 'value1' },
  { label: 'Option2', value: 'value2' },
  { label: 'Option3', value: 'value3' },
  { label: 'Option4', value: 'value4' },
  { label: 'Option5', value: 'value5' },
];

const defaultFilters = [
  {
    id: 'area',
    label: "Stato dell'area",
    options: defaultOptions,
  },
  {
    id: 'intervention',
    label: 'Tipo di intervento',
    options: defaultOptions,
  },
  {
    id: 'budget',
    label: 'Budget stimato',
    type: 'range',
    icon: (
      <img
        src="/svg/rangeFilterIcon.svg"
        alt="Range filter"
        className="w-4 h-4"
      />
    ),
    options: {
      min: 1000,
      max: 15000,
      step: 1000,
    },
  },
  {
    id: 'priority',
    label: 'Priorità',
    options: defaultOptions,
  },
  {
    id: 'participation',
    label: 'Modalità di partecipazione',
    options: defaultOptions,
  },
];

function BudgetFilterDropdown({ filter, onSelect, buttonRect, onClose }) {
  const [range, setRange] = useState({
    min: filter.options.min,
    max: filter.options.max,
  });

  const generateOptions = (min, max, step) =>
    Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
      const value = min + i * step;
      return {
        label: `€${value.toLocaleString()}`,
        value,
      };
    });

  const minOptions = useMemo(
    () => generateOptions(filter.options.min, range.max, filter.options.step),
    [range.max, filter.options]
  );

  const maxOptions = useMemo(
    () => generateOptions(range.min, filter.options.max, filter.options.step),
    [range.min, filter.options]
  );

  if (!buttonRect) return null;

  const handleChange = (key) => (value) =>
    setRange((prev) => ({ ...prev, [key]: Number(value) }));

  const renderSelect = (label, value, options, onChange) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <CustomSelect value={value} onChange={onChange} options={options} />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div
      className="fixed min-w-[300px] p-6 bg-white rounded-md shadow-lg z-50 filter-dropdown-content"
      style={{
        top: `${buttonRect.bottom + 8}px`,
        left: `${buttonRect.left}px`,
      }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {renderSelect('Min', range.min, minOptions, handleChange('min'))}
          {renderSelect('Max', range.max, maxOptions, handleChange('max'))}
        </div>
      </div>
    </div>,
    document.body
  );
}

function DefaultFilterDropdown({
  filter,
  selectedValue,
  onSelect,
  buttonRect,
  onClose,
}) {
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
      <div className="py-1 max-h-60 overflow-auto">
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
}

function FiltersBar({
  filters = defaultFilters,
  selectedFilters = {},
  onFilterSelect = () => {},
  isLoading = false,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownRect, setDropdownRect] = useState(null);
  const buttonRefs = useRef({});

  const handleFilterClick = useCallback(
    (filterId) => {
      if (openDropdown === filterId) {
        setOpenDropdown(null);
        setDropdownRect(null);
      } else {
        setOpenDropdown(filterId);
        const buttonRect =
          buttonRefs.current[filterId]?.getBoundingClientRect();
        setDropdownRect(buttonRect);
      }
    },
    [openDropdown]
  );

  const handleOptionSelect = useCallback(
    (filterId, option) => {
      if (!isLoading) {
        onFilterSelect(filterId, option);
        setOpenDropdown(null);
        setDropdownRect(null);
      }
    },
    [isLoading, onFilterSelect]
  );

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdown(null);
    setDropdownRect(null);
  }, []);

  return (
    <div className="fixed top-[95px] left-0 right-0 z-40">
      <div
        className="bg-secondary min-h-[68px] px-6 md:px-12 py-4 flex flex-wrap gap-3 overflow-x-auto border-b border-primary/10"
        role="toolbar"
        aria-label="Filter options"
      >
        {filters.map((filter) => (
          <div key={filter.id} className="flex-none">
            <button
              ref={(el) => (buttonRefs.current[filter.id] = el)}
              className={`
                filter-button
                px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md
                transition-colors duration-200 min-w-[165px] md:min-w-[140px] w-fit
                bg-white text-black hover:bg-white/90
                flex items-center justify-between gap-2
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => handleFilterClick(filter.id)}
              disabled={isLoading}
              aria-expanded={openDropdown === filter.id}
              aria-haspopup="true"
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span>{filter.label}</span>
                {filter.icon || (
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 text-black ${
                      openDropdown === filter.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            </button>

            {openDropdown === filter.id &&
              (filter.type === 'range' ? (
                <BudgetFilterDropdown
                  filter={filter}
                  onSelect={handleOptionSelect}
                  buttonRect={dropdownRect}
                  onClose={handleCloseDropdown}
                />
              ) : (
                <DefaultFilterDropdown
                  filter={filter}
                  selectedValue={selectedFilters[filter.id]}
                  onSelect={handleOptionSelect}
                  buttonRect={dropdownRect}
                  onClose={handleCloseDropdown}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

FiltersBar.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['default', 'range']),
      icon: PropTypes.node,
      options: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
          })
        ),
        PropTypes.shape({
          min: PropTypes.number.isRequired,
          max: PropTypes.number.isRequired,
          step: PropTypes.number,
        }),
      ]).isRequired,
    })
  ).isRequired,
  selectedFilters: PropTypes.object,
  onFilterSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default FiltersBar;
