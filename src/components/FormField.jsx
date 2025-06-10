import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false, 
  placeholder = '', 
  icon 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="space-y-1 max-w-full">
      <label className="block text-sm font-medium text-surface-700">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
        
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
          className={`
            w-full px-3 py-2.5 border rounded-lg transition-all duration-200 max-w-full
            ${icon ? 'pl-10' : ''}
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
      </div>
      
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
    </div>
  );
};

export default FormField;