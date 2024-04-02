'use client';

import clsx from 'clsx';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  register,
  required,
  errors,
  disabled,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `form-input 
             block 
             w-full 
             rounded-md 
             border-0 
             py-1.5 
             text-gray-900 
             shadow-sm 
             ring-1 
             ring-inset 
             ring-gray-300 
             placeholder:text-gray-400 
             focus:ring-2 
             focus:ring-inset 
             focus:ring-sky-600 
             sm:text-sm 
             sm:leading-6`,
            errors[id] && 'focus:ring-rose-500',
            disabled && 'opacity-50 cursor-default'
          )}
        />
      </div>
    </div>
  );
};

export default Input;

// we install the package @tailwindcss/forms and use it in our tailwindconfig.ts file, inside the 'plugins' array
// clsx is a library that allows us to dynamically re-use our classes
// we can use backticks when writing lengthy classes to enable us collapse them into multiple lines
// 'form-input' class usually does not exist in tailwind but it works here for us because of the '@tailwindcss/forms' package we installed and added to our plugins
