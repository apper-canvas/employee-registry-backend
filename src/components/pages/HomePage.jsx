import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmployeeForm from '@/components/organisms/EmployeeForm';
import SuccessModal from '@/components/organisms/SuccessModal';

const HomePage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEmployee, setSubmittedEmployee] = useState(null);

  const handleSubmitSuccess = (employeeData) => {
    setSubmittedEmployee(employeeData);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSubmittedEmployee(null);
  };

  return (
    <div className="min-h-full py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Page Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-surface-900">Employee Information Form</h2>
            <p className="mt-2 text-lg text-surface-600">
              Please fill out all required fields to register a new employee
            </p>
          </div>

          {/* Form Container */}
          <EmployeeForm onSubmitSuccess={handleSubmitSuccess} />
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            employee={submittedEmployee}
            onClose={handleCloseSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;