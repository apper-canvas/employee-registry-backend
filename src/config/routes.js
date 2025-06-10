import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import EmployeeList from '@/components/pages/EmployeeList';

export const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: HomePage
  },
  {
    path: '/home',
    name: 'Employee Form',
    component: HomePage
  },
  {
    path: '/employees',
    name: 'Employee List',
    component: EmployeeList
  },
  {
    path: '*',
    name: 'Not Found',
    component: NotFoundPage
  }
];