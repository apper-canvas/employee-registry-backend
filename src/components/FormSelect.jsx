import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false, 
  options = [], 
  placeholder = 'Select an option' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(name, option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-1 max-w-full">
      <label className="block text-sm font-medium text-surface-700">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.99 }}
          className={`
            w-full px-3 py-2.5 border rounded-lg transition-all duration-200 text-left
            flex items-center justify-between max-w-full
            ${error 
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
              : isOpen
                ? 'border-accent focus:border-accent focus:ring-2 focus:ring-accent/20'
                : 'border-surface-300 focus:border-accent focus:ring-2 focus:ring-accent/20'
            }
            ${value ? 'text-surface-900' : 'text-surface-400'}
          `}
        >
          <span className="truncate">{value || placeholder}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="ChevronDown" size={16} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-1 bg-white border border-surface-200 rounded-lg shadow-lg max-h-60 overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-2 border-b border-surface-200">
                <div className="relative">
                  <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search options..."
                    className="w-full pl-10 pr-3 py-2 border border-surface-300 rounded focus:outline-none focus:border-accent text-sm max-w-full"
                  />
                </div>
              </div>

              {/* Options List */}
              <div className="overflow-y-auto max-h-44">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-surface-500 text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(option)}
                      whileHover={{ backgroundColor: '#F7FAFC' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={`
                        w-full px-3 py-2 text-left text-sm transition-colors duration-150 break-words
                        ${value === option 
                          ? 'bg-accent/10 text-accent font-medium' 
                          : 'text-surface-900 hover:bg-surface-50'
                        }
                      `}
                    >
                      {option}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FormSelect;