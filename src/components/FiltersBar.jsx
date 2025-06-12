import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

const FilterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  padding: '16px 24px',
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  marginTop: '64px',
  borderBottom: '1px solid rgba(47, 68, 50, 0.1)',
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '3px',
  },
}));

const FilterButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.primary.main : '#FFFFFF',
  color: selected ? '#FFFFFF' : theme.palette.primary.main,
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '8px 20px',
  minWidth: 'auto',
  whiteSpace: 'nowrap',
  border: `1px solid ${
    selected ? theme.palette.primary.main : 'rgba(47, 68, 50, 0.2)'
  }`,
  '&:hover': {
    backgroundColor: selected
      ? theme.palette.primary.dark
      : 'rgba(255, 255, 255, 0.9)',
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    border: `1px solid ${theme.palette.action.disabled}`,
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: theme.palette.primary.main,
  minWidth: '40px',
  width: '40px',
  height: '40px',
  padding: 0,
  border: `1px solid rgba(47, 68, 50, 0.2)`,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    border: `1px solid ${theme.palette.action.disabled}`,
  },
}));

function FiltersBar({
  filters = [
    { id: '1', label: 'Filter 1' },
    { id: '2', label: 'Filter 2' },
    { id: '3', label: 'Filter 3' },
    { id: '4', label: 'Filter 4' },
    { id: '5', label: 'Filter 5' },
  ],
  selectedFilter = { id: '3', label: 'Filter 3' },
  onFilterSelect,
  onAddFilter,
  isLoading,
  maxFilters = 10,
}) {
  const handleFilterClick = useCallback(
    (filter) => {
      if (!isLoading) {
        onFilterSelect(filter);
      }
    },
    [isLoading, onFilterSelect]
  );

  const handleAddClick = useCallback(() => {
    if (!isLoading && filters.length < maxFilters) {
      onAddFilter();
    }
  }, [isLoading, filters.length, maxFilters, onAddFilter]);

  return (
    <FilterContainer role="toolbar" aria-label="Filter options">
      {filters.map((filter) => (
        <FilterButton
          key={filter.id}
          selected={selectedFilter?.id === filter.id}
          onClick={() => handleFilterClick(filter)}
          disabled={isLoading}
          aria-pressed={selectedFilter?.id === filter.id}
        >
          {filter.label}
        </FilterButton>
      ))}
      <Tooltip
        title={
          filters.length >= maxFilters
            ? 'Maximum number of filters reached'
            : 'Add new filter'
        }
      >
        <span>
          <AddButton
            onClick={handleAddClick}
            disabled={isLoading || filters.length >= maxFilters}
            aria-label="add new filter"
          >
            <AddIcon fontSize="small" />
          </AddButton>
        </span>
      </Tooltip>
    </FilterContainer>
  );
}

FiltersBar.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedFilter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  onFilterSelect: PropTypes.func.isRequired,
  onAddFilter: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  maxFilters: PropTypes.number,
};

export default FiltersBar;
