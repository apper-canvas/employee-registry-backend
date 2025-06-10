import React from 'react';
import { motion } from 'framer-motion'; // Required for consistency with existing framer-motion usage

const Input = ({ type = 'text', className, ...props }) => {
    return (
        <motion.input
            type={type}
            className={`
                w-full px-3 py-2.5 border rounded-lg transition-all duration-200 max-w-full
                placeholder:text-surface-400 text-surface-900
                disabled:bg-surface-50 disabled:text-surface-500
                ${className || ''}
            `}
            {...props} // Pass through name, value, onChange, onFocus, onBlur, min, max, whileFocus, transition
        />
    );
};

export default Input;