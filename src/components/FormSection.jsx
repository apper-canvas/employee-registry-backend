import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FormSection = ({ title, description, icon, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-surface-200 p-6 max-w-full overflow-hidden"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
          <ApperIcon name={icon} size={16} className="text-accent" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-surface-900 break-words">{title}</h3>
          <p className="text-sm text-surface-600 break-words">{description}</p>
        </div>
      </div>
      
      <div className="space-y-6 max-w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default FormSection;