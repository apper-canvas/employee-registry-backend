import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const tableName = 'employee';

const employeeService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'full_name', 'employee_id', 'email', 'phone', 'department', 'designation',
          'date_of_joining', 'emergency_contact_name', 'emergency_contact_relationship',
          'emergency_contact_phone', 'emergency_contact_email', 'resume_file_name',
          'resume_file_size', 'resume_file_type', 'resume_file_upload_date', 'notes', 'submitted_at'
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'full_name', 'employee_id', 'email', 'phone', 'department', 'designation',
          'date_of_joining', 'emergency_contact_name', 'emergency_contact_relationship',
          'emergency_contact_phone', 'emergency_contact_email', 'resume_file_name',
          'resume_file_size', 'resume_file_type', 'resume_file_upload_date', 'notes', 'submitted_at'
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response || !response.data) {
        throw new Error('Employee not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  },

  async create(employeeData) {
    try {
      const apperClient = getApperClient();
      
      // Map form data to database fields (only Updateable fields)
      const recordData = {
        Name: employeeData.fullName,
        full_name: employeeData.fullName,
        employee_id: employeeData.employeeId,
        email: employeeData.email,
        phone: employeeData.phone,
        department: employeeData.department,
        designation: employeeData.designation,
        date_of_joining: employeeData.dateOfJoining,
        emergency_contact_name: employeeData.emergencyContact.name,
        emergency_contact_relationship: employeeData.emergencyContact.relationship,
        emergency_contact_phone: employeeData.emergencyContact.phone,
        emergency_contact_email: employeeData.emergencyContact.email || '',
        notes: employeeData.notes || '',
        submitted_at: new Date().toISOString()
      };
      
      // Add resume file information if present
      if (employeeData.resumeFile) {
        recordData.resume_file_name = employeeData.resumeFile.name;
        recordData.resume_file_size = employeeData.resumeFile.size;
        recordData.resume_file_type = employeeData.resumeFile.type;
        recordData.resume_file_upload_date = new Date().toISOString();
      }
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      // Handle response
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          // CRITICAL: Log all failures at once
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulRecords.length === 0) {
            throw new Error('Failed to create employee record');
          }
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      // Map form data to database fields (only Updateable fields)
      const recordData = {
        Id: parseInt(id),
        Name: updateData.fullName,
        full_name: updateData.fullName,
        employee_id: updateData.employeeId,
        email: updateData.email,
        phone: updateData.phone,
        department: updateData.department,
        designation: updateData.designation,
        date_of_joining: updateData.dateOfJoining,
        emergency_contact_name: updateData.emergencyContact.name,
        emergency_contact_relationship: updateData.emergencyContact.relationship,
        emergency_contact_phone: updateData.emergencyContact.phone,
        emergency_contact_email: updateData.emergencyContact.email || '',
        notes: updateData.notes || ''
      };
      
      // Add resume file information if present
      if (updateData.resumeFile) {
        recordData.resume_file_name = updateData.resumeFile.name;
        recordData.resume_file_size = updateData.resumeFile.size;
        recordData.resume_file_type = updateData.resumeFile.type;
        recordData.resume_file_upload_date = new Date().toISOString();
      }
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      // Handle response
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          // CRITICAL: Log all failures at once
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulUpdates.length === 0) {
            throw new Error('Failed to update employee record');
          }
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      // Handle response
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          // CRITICAL: Log all failures at once
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          
          return failedDeletions.length === 0;
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'full_name', 'employee_id', 'email', 'phone', 'department', 'designation',
          'date_of_joining', 'emergency_contact_name', 'emergency_contact_relationship',
          'emergency_contact_phone', 'emergency_contact_email', 'resume_file_name',
          'resume_file_size', 'resume_file_type', 'resume_file_upload_date', 'notes', 'submitted_at'
        ],
        where: [
          {
            fieldName: "full_name",
            operator: "Contains",
            values: [query]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error searching employees:", error);
      throw error;
    }
  },

  async getByDepartment(department) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'full_name', 'employee_id', 'email', 'phone', 'department', 'designation',
          'date_of_joining', 'emergency_contact_name', 'emergency_contact_relationship',
          'emergency_contact_phone', 'emergency_contact_email', 'resume_file_name',
          'resume_file_size', 'resume_file_type', 'resume_file_upload_date', 'notes', 'submitted_at'
        ],
        where: [
          {
            fieldName: "department",
            operator: "ExactMatch",
            values: [department]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching employees by department:", error);
      throw error;
    }
  }
};

export default employeeService;