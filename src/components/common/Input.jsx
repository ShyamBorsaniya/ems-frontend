import React from 'react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  icon = null,
  className = '',
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">{label}</label>}
      <div className="relative flex items-center w-full">
        {icon && <span className="absolute left-3.5 text-slate-400 text-sm pointer-events-none">{icon}</span>}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full py-2.5 px-3.5 ${icon ? 'pl-10' : ''} rounded-xl bg-white border text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20'
          }`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
    </div>
  );
}
