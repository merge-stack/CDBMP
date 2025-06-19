import { useCallback, useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import SimpleSelect from './shared/Fields/SimpleSelect';
import { FILTERS } from '../constants/filters';
import { toast } from 'react-toastify';
import useFiltersStore from '../store/useFiltersStore';

const BudgetFilterDropdown = ({
  filter,
  onSelect,
  selectedValue,
  buttonRect,
  onClose,
}) => {
  const [range, setRange] = useState({
    min: selectedValue?.min || 0,
    max: selectedValue?.max || 0,
  });

  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => filter.options, [filter.options]);

  // Memoize the change handler
  const handleChange = useCallback(
    (key) => (value) => {
      const newValue = Number(value);

      // Validate the new value
      if (isNaN(newValue)) {
        toast.error('Please select a valid number');
        return;
      }

      setRange((prev) => {
        const newRange = { ...prev, [key]: newValue };

        // Only trigger onSelect if both min and max are set
        if (key === 'max' && prev.min !== 0) {
          if (newValue < prev.min) {
            toast.error('Max value cannot be lesser than min value');
            return prev;
          }
          onSelect(filter.id, { min: prev.min, max: newValue });
          onClose();
        } else if (key === 'min' && prev.max !== 0) {
          if (newValue > prev.max) {
            toast.error('Min value cannot be greater than max value');
            return prev;
          }
          onSelect(filter.id, { min: newValue, max: prev.max });
          onClose();
        }

        return newRange;
      });
    },
    [filter.id, onSelect, onClose]
  );

  // Memoize the select component render
  const renderSelect = useCallback(
    (label, value, options, onChange) => (
      <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <SimpleSelect
          value={value}
          onChange={onChange}
          options={options}
          placeholder={`Select ${label.toLowerCase()}`}
        />
      </div>
    ),
    []
  );

  if (!buttonRect) return null;

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
          {renderSelect('Min', range.min, options, handleChange('min'))}
          {renderSelect('Max', range.max, options, handleChange('max'))}
        </div>
      </div>
    </div>,
    document.body
  );
};

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
}

function FiltersBar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownRect, setDropdownRect] = useState(null);

  // Filter store states
  const { selectedFilters, setSelectedFilters } = useFiltersStore();

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
    (filterId, value) => {
      // Update the filter state
      setSelectedFilters({
        [filterId]: value,
      });
      setOpenDropdown(null);
      setDropdownRect(null);
    },
    [setSelectedFilters]
  );

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdown(null);
    setDropdownRect(null);
  }, []);

  // Memoize the filter buttons to prevent unnecessary re-renders
  const filterButtons = useMemo(
    () =>
      FILTERS.map((filter) => (
        <div key={filter.id} className="flex-none">
          <button
            ref={(el) => (buttonRefs.current[filter.id] = el)}
            className={`
            filter-button
            px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md
            transition-colors duration-200 min-w-[165px] md:min-w-[140px] w-fit
            bg-white text-black hover:bg-white/90
            flex items-center justify-between gap-2
          `}
            onClick={() => handleFilterClick(filter.id)}
            aria-expanded={openDropdown === filter.id}
            aria-haspopup="true"
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span>{filter.label}</span>
              {filter.type === 'range' ? (
                <img
                  src="/svg/rangeFilterIcon.svg"
                  alt="Range filter"
                  className="w-4 h-4"
                />
              ) : (
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
                selectedValue={selectedFilters[filter.id]}
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
      )),
    [
      selectedFilters,
      openDropdown,
      dropdownRect,
      handleFilterClick,
      handleOptionSelect,
      handleCloseDropdown,
    ]
  );

  return (
    <div className="fixed top-[95px] left-0 right-0 z-40">
      <div
        className="bg-secondary min-h-[68px] px-6 md:px-12 py-4 flex flex-wrap gap-3 overflow-x-auto border-b border-primary/10"
        role="toolbar"
        aria-label="Filter options"
      >
        {filterButtons}
      </div>
    </div>
  );
}

export default FiltersBar;
