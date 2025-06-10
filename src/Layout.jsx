import { Outlet } from 'react-router-dom';
import ApperIcon from './components/ApperIcon';

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-primary border-b border-surface-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-white">HR Employee Registry</h1>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-surface-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;