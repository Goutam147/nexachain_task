import React from 'react';

function Button({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  variant = 'primary', 
  className = '' 
}) {
  // Base classes (Roboto and 3-4px border radius)
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 px-4 text-sm rounded-[4px] shadow-sm hover:scale-[1.01]',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 py-2 px-4 text-sm rounded-[4px] shadow-xs active:bg-slate-300',
    simPrimary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 text-xs rounded-[4px] shadow-sm',
    simSecondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2 text-xs rounded-[4px] transition-colors',
    danger: 'text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 hover:bg-red-50/50 px-3 py-1.5 rounded-[4px]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
