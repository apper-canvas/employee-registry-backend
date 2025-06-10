import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// ApperIcon is not used in the original FormTextarea, so no import needed

const FormTextarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false, 
  placeholder = '',
  maxLength = 500
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  const remainingChars = maxLength - (value?.length || 0);

  return (
    <div className="space-y-1 max-w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="block text-sm font-medium text-surface-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <span className={`text-xs ${remainingChars < 50 ? 'text-warning' : 'text-surface-500'}`}>
          {remainingChars} characters remaining
        </span>
      </div>
      
      <motion.textarea
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        whileFocus={{ scale: 1.005 }}
        transition={{ duration: 0.15 }}
        className={`
          w-full px-3 py-2.5 border rounded-lg transition-all duration-200 resize-none max-w-full
          ${error 
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
            : isFocused
              ? 'border-accent focus:border-accent focus:ring-2 focus:ring-accent/20'
              : 'border-surface-300 focus:border-accent focus:ring-2 focus:ring-accent/20'
          }
          placeholder:text-surface-400 text-surface-900
          disabled:bg-surface-50 disabled:text-surface-500
        `}
      />
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1 text-sm text-error"
          >
            {/* ApperIcon is not in original FormTextarea's error message, so we keep it text only */}
            <span className="break-words">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormTextarea;