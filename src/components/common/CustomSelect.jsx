import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error = '',
  className = '',
  selectClassName = '',
  disabled = false,
  required = false,
  name,
  id,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format options to array of objects { value, label }
  const formattedOptions = options.map((opt) => {
    if (opt && typeof opt === 'object') {
      const optValue = opt.value !== undefined ? opt.value : opt.id;
      const optLabel = opt.label || opt.name || opt.display_name || opt.text || String(optValue);
      return { value: optValue, label: optLabel };
    }
    return { value: opt, label: opt };
  });

  // Find currently selected option
  const selectedOption = formattedOptions.find((opt) => String(opt.value) === String(value));

  const handleOptionSelect = (optValue) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      // Mimic standard HTML select event object signature
      onChange({
        target: {
          name: name || selectId,
          value: optValue
        }
      });
    }
  };

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className={`flex flex-col gap-1.5 w-full relative ${className}`}>
      {label && (
        <label htmlFor={selectId} className={`text-xs font-semibold block ${error ? 'text-rose-600' : 'text-slate-700'}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative w-full">
        <button
          id={selectId}
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-left text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 flex justify-between items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-500 focus:ring-rose-500/20 bg-rose-50/10'
              : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20 bg-white'
          } ${selectClassName}`}
          {...props}
        >
          <span className={selectedOption ? 'text-slate-900 font-semibold' : 'text-slate-400 font-normal'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={`text-slate-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* Options Dropdown Menu */}
        {isOpen && (
          <ul className="absolute z-50 w-full mt-1.5 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-1 focus:outline-none animate-fadeIn left-0 right-0">
            {formattedOptions.length === 0 ? (
              <li className="px-3.5 py-2.5 text-xs text-slate-400 italic">No options available</li>
            ) : (
              formattedOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <li
                    key={`${opt.value}-${idx}`}
                    onClick={() => handleOptionSelect(opt.value)}
                    className={`px-3.5 py-2 text-xs cursor-pointer transition-colors duration-150 select-none flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <span className="text-indigo-600">✓</span>}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 mt-0.5">{error}</p>}
    </div>
  );
}
