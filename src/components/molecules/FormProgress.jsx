import React from 'react';
import { motion } from 'framer-motion';

const FormProgress = ({ progress }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-surface-700">Form Progress</h3>
        <span className="text-sm text-surface-600">{progress}%</span>
      </div>
      
      <div className="w-full bg-surface-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`h-2 rounded-full transition-colors duration-300 ${
            progress === 100 
              ? 'bg-success' 
              : progress >= 75 
                ? 'bg-accent' 
                : progress >= 50 
                  ? 'bg-warning' 
                  : 'bg-primary'
          }`}
        />
      </div>
      
      <div className="flex justify-between text-xs text-surface-500 mt-1">
        <span>Started</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

export default FormProgress;