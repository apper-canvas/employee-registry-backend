import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Employee Registry',
    path: '/home',
    icon: 'Users',
component: HomePage
  }
};

export const routeArray = Object.values(routes);
// NotFoundPage can be added here if it were a dynamic route, but it's explicitly defined in App.jsx