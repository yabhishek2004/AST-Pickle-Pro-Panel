import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Orders from './components/Orders';
import Customers from './components/Customers';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import NotificationSystem, { useNotifications } from './components/NotificationSystem';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const notifications = useNotifications();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50">
        {/* Desktop Header */}
        <div className="flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AST Pickle Pro Panel</h1>
            <p className="text-gray-600">Manage your pickle business efficiently</p>
          </div>
          <NotificationSystem
            notifications={notifications.notifications}
            onMarkAsRead={notifications.markAsRead}
            onRemove={notifications.removeNotification}
            onClearAll={notifications.clearAll}
          />
        </div>

        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            activeView={activeView} 
            setActiveView={setActiveView}
          />

          {/* Main Content */}
          <div className="ml-64 min-h-screen flex-1">
            <div className="p-8">
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
