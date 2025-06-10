import React from 'react';
import { motion } from 'framer-motion'; // Required for consistency with existing framer-motion usage

const Button = ({ onClick, children, className, disabled, type = 'button', ...props }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            {...props} // Pass through framer-motion props like whileHover, whileTap
        >
            {children}
        </motion.button>
    );
};

export default Button;