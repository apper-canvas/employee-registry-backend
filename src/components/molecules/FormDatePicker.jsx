import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const FormDatePicker = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get date one year ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const minDate = oneYearAgo.toISOString().split('T')[0];

  return (
    <div className="space-y-1 max-w-full">
      <label htmlFor={name} className="block text-sm font-medium text-surface-700">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      <div className="relative">
        <Input
          id={name}
          type="date"
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          min={minDate}
          max={today}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
          className={`
            ${error 
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
              : isFocused
                ? 'border-accent focus:border-accent focus:ring-2 focus:ring-accent/20'
                : 'border-surface-300 focus:border-accent focus:ring-2 focus:ring-accent/20'
            }
          `}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="Calendar" size={16} className="text-surface-400" />
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1 text-sm text-error"
          >
            <ApperIcon name="AlertCircle" size={14} />
            <span className="break-words">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormDatePicker;