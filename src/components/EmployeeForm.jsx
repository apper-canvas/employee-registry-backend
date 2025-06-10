import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormSection from './FormSection';
import FormField from './FormField';
import FormSelect from './FormSelect';
import FormDatePicker from './FormDatePicker';
import FormTextarea from './FormTextarea';
import FileUpload from './FileUpload';
import FormProgress from './FormProgress';
import ApperIcon from './ApperIcon';
import { employeeService } from '../services';

const EmployeeForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    dateOfJoining: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    resumeFile: null,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Human Resources',
    'Engineering',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Customer Support',
    'Product Management',
    'Quality Assurance',
    'Design'
  ];

  const designations = [
    'Manager',
    'Senior Developer',
    'Developer',
    'Junior Developer',
    'Team Lead',
    'Director',
    'Vice President',
    'Executive',
    'Analyst',
    'Specialist',
    'Coordinator',
    'Associate',
    'Intern'
  ];

  const relationships = [
    'Spouse',
    'Parent',
    'Sibling',
    'Child',
    'Friend',
    'Relative',
    'Other'
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'employeeId':
        if (!value.trim()) {
          newErrors.employeeId = 'Employee ID is required';
        } else if (!/^[A-Z0-9]{3,10}$/.test(value.trim())) {
          newErrors.employeeId = 'Employee ID must be 3-10 characters (letters and numbers)';
        } else {
          delete newErrors.employeeId;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(value.trim())) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'department':
        if (!value) {
          newErrors.department = 'Department is required';
        } else {
          delete newErrors.department;
        }
        break;

      case 'designation':
        if (!value) {
          newErrors.designation = 'Designation is required';
        } else {
          delete newErrors.designation;
        }
        break;

      case 'dateOfJoining':
        if (!value) {
          newErrors.dateOfJoining = 'Date of joining is required';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(today.getFullYear() - 1);
          
          if (selectedDate > today) {
            newErrors.dateOfJoining = 'Date of joining cannot be in the future';
          } else if (selectedDate < oneYearAgo) {
            newErrors.dateOfJoining = 'Date of joining cannot be more than 1 year ago';
          } else {
            delete newErrors.dateOfJoining;
          }
        }
        break;

      case 'emergencyContact.name':
        if (!value.trim()) {
          newErrors['emergencyContact.name'] = 'Emergency contact name is required';
        } else {
          delete newErrors['emergencyContact.name'];
        }
        break;

      case 'emergencyContact.relationship':
        if (!value) {
          newErrors['emergencyContact.relationship'] = 'Relationship is required';
        } else {
          delete newErrors['emergencyContact.relationship'];
        }
        break;

      case 'emergencyContact.phone':
        if (!value.trim()) {
          newErrors['emergencyContact.phone'] = 'Emergency contact phone is required';
        } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(value.trim())) {
          newErrors['emergencyContact.phone'] = 'Please enter a valid phone number';
        } else {
          delete newErrors['emergencyContact.phone'];
        }
        break;

      case 'emergencyContact.email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors['emergencyContact.email'] = 'Please enter a valid email address';
        } else {
          delete newErrors['emergencyContact.email'];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Validate field on change
    validateField(name, value);
  };

  const handleFileUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      resumeFile: file
    }));
  };

  const calculateProgress = () => {
    const requiredFields = [
      'fullName',
      'employeeId', 
      'email',
      'phone',
      'department',
      'designation',
      'dateOfJoining',
      'emergencyContact.name',
      'emergencyContact.relationship',
      'emergencyContact.phone'
    ];

    let filledCount = 0;
    
    requiredFields.forEach(field => {
      if (field.startsWith('emergencyContact.')) {
        const subField = field.split('.')[1];
        if (formData.emergencyContact[subField]?.trim()) {
          filledCount++;
        }
      } else {
        if (formData[field]?.trim && formData[field].trim()) {
          filledCount++;
        } else if (formData[field] && !formData[field].trim) {
          filledCount++;
        }
      }
    });

    return Math.round((filledCount / requiredFields.length) * 100);
  };

  const validateForm = () => {
    const requiredFields = [
      'fullName',
      'employeeId',
      'email', 
      'phone',
      'department',
      'designation',
      'dateOfJoining',
      'emergencyContact.name',
      'emergencyContact.relationship',
      'emergencyContact.phone'
    ];

    let isValid = true;
    const newErrors = {};

    requiredFields.forEach(field => {
      let value;
      if (field.startsWith('emergencyContact.')) {
        const subField = field.split('.')[1];
        value = formData.emergencyContact[subField];
      } else {
        value = formData[field];
      }

      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    // Check for existing errors
    if (Object.keys(errors).length > 0) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        ...formData,
        submittedAt: new Date().toISOString()
      };

      const result = await employeeService.create(employeeData);
      
      toast.success('Employee information submitted successfully!');
      onSubmitSuccess(result);
      
      // Reset form
      setFormData({
        fullName: '',
        employeeId: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        dateOfJoining: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        },
        resumeFile: null,
        notes: ''
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit employee information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = calculateProgress();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-full overflow-hidden"
    >
      {/* Progress Indicator */}
      <FormProgress progress={progress} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <FormSection
          title="Personal Information"
          description="Basic employee details and contact information"
          icon="User"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
              required
              placeholder="Enter full name"
            />
            
            <FormField
              label="Employee ID"
              name="employeeId"
              type="text"
              value={formData.employeeId}
              onChange={handleInputChange}
              error={errors.employeeId}
              required
              placeholder="e.g., EMP001"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              placeholder="employee@company.com"
            />
            
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              required
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </FormSection>

        {/* Work Details Section */}
        <FormSection
          title="Work Details"
          description="Employment information and role details"
          icon="Briefcase"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              error={errors.department}
              required
              options={departments}
              placeholder="Select department"
            />
            
            <FormSelect
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              error={errors.designation}
              required
              options={designations}
              placeholder="Select designation"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDatePicker
              label="Date of Joining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleInputChange}
              error={errors.dateOfJoining}
              required
            />
            <div></div>
          </div>
        </FormSection>

        {/* Emergency Contact Section */}
        <FormSection
          title="Emergency Contact"
          description="Contact person in case of emergency"
          icon="Phone"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Contact Name"
              name="emergencyContact.name"
              type="text"
              value={formData.emergencyContact.name}
              onChange={handleInputChange}
              error={errors['emergencyContact.name']}
              required
              placeholder="Emergency contact name"
            />
            
            <FormSelect
              label="Relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleInputChange}
              error={errors['emergencyContact.relationship']}
              required
              options={relationships}
              placeholder="Select relationship"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Contact Phone"
              name="emergencyContact.phone"
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={handleInputChange}
              error={errors['emergencyContact.phone']}
              required
              placeholder="+1 (555) 123-4567"
            />
            
            <FormField
              label="Contact Email"
              name="emergencyContact.email"
              type="email"
              value={formData.emergencyContact.email}
              onChange={handleInputChange}
              error={errors['emergencyContact.email']}
              placeholder="contact@email.com (optional)"
            />
          </div>
        </FormSection>

        {/* Documents Section */}
        <FormSection
          title="Documents & Additional Information"
          description="Upload resume and add any additional notes"
          icon="FileText"
        >
          <FileUpload
            onFileUpload={handleFileUpload}
            currentFile={formData.resumeFile}
          />

          <FormTextarea
            label="Notes or Comments"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional information or comments (optional)"
            maxLength={500}
          />
        </FormSection>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <motion.button
            type="submit"
            disabled={isSubmitting || progress < 100}
            whileHover={!isSubmitting && progress >= 100 ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting && progress >= 100 ? { scale: 0.98 } : {}}
            className={`
              px-8 py-3 rounded-lg font-medium text-white transition-all duration-200
              flex items-center space-x-2 min-w-[200px] justify-center
              ${isSubmitting || progress < 100
                ? 'bg-surface-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Loader" size={16} />
                </motion.div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Send" size={16} />
                <span>Submit Employee Information</span>
              </>
            )}
          </motion.button>
        </div>

        {progress < 100 && (
          <p className="text-center text-sm text-surface-500">
            Complete all required fields to submit the form
          </p>
        )}
      </form>
    </motion.div>
  );
};

export default EmployeeForm;