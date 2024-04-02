'use client';

import { FieldValues, UseFormRegister, FieldErrors } from 'react-hook-form';

interface MessageInputProps {
  id: string;
  type?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  register,
  errors,
  required,
  placeholder,
  type,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
