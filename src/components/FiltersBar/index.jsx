import { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import BudgetFilter from './BudgetFilter';
import DefaultFilter from './DefaultFilter';

import { FILTERS } from '../../constants/filters';
import { useFiltersStore } from '../../store/useFiltersStore';
import useUIStore from '../../store/useUIStore';
import { X } from 'lucide-react';

const FiltersBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownRect, setDropdownRect] = useState(null);

  // Filter store states
  const {
    selectedFilters,
    setSelectedFilters,
    setFilterToInitial,
    updateMultiSelectFilter,
  } = useFiltersStore();

  const { selectedMobileMenu } = useUIStore();
  const isFilterBarOpen = selectedMobileMenu?.id === 'filter';

  const buttonRefs = useRef({});

  // Close dropdown when mobile menu changes
  useEffect(() => {
    setOpenDropdown(null);
    setDropdownRect(null);
  }, [selectedMobileMenu]);

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

  const handleMultiSelect = useCallback(
    (filterId, value, isSelected) => {
      updateMultiSelectFilter(filterId, value, isSelected);
    },
    [updateMultiSelectFilter]
  );

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdown(null);
    setDropdownRect(null);
  }, []);

  // Helper function to get display text for filter button
  const getFilterDisplayText = useCallback(
    (filter) => {
      const selectedValue = selectedFilters[filter.id];

      // Handle budget filter specifically (it's an object with min/max)
      if (filter.id === 'budget') {
        if (
          selectedValue &&
          selectedValue.min !== 0 &&
          selectedValue.max !== 0
        ) {
          return `€${selectedValue.min.toLocaleString()} - €${selectedValue.max.toLocaleString()}`;
        }
        return filter.label;
      }

      if (filter.multiSelect) {
        if (Array.isArray(selectedValue) && selectedValue.length > 0) {
          if (selectedValue.length === 1) {
            return selectedValue[0];
          } else {
            return `${selectedValue.length} selezionati`;
          }
        }
        return filter.label;
      }

      return selectedValue || filter.label;
    },
    [selectedFilters]
  );

  // Helper function to check if filter has selected values
  const hasSelectedValues = useCallback(
    (filter) => {
      const selectedValue = selectedFilters[filter.id];

      if (filter.id === 'budget') {
        return (
          selectedValue && selectedValue.min !== 0 && selectedValue.max !== 0
        );
      }

      if (filter.multiSelect) {
        return Array.isArray(selectedValue) && selectedValue.length > 0;
      }

      return selectedValue && selectedValue !== '';
    },
    [selectedFilters]
  );

  // Memoize the filter buttons to prevent unnecessary re-renders
  const filterButtons = useMemo(
    () =>
      FILTERS.map((filter) => (
        <div key={filter.id} className="flex-none relative">
          {hasSelectedValues(filter) && (
            <button
              onClick={() => setFilterToInitial(filter.id)}
              className="px-1 mx-3 absolute right-[15px] top-[10px]"
            >
              <X size={16} />
            </button>
          )}
          <button
            ref={(el) => (buttonRefs.current[filter.id] = el)}
            className={`
              filter-button
              p-2 text-[13px] font-medium whitespace-nowrap rounded-md
              transition-colors duration-200 w-full md:w-auto md:min-w-0
              text-[#484747] hover:bg-white/90
              flex items-center justify-between gap-2
              border border-[#D5D5D5] bg-[#FDFDFD]
            `}
            onClick={() => handleFilterClick(filter.id)}
            aria-expanded={openDropdown === filter.id}
            aria-haspopup="true"
          >
            <div className="flex items-center justify-between gap-7 w-full">
              <span>{getFilterDisplayText(filter)}</span>
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
              <BudgetFilter
                filter={filter}
                selectedValue={selectedFilters[filter.id]}
                onSelect={handleOptionSelect}
                buttonRect={dropdownRect}
                onClose={handleCloseDropdown}
              />
            ) : (
              <DefaultFilter
                filter={filter}
                selectedValue={selectedFilters[filter.id]}
                onSelect={handleOptionSelect}
                onMultiSelect={handleMultiSelect}
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
      handleMultiSelect,
      handleCloseDropdown,
      setFilterToInitial,
      getFilterDisplayText,
      hasSelectedValues,
    ]
  );

  return (
    <div className={`lg:block ${isFilterBarOpen ? '' : 'hidden'}`}>
      <div className="fixed left-0 top-[95px] right-0 z-10">
        <div className="bg-secondary min-h-[68px] px-6 md:pl-[81px] py-[14px] border-b border-primary/10">
          <div
            className="flex flex-row flex-wrap gap-3 overflow-x-auto"
            role="toolbar"
            aria-label="Filter options"
          >
            {filterButtons.map((btn, i) => (
              <div key={i} className="w-auto min-w-0">
                {btn}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
