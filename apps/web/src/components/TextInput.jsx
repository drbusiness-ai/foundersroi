import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  tooltip = '',
  error = '',
  maxLength = 100,
}) => {
  const [focused, setFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      onChange(text);
    }
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
      >
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3.5 bg-transparent text-foreground text-base font-medium outline-none placeholder:text-muted-foreground/40"
        />
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

export default TextInput;
