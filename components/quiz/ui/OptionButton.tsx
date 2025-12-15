import React from 'react';

type OptionButtonProps = {
  text: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
};

const OptionButton: React.FC<OptionButtonProps> = ({ 
  text, 
  selected = false, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-6 py-4 text-left rounded-lg
        border-2 border-b-4
        transition-all duration-200
        font-medium text-lg
        ${
          selected
            ? 'bg-blue-500 text-white border-blue-700 translate-y-1 border-b-2'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 active:translate-y-1 active:border-b-2'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {text}
    </button>
  );
};

export default OptionButton;
