import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type SidebarProps = {
  activeView: string;
  setActiveView: (view: string) => void;
  onClose?: () => void;
};

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeView, setActiveView, onClose }: SidebarProps) {
  const { theme, themeColors } = useTheme();
  
  // Define theme-specific classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'emerald':
        return {
          background: 'bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900',
          border: 'border-emerald-700/50',
          textLight: 'text-emerald-300',
          textDark: 'text-emerald-900',
          textAccent: 'text-emerald-600',
          bgHover: 'hover:bg-emerald-800/50',
          bgActive: 'bg-white'
        };
      case 'blue':
        return {
          background: 'bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900',
          border: 'border-blue-700/50',
          textLight: 'text-blue-300',
          textDark: 'text-blue-900',
          textAccent: 'text-blue-600',
          bgHover: 'hover:bg-blue-800/50',
          bgActive: 'bg-white'
        };
      case 'purple':
        return {
          background: 'bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900',
          border: 'border-purple-700/50',
          textLight: 'text-purple-300',
          textDark: 'text-purple-900',
          textAccent: 'text-purple-600',
          bgHover: 'hover:bg-purple-800/50',
          bgActive: 'bg-white'
        };
      case 'orange':
        return {
          background: 'bg-gradient-to-b from-orange-900 via-orange-800 to-orange-900',
          border: 'border-orange-700/50',
          textLight: 'text-orange-300',
          textDark: 'text-orange-900',
          textAccent: 'text-orange-600',
          bgHover: 'hover:bg-orange-800/50',
          bgActive: 'bg-white'
        };
      default:
        return {
          background: 'bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900',
          border: 'border-emerald-700/50',
          textLight: 'text-emerald-300',
          textDark: 'text-emerald-900',
          textAccent: 'text-emerald-600',
          bgHover: 'hover:bg-emerald-800/50',
          bgActive: 'bg-white'
        };
    }
  };

  const classes = getThemeClasses();
  
  return (
    <div className={`w-64 ${classes.background} text-white h-screen fixed left-0 top-0 shadow-2xl`}>
      <div className={`p-6 border-b ${classes.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-2xl">🥒</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PicklePro</h1>
              <p className={`${classes.textLight} text-xs`}>Business Panel</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                onClose?.(); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? `${classes.bgActive} ${classes.textDark} shadow-lg scale-105`
                  : `text-white ${classes.bgHover} hover:translate-x-1`
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? classes.textAccent : 'text-white group-hover:text-white'}`} />
              <span className={`font-medium ${isActive ? classes.textDark : 'text-white'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className={`${classes.bgHover.replace('hover:', '')} rounded-xl p-4 backdrop-blur-sm border ${classes.border}`}>
          <p className={`text-xs ${classes.textLight} mb-1`}>Business Status</p>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 ${classes.textAccent.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
            <span className="text-sm text-white font-medium">All Systems Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
