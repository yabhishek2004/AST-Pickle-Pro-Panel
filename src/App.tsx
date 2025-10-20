import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import TestApp from './components/TestApp';
import Products from './components/Products';
import Orders from './components/Orders';
import Customers from './components/Customers';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <TestApp />;
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)' }}>
      {/* Desktop Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        background: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '16px 24px' 
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            AST Pickle Pro Panel
          </h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
            Manage your pickle business efficiently
          </p>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{ 
          width: '256px', 
          background: 'linear-gradient(180deg, #065f46 0%, #047857 50%, #065f46 100%)', 
          color: 'white', 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          zIndex: 10
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                transform: 'rotate(3deg)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🥒</span>
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                  PicklePro
                </h1>
                <p style={{ color: '#a7f3d0', fontSize: '0.75rem', margin: 0 }}>
                  Business Panel
                </p>
              </div>
            </div>
          </div>

          <nav style={{ padding: '16px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'products', label: 'Products', icon: '📦' },
              { id: 'orders', label: 'Orders', icon: '🛒' },
              { id: 'customers', label: 'Customers', icon: '👥' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeView === item.id ? 'white' : 'transparent',
                  color: activeView === item.id ? '#065f46' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '4px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  if (activeView !== item.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== item.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ marginLeft: '256px', minHeight: '100vh', flex: 1 }}>
          <div style={{ padding: '32px' }}>
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
