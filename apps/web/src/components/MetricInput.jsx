import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const MetricInput = ({
  id,
  label,
  value,
  onChange,
  prefix = '',
  suffix = '',
  placeholder = '0',
  min = 0,
  max = Infinity,
  step = 1,
  tooltip = '',
  error = '',
}) => {
  const [focused, setFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(raw);
    if (raw === '' || raw === '.') {
      onChange(0);
      return;
    }
    if (!isNaN(num)) {
      onChange(Math.min(Math.max(num, min), max));
    }
  };

  const formatDisplay = (val) => {
    if (prefix === '$') {
      return val.toLocaleString('en-US');
    }
    return val.toString();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground/90 cursor-pointer"
        >
          {label}
        </label>
        {tooltip && (
          <div className="relative">
            <button
              type="button"
              className="w-5 h-5 rounded-full bg-secondary text-muted-foreground text-xs flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              ?
            </button>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-7 z-50 w-56 p-3 rounded-lg bg-popover border border-border shadow-xl text-xs text-muted-foreground"
              >
                {tooltip}
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div
        className={`
          relative flex items-center rounded-lg border transition-all duration-200
          ${focused
            ? 'border-primary ring-2 ring-primary/20 bg-background'
            : error
              ? 'border-red-500/50 bg-background'
              : 'border-border bg-secondary/30 hover:border-border/60'
          }
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {prefix && (
          <span className="pl-4 text-muted-foreground font-medium select-none">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="decimal"
          value={focused ? value || '' : formatDisplay(value)}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          step={step}
          className="w-full px-3 py-3.5 bg-transparent text-foreground text-base font-medium outline-none placeholder:text-muted-foreground/40"
        />
        {suffix && (
          <span className="pr-4 text-muted-foreground font-medium select-none">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default MetricInput;
