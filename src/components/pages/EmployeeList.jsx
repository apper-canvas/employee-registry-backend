import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { employeeService } from '@/services';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter options from database schema
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

  // Load employees on component mount
  useEffect(() => {
    loadEmployees();
  }, []);

  // Apply filters and search when data or filters change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [employees, searchTerm, departmentFilter, designationFilter]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...employees];

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(employee => 
        (employee.full_name || '').toLowerCase().includes(term) ||
        (employee.employee_id || '').toLowerCase().includes(term) ||
        (employee.email || '').toLowerCase().includes(term)
      );
    }

    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter(employee => 
        employee.department === departmentFilter
      );
    }

    // Apply designation filter  
    if (designationFilter) {
      filtered = filtered.filter(employee =>
        employee.designation === designationFilter
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredEmployees(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ApperIcon name="ArrowUpDown" size={14} className="text-surface-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ApperIcon name="ArrowUp" size={14} className="text-primary" />
      : <ApperIcon name="ArrowDown" size={14} className="text-primary" />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setDesignationFilter('');
    setSortConfig({ key: null, direction: 'asc' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-surface-900">Employee Directory</h2>
              <p className="mt-2 text-lg text-surface-600">
                Search and manage employee information
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={loadEmployees}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <ApperIcon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-surface-700 mb-2">
                  Search Employees
                </label>
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
                  />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name, employee ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-lg border-surface-300 focus:border-primary focus:ring-primary"
                    aria-label="Search employees by name, employee ID, or email"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <label htmlFor="department-filter" className="block text-sm font-medium text-surface-700 mb-2">
                  Department
                </label>
                <select
                  id="department-filter"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full rounded-lg border-surface-300 focus:border-primary focus:ring-primary text-sm"
                  aria-label="Filter by department"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Designation Filter */}
              <div>
                <label htmlFor="designation-filter" className="block text-sm font-medium text-surface-700 mb-2">
                  Designation
                </label>
                <select
                  id="designation-filter"
                  value={designationFilter}
                  onChange={(e) => setDesignationFilter(e.target.value)}
                  className="w-full rounded-lg border-surface-300 focus:border-primary focus:ring-primary text-sm"
                  aria-label="Filter by designation"
                >
                  <option value="">All Designations</option>
                  {designations.map(designation => (
                    <option key={designation} value={designation}>{designation}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-surface-600">
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ApperIcon name="Loader" size={16} />
                    </motion.div>
                    <span>Loading employees...</span>
                  </span>
                ) : (
                  <span>
                    Showing {filteredEmployees.length} of {employees.length} employees
                  </span>
                )}
              </div>
              
              {(searchTerm || departmentFilter || designationFilter || sortConfig.key) && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-2 sm:mt-0 text-sm px-3 py-1 border-surface-300 text-surface-600 hover:bg-surface-50"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Loader" size={32} className="text-primary" />
                </motion.div>
                <span className="ml-3 text-lg text-surface-600">Loading employees...</span>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Users" size={48} className="mx-auto text-surface-400 mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">
                  {employees.length === 0 ? 'No employees found' : 'No matching employees'}
                </h3>
                <p className="text-surface-600 mb-4">
                  {employees.length === 0 
                    ? 'No employee records have been added yet.'
                    : 'Try adjusting your search terms or filters.'
                  }
                </p>
                {(searchTerm || departmentFilter || designationFilter) && (
                  <Button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-surface-200">
                  <thead className="bg-surface-50">
                    <tr>
                      <th 
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                        onClick={() => handleSort('full_name')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSort('full_name');
                          }
                        }}
                        aria-label="Sort by name"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          {getSortIcon('full_name')}
                        </div>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                        onClick={() => handleSort('employee_id')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSort('employee_id');
                          }
                        }}
                        aria-label="Sort by employee ID"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Employee ID</span>
                          {getSortIcon('employee_id')}
                        </div>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                        onClick={() => handleSort('department')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSort('department');
                          }
                        }}
                        aria-label="Sort by department"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Department</span>
                          {getSortIcon('department')}
                        </div>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                        onClick={() => handleSort('designation')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSort('designation');
                          }
                        }}
                        aria-label="Sort by designation"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Designation</span>
                          {getSortIcon('designation')}
                        </div>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                        onClick={() => handleSort('email')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSort('email');
                          }
                        }}
                        aria-label="Sort by email"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Email</span>
                          {getSortIcon('email')}
                        </div>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors"
                        onClick={() => handleSort('date_of_joining')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSort('date_of_joining');
                          }
                        }}
                        aria-label="Sort by joining date"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Joining Date</span>
                          {getSortIcon('date_of_joining')}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-surface-200">
                    {filteredEmployees.map((employee, index) => (
                      <motion.tr
                        key={employee.Id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="hover:bg-surface-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <ApperIcon name="User" size={20} className="text-primary" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-surface-900">
                                {employee.full_name || 'N/A'}
                              </div>
                              {employee.phone && (
                                <div className="text-sm text-surface-500">
                                  {employee.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                          {employee.employee_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {employee.department && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                              {employee.department}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                          {employee.designation || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                          {employee.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                          {formatDate(employee.date_of_joining)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeList;