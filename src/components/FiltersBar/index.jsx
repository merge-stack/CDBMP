import { useCallback, useState, useRef, useMemo } from 'react';
import BudgetFilter from './BudgetFilter';
import DefaultFilter from './DefaultFilter';

import { FILTERS } from '../../constants/filters';
import useFiltersStore from '../../store/useFiltersStore';
import useUIStore from '../../store/useUIStore';
import { X } from 'lucide-react';

const FiltersBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownRect, setDropdownRect] = useState(null);

  // Filter store states
  const { selectedFilters, setSelectedFilters } = useFiltersStore();

  const { selectedMobileMenu } = useUIStore();
  const isFilterBarOpen = selectedMobileMenu?.id === 'filter';

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
              px-4 py-2 text-[13px] font-medium whitespace-nowrap rounded-md
              transition-colors duration-200 w-full md:w-auto md:min-w-0
              text-[#484747] hover:bg-white/90
              flex items-center justify-between gap-2
              border border-[#D5D5D5] bg-[#FDFDFD]
            `}
            onClick={() => handleFilterClick(filter.id)}
            aria-expanded={openDropdown === filter.id}
            aria-haspopup="true"
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <span>{filter.label}</span>
              <button className='px-1'>
                <X size={16} />
              </button>
              {filter.type === "range" ? (
                <img
                  src="/svg/rangeFilterIcon.svg"
                  alt="Range filter"
                  className="w-4 h-4"
                />
              ) : (
                <svg
                  className={`w-4 h-4 transition-transform duration-200 text-black ${
                    openDropdown === filter.id ? "rotate-180" : ""
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
            (filter.type === "range" ? (
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
    <div className={`md:block ${isFilterBarOpen ? '' : 'hidden'}`}>
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
