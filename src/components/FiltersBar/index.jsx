import { useCallback, useState, useRef, useMemo } from 'react';
import BudgetFilter from './BudgetFilter';
import DefaultFilter from './DefaultFilter';

import { FILTERS } from '../../constants/filters';
import useFiltersStore from '../../store/useFiltersStore';

const FiltersBar = () => {
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
};

export default FiltersBar;
