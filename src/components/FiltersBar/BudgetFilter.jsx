import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import SimpleSelect from '../shared/Fields/SimpleSelect';

const BudgetFilter = ({
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

BudgetFilter.propTypes = {
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
  onSelect: PropTypes.func.isRequired,
  selectedValue: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }),
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

export default BudgetFilter;
