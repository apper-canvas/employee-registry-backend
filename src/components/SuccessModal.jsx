import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const SuccessModal = ({ employee, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center"
              >
                <ApperIcon name="CheckCircle" size={24} className="text-success" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Employee Successfully Registered!
                </h2>
                <p className="text-surface-600">
                  The employee information has been saved to the database.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Employee Summary */}
            <div className="bg-surface-50 rounded-lg p-4">
              <h3 className="font-medium text-surface-900 mb-3">Employee Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-surface-600">Full Name:</span>
                  <span className="ml-2 font-medium text-surface-900">{employee.fullName}</span>
                </div>
                <div>
                  <span className="text-surface-600">Employee ID:</span>
                  <span className="ml-2 font-medium text-surface-900">{employee.employeeId}</span>
                </div>
                <div>
                  <span className="text-surface-600">Email:</span>
                  <span className="ml-2 font-medium text-surface-900">{employee.email}</span>
                </div>
                <div>
                  <span className="text-surface-600">Phone:</span>
                  <span className="ml-2 font-medium text-surface-900">{employee.phone}</span>
                </div>
                <div>
                  <span className="text-surface-600">Department:</span>
                  <span className="ml-2 font-medium text-surface-900">{employee.department}</span>
                </div>
                <div>
                  <span className="text-surface-600">Designation:</span>
                  <span className="ml-2 font-medium text-surface-900">{employee.designation}</span>
                </div>
                <div>
                  <span className="text-surface-600">Date of Joining:</span>
                  <span className="ml-2 font-medium text-surface-900">
                    {formatDate(employee.dateOfJoining)}
                  </span>
                </div>
                <div>
                  <span className="text-surface-600">Emergency Contact:</span>
                  <span className="ml-2 font-medium text-surface-900">
                    {employee.emergencyContact.name} ({employee.emergencyContact.relationship})
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-accent/5 rounded-lg p-4">
              <h3 className="font-medium text-surface-900 mb-2">Next Steps</h3>
              <ul className="space-y-1 text-sm text-surface-700">
                <li className="flex items-center space-x-2">
                  <ApperIcon name="Check" size={14} className="text-success" />
                  <span>Employee record has been saved to the database</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={14} className="text-warning" />
                  <span>HR team will process the application within 2-3 business days</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ApperIcon name="Mail" size={14} className="text-info" />
                  <span>Confirmation email will be sent to {employee.email}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-surface-200 flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SuccessModal;