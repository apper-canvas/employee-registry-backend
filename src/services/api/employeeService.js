import employeesData from '../mockData/employees.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate local database with IndexedDB-like behavior
let employees = [...employeesData];

const employeeService = {
  async getAll() {
    await delay(300);
    return [...employees];
  },

  async getById(id) {
    await delay(250);
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return { ...employee };
  },

  async create(employeeData) {
    await delay(500);
    
    // Check for duplicate employee ID
    const existingEmployee = employees.find(emp => emp.employeeId === employeeData.employeeId);
    if (existingEmployee) {
      throw new Error('Employee ID already exists');
    }

    // Check for duplicate email
    const existingEmail = employees.find(emp => emp.email === employeeData.email);
    if (existingEmail) {
      throw new Error('Email address already exists');
    }

    const newEmployee = {
      id: Date.now().toString(),
      ...employeeData,
      submittedAt: new Date().toISOString()
    };

    employees.push(newEmployee);
    
    // Simulate IndexedDB storage
    try {
      localStorage.setItem('hr_employees', JSON.stringify(employees));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }

    return { ...newEmployee };
  },

  async update(id, updateData) {
    await delay(400);
    
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }

    // Check for duplicate employee ID if it's being updated
    if (updateData.employeeId && updateData.employeeId !== employees[index].employeeId) {
      const existingEmployee = employees.find(emp => emp.employeeId === updateData.employeeId);
      if (existingEmployee) {
        throw new Error('Employee ID already exists');
      }
    }

    // Check for duplicate email if it's being updated
    if (updateData.email && updateData.email !== employees[index].email) {
      const existingEmail = employees.find(emp => emp.email === updateData.email);
      if (existingEmail) {
        throw new Error('Email address already exists');
      }
    }

    employees[index] = {
      ...employees[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('hr_employees', JSON.stringify(employees));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }

    return { ...employees[index] };
  },

  async delete(id) {
    await delay(300);
    
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      throw new Error('Employee not found');
    }

    const deletedEmployee = employees.splice(index, 1)[0];

    try {
      localStorage.setItem('hr_employees', JSON.stringify(employees));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }

    return { ...deletedEmployee };
  },

  async search(query) {
    await delay(250);
    
    const searchTerm = query.toLowerCase();
    const filteredEmployees = employees.filter(emp => 
      emp.fullName.toLowerCase().includes(searchTerm) ||
      emp.employeeId.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm) ||
      emp.designation.toLowerCase().includes(searchTerm)
    );

    return [...filteredEmployees];
  },

  async getByDepartment(department) {
    await delay(200);
    
    const departmentEmployees = employees.filter(emp => 
      emp.department.toLowerCase() === department.toLowerCase()
    );

    return [...departmentEmployees];
  }
};

// Initialize from localStorage if available
try {
  const stored = localStorage.getItem('hr_employees');
  if (stored) {
    employees = JSON.parse(stored);
  }
} catch (error) {
  console.warn('Could not load from localStorage:', error);
}

export default employeeService;