'use client';

import ReactSelect from 'react-select';

interface SelectProps {
  disabled?: boolean;
  label: string;
  options: Record<string, any>[];
  onChange: (value: Record<string, any>) => void;
  value?: Record<string, any>;
}

const Select: React.FC<SelectProps> = ({
  disabled,
  label,
  options,
  onChange,
  value,
}) => {
  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          classNames={{ control: () => 'text-sm' }} //  'classNames' and not 'className'
        />
      </div>
    </div>
  );
};

export default Select;

// The reason we are using 'menuPortalTarget' is because our 'auto-select' is inside a modal and this causes some
// problems with z-index and overflowing so we used this fix to target the document.body
