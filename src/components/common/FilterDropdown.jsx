import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * FilterDropdown component
 * 
 * Props:
 * - config: Array of filter configurations:
 *   [
 *     {
 *       id: 'dateRange',
 *       label: 'Date range',
 *       type: 'date-range',
 *       defaultValue: { from: '', to: '' }
 *     },
 *     {
 *       id: 'status',
 *       label: 'Status',
 *       type: 'select',
 *       options: [{ value: 'all', label: 'All Status' }, ...],
 *       defaultValue: 'all'
 *     },
 *     {
 *       id: 'search',
 *       label: 'Keyword search',
 *       type: 'text',
 *       placeholder: 'Search...',
 *       defaultValue: ''
 *     }
 *   ]
 * - value: The current active filters state object, e.g. { status: 'all', search: '', dateRange: { from: '', to: '' } }
 * - onApply: Function callback triggered when "Apply now" is clicked, receives the final filter values object
 * - align: 'left' | 'right' (dropdown alignment relative to the button)
 */
export default function FilterDropdown({
  config = [],
  value = {},
  onApply,
  align = 'right'
}) {
  const [isOpen, setIsOpen] = useState(false);
  // Local temporary state while editing filters before clicking "Apply now"
  const [localValues, setLocalValues] = useState({});
  const dropdownRef = useRef(null);
  const [openSelectId, setOpenSelectId] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize and sync local values with current value prop when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const initialValues = {};
      config.forEach(f => {
        initialValues[f.id] = value[f.id] !== undefined ? value[f.id] : (f.defaultValue ?? '');
      });
      setLocalValues(initialValues);
    }
  }, [isOpen, config, value]);

  // Close dropdown on click outside (only active on desktop viewports)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile) return; // Backdrop handles click outside closing on mobile
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setOpenSelectId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setOpenSelectId(null);
  };

  const handleLocalChange = (id, newVal) => {
    setLocalValues(prev => ({
      ...prev,
      [id]: newVal
    }));
  };

  const handleResetSection = (filterItem) => {
    const defaultVal = filterItem.defaultValue !== undefined
      ? filterItem.defaultValue
      : (filterItem.type === 'date-range' ? { from: '', to: '' } : filterItem.type === 'select' ? (filterItem.options[0]?.value || '') : '');
    
    handleLocalChange(filterItem.id, defaultVal);
  };

  const handleResetAll = () => {
    const resetValues = {};
    config.forEach(f => {
      resetValues[f.id] = f.defaultValue !== undefined
        ? f.defaultValue
        : (f.type === 'date-range' ? { from: '', to: '' } : f.type === 'select' ? (f.options[0]?.value || '') : '');
    });
    setLocalValues(resetValues);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(localValues);
    }
    setIsOpen(false);
  };

  // Determine if any filters are active (not equal to their default values)
  const isFilterActive = () => {
    return config.some(f => {
      const current = value[f.id];
      const defaultVal = f.defaultValue;
      if (f.type === 'date-range') {
        const defaultFrom = defaultVal?.from || '';
        const defaultTo = defaultVal?.to || '';
        const currentFrom = current?.from || '';
        const currentTo = current?.to || '';
        return currentFrom !== defaultFrom || currentTo !== defaultTo;
      }
      return current !== undefined && current !== defaultVal;
    });
  };

  const activeFiltersCount = config.filter(f => {
    const current = value[f.id];
    const defaultVal = f.defaultValue;
    if (f.type === 'date-range') {
      const defaultFrom = defaultVal?.from || '';
      const defaultTo = defaultVal?.to || '';
      const currentFrom = current?.from || '';
      const currentTo = current?.to || '';
      return currentFrom !== defaultFrom || currentTo !== defaultTo;
    }
    return current !== undefined && current !== defaultVal;
  }).length;

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Filter Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 focus:outline-none shadow-sm ${
          isOpen || isFilterActive()
            ? 'border-indigo-650 bg-indigo-50/60 text-indigo-700 hover:bg-indigo-50 shadow-indigo-100'
            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span>Filter</span>
        {activeFiltersCount > 0 && (
          <span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px] font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        isMobile ? (
          createPortal(
            <>
              {/* Mobile backdrop overlay */}
              <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[99] animate-fadeIn"
                onClick={() => setIsOpen(false)}
              />

              <div
                className="fixed top-1/2 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-xs rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden focus:outline-none animate-mobileFadeIn"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="font-bold text-slate-800 text-sm">Filter</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs focus:outline-none cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Body Content */}
                <div className="max-h-[60vh] overflow-y-auto px-5 py-1 divide-y divide-slate-100">
                  {config.map((filterItem) => {
                    const localVal = localValues[filterItem.id];
                    const isDefaultVal = (() => {
                      const defaultVal = filterItem.defaultValue;
                      if (filterItem.type === 'date-range') {
                        const defaultFrom = defaultVal?.from || '';
                        const defaultTo = defaultVal?.to || '';
                        const localFrom = localVal?.from || '';
                        const localTo = localVal?.to || '';
                        return localFrom === defaultFrom && localTo === defaultTo;
                      }
                      return localVal === defaultVal;
                    })();

                    return (
                      <div key={filterItem.id} className="py-3 flex flex-col gap-2">
                        {/* Label & Reset link */}
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">
                            {filterItem.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleResetSection(filterItem)}
                            disabled={isDefaultVal}
                            className={`text-[11px] font-semibold transition-colors duration-150 ${
                              !isDefaultVal
                                ? 'text-indigo-650 hover:text-indigo-855 hover:underline cursor-pointer'
                                : 'text-slate-300 cursor-default'
                            }`}
                          >
                            Reset
                          </button>
                        </div>

                        {/* Filter Fields depending on type */}
                        {filterItem.type === 'date-range' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-500 font-medium">From:</label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={localVal?.from || ''}
                                  onChange={(e) => handleLocalChange(filterItem.id, { ...(localVal || {}), from: e.target.value })}
                                  className="w-full pl-2.5 pr-8 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all bg-white custom-date-input"
                                />
                                <span className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none text-xs">📅</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-500 font-medium">To:</label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={localVal?.to || ''}
                                  onChange={(e) => handleLocalChange(filterItem.id, { ...(localVal || {}), to: e.target.value })}
                                  className="w-full pl-2.5 pr-8 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all bg-white custom-date-input"
                                />
                                <span className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none text-xs">📅</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {filterItem.type === 'select' && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setOpenSelectId(openSelectId === filterItem.id ? null : filterItem.id)}
                              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white text-xs text-left text-slate-800 transition-all duration-150 focus:outline-none focus:border-indigo-600 flex justify-between items-center gap-2 cursor-pointer font-medium"
                            >
                              <span className="truncate">
                                {filterItem.options.find(opt => String(opt.value) === String(localVal))?.label || filterItem.placeholder || 'Select option'}
                              </span>
                              <span className={`text-[10px] text-slate-400 transition-transform ${openSelectId === filterItem.id ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </button>

                            {openSelectId === filterItem.id && (
                              <ul className="absolute z-[100] w-full mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1 left-0 right-0">
                                {filterItem.options.map((opt) => {
                                  const isSelected = String(opt.value) === String(localVal);
                                  return (
                                    <li
                                      key={opt.value}
                                      onClick={() => {
                                        handleLocalChange(filterItem.id, opt.value);
                                        setOpenSelectId(null);
                                      }}
                                      className={`px-3.5 py-2 text-xs cursor-pointer transition-colors duration-100 flex items-center justify-between ${
                                        isSelected
                                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                          : 'text-slate-700 hover:bg-slate-50'
                                      }`}
                                    >
                                      <span className="flex items-center gap-1.5">
                                        {opt.bullet && (
                                          <span className={`w-2 h-2 rounded-full ${opt.bullet}`} />
                                        )}
                                        <span>{opt.label}</span>
                                      </span>
                                      {isSelected && <span className="text-indigo-600 font-bold">✓</span>}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        )}

                        {filterItem.type === 'text' && (
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={filterItem.placeholder || 'Search...'}
                              value={localVal || ''}
                              onChange={(e) => handleLocalChange(filterItem.id, e.target.value)}
                              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all bg-white"
                            />
                            <span className="absolute left-2.5 top-3 text-slate-400 pointer-events-none text-xs">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 gap-3">
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-4 py-2.5 border border-slate-350 hover:border-slate-400 bg-white text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs flex-1 transition-all cursor-pointer text-center"
                  >
                    Reset all
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl text-xs flex-1 shadow-md shadow-indigo-500/10 transition-all cursor-pointer text-center"
                  >
                    Apply now
                  </button>
                </div>
              </div>
            </>,
            document.body
          )
        ) : (
          <div
            className={`absolute z-50 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden focus:outline-none animate-fadeIn ${
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
            }`}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="font-bold text-slate-800 text-sm">Filter</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs focus:outline-none cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body Content */}
            <div className="max-h-[480px] overflow-y-auto px-5 py-1 divide-y divide-slate-100">
              {config.map((filterItem) => {
                const localVal = localValues[filterItem.id];
                const isDefaultVal = (() => {
                  const defaultVal = filterItem.defaultValue;
                  if (filterItem.type === 'date-range') {
                    const defaultFrom = defaultVal?.from || '';
                    const defaultTo = defaultVal?.to || '';
                    const localFrom = localVal?.from || '';
                    const localTo = localVal?.to || '';
                    return localFrom === defaultFrom && localTo === defaultTo;
                  }
                  return localVal === defaultVal;
                })();

                return (
                  <div key={filterItem.id} className="py-3 flex flex-col gap-2">
                    {/* Label & Reset link */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">
                        {filterItem.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResetSection(filterItem)}
                        disabled={isDefaultVal}
                        className={`text-[11px] font-semibold transition-colors duration-150 ${
                          !isDefaultVal
                            ? 'text-indigo-650 hover:text-indigo-855 hover:underline cursor-pointer'
                            : 'text-slate-300 cursor-default'
                        }`}
                      >
                        Reset
                      </button>
                    </div>

                    {/* Filter Fields depending on type */}
                    {filterItem.type === 'date-range' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-500 font-medium">From:</label>
                          <div className="relative">
                            <input
                              type="date"
                              value={localVal?.from || ''}
                              onChange={(e) => handleLocalChange(filterItem.id, { ...(localVal || {}), from: e.target.value })}
                              className="w-full pl-2.5 pr-8 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all bg-white custom-date-input"
                            />
                            <span className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none text-xs">📅</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-500 font-medium">To:</label>
                          <div className="relative">
                            <input
                              type="date"
                              value={localVal?.to || ''}
                              onChange={(e) => handleLocalChange(filterItem.id, { ...(localVal || {}), to: e.target.value })}
                              className="w-full pl-2.5 pr-8 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all bg-white custom-date-input"
                            />
                            <span className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none text-xs">📅</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {filterItem.type === 'select' && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenSelectId(openSelectId === filterItem.id ? null : filterItem.id)}
                          className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white text-xs text-left text-slate-800 transition-all duration-150 focus:outline-none focus:border-indigo-600 flex justify-between items-center gap-2 cursor-pointer font-medium"
                        >
                          <span className="truncate">
                            {filterItem.options.find(opt => String(opt.value) === String(localVal))?.label || filterItem.placeholder || 'Select option'}
                          </span>
                          <span className={`text-[10px] text-slate-400 transition-transform ${openSelectId === filterItem.id ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>

                        {openSelectId === filterItem.id && (
                          <ul className="absolute z-[100] w-full mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1 left-0 right-0">
                            {filterItem.options.map((opt) => {
                              const isSelected = String(opt.value) === String(localVal);
                              return (
                                <li
                                  key={opt.value}
                                  onClick={() => {
                                    handleLocalChange(filterItem.id, opt.value);
                                    setOpenSelectId(null);
                                  }}
                                  className={`px-3.5 py-2 text-xs cursor-pointer transition-colors duration-100 flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                      : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5">
                                    {opt.bullet && (
                                      <span className={`w-2 h-2 rounded-full ${opt.bullet}`} />
                                    )}
                                    <span>{opt.label}</span>
                                  </span>
                                  {isSelected && <span className="text-indigo-600 font-bold">✓</span>}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}

                    {filterItem.type === 'text' && (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={filterItem.placeholder || 'Search...'}
                          value={localVal || ''}
                          onChange={(e) => handleLocalChange(filterItem.id, e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-all bg-white"
                        />
                        <span className="absolute left-2.5 top-3 text-slate-400 pointer-events-none text-xs">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 gap-3">
              <button
                type="button"
                onClick={handleResetAll}
                className="px-4 py-2.5 border border-slate-350 hover:border-slate-400 bg-white text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs flex-1 transition-all cursor-pointer text-center"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl text-xs flex-1 shadow-md shadow-indigo-500/10 transition-all cursor-pointer text-center"
              >
                Apply now
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
