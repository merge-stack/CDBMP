import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

export default function CustomSelect({
  value,
  options = [],
  onChange,
  placeholder = 'Select',
  renderValue, // optional custom value renderer
}) {
  const currentOption = options.find((opt) => opt.value === value);

  return (
    <Select.Root
      value={value?.toString()}
      onValueChange={(val) => {
        const selected = options.find((opt) => opt.value.toString() === val);
        if (selected) onChange(selected.value);
      }}
    >
      <Select.Trigger
        className="w-full pl-3 pr-8 py-2 bg-gray-100 text-black rounded-md flex justify-between items-center gap-2 cursor-pointer relative"
        aria-label="Custom Select"
      >
        <Select.Value placeholder={placeholder}>
          {renderValue ? renderValue(currentOption) : currentOption?.label}
        </Select.Value>
        <Select.Icon asChild>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-white rounded-md shadow-lg overflow-hidden z-50"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value.toString()}
                className="text-sm px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="w-4 h-4 text-primary" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
