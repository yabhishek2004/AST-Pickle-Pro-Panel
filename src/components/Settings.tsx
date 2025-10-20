import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Bell, Building2, CreditCard, Lock, Palette, User, Check, Save } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  
  // Get theme-specific classes for Settings
  const getThemeClasses = () => {
    switch (theme) {
      case 'emerald':
        return {
          primary: 'from-emerald-600 to-teal-600',
          accent: 'emerald-600',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          ring: 'ring-emerald-600',
          focus: 'focus:ring-emerald-500',
          toggle: '${classes.toggle}',
          icon: 'text-emerald-600'
        };
      case 'blue':
        return {
          primary: 'from-blue-600 to-cyan-600',
          accent: 'blue-600',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          ring: 'ring-blue-600',
          focus: 'focus:ring-blue-500',
          toggle: 'peer-checked:bg-blue-600',
          icon: 'text-blue-600'
        };
      case 'purple':
        return {
          primary: 'from-purple-600 to-pink-600',
          accent: 'purple-600',
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          ring: 'ring-purple-600',
          focus: 'focus:ring-purple-500',
          toggle: 'peer-checked:bg-purple-600',
          icon: 'text-purple-600'
        };
      case 'orange':
        return {
          primary: 'from-orange-600 to-red-600',
          accent: 'orange-600',
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          ring: 'ring-orange-600',
          focus: 'focus:ring-orange-500',
          toggle: 'peer-checked:bg-orange-600',
          icon: 'text-orange-600'
        };
      default:
        return {
          primary: 'from-emerald-600 to-teal-600',
          accent: 'emerald-600',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          ring: 'ring-emerald-600',
          focus: 'focus:ring-emerald-500',
          toggle: '${classes.toggle}',
          icon: 'text-emerald-600'
        };
    }
  };

  const classes = getThemeClasses();

  // Business Information State
  const [businessInfo, setBusinessInfo] = useState({
    name: 'PicklePro Business',
    email: 'business@picklepro.com'
  });

  // Profile Settings State
  const [profileInfo, setProfileInfo] = useState({
    name: 'Business Owner',
    phone: '+91 9876543210'
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    lowStockAlerts: true,
    emailReports: false
  });

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState({
    'Cash on Delivery': true,
    'UPI Payment': true,
    'Card Payment': true,
    'Net Banking': false
  });

  // Save States
  const [saveStates, setSaveStates] = useState({
    business: false,
    profile: false,
    notifications: false,
    payment: false,
    appearance: false
  });

  // Handle Business Information Save
  const handleBusinessSave = () => {
    setSaveStates(prev => ({ ...prev, business: true }));
    setTimeout(() => {
      setSaveStates(prev => ({ ...prev, business: false }));
    }, 2000);
  };

  // Handle Profile Save
  const handleProfileSave = () => {
    setSaveStates(prev => ({ ...prev, profile: true }));
    setTimeout(() => {
      setSaveStates(prev => ({ ...prev, profile: false }));
    }, 2000);
  };

  // Handle Notifications Toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSaveStates(prev => ({ ...prev, notifications: true }));
    setTimeout(() => {
      setSaveStates(prev => ({ ...prev, notifications: false }));
    }, 2000);
  };

  // Handle Payment Method Toggle
  const handlePaymentToggle = (method: string) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
    setSaveStates(prev => ({ ...prev, payment: true }));
    setTimeout(() => {
      setSaveStates(prev => ({ ...prev, payment: false }));
    }, 2000);
  };

  // Handle Theme Selection
  const handleThemeSelect = (newTheme: string) => {
    setTheme(newTheme as any);
    setSaveStates(prev => ({ ...prev, appearance: true }));
    setTimeout(() => {
      setSaveStates(prev => ({ ...prev, appearance: false }));
    }, 2000);
  };

  // Security Actions
  const handleSecurityAction = (action: string) => {
    alert(`${action} functionality would be implemented here. This is a demo.`);
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your business preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`bg-gradient-to-br ${classes.primary} p-3 rounded-xl`}>
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              <p className="text-sm text-gray-600">Update your business details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}`}
              />
            </div>
            <button 
              onClick={handleBusinessSave}
              className={`w-full px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center justify-center space-x-2 ${
                saveStates.business 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg'
              }`}
            >
              {saveStates.business ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`bg-gradient-to-br ${classes.primary} p-3 rounded-xl`}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileInfo.name}
                onChange={(e) => setProfileInfo(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profileInfo.phone}
                onChange={(e) => setProfileInfo(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${classes.focus}`}
              />
            </div>
            <button 
              onClick={handleProfileSave}
              className={`w-full px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center justify-center space-x-2 ${
                saveStates.profile 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
              }`}
            >
              {saveStates.profile ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Updated!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`bg-gradient-to-br ${classes.primary} p-3 rounded-xl`}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Manage notification preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Order Updates</p>
                <p className="text-sm text-gray-600">Get notified about new orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.orderUpdates}
                  onChange={() => handleNotificationToggle('orderUpdates')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${classes.toggle}"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Low Stock Alerts</p>
                <p className="text-sm text-gray-600">Alert when inventory is low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.lowStockAlerts}
                  onChange={() => handleNotificationToggle('lowStockAlerts')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${classes.toggle}"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Reports</p>
                <p className="text-sm text-gray-600">Weekly business reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.emailReports}
                  onChange={() => handleNotificationToggle('emailReports')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${classes.toggle}"></div>
              </label>
            </div>
            {saveStates.notifications && (
              <div className="flex items-center space-x-2 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                <span>Notification preferences saved!</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`bg-gradient-to-br ${classes.primary} p-3 rounded-xl`}>
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              <p className="text-sm text-gray-600">Password and security settings</p>
            </div>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => handleSecurityAction('Change Password')}
              className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors font-medium text-left"
            >
              Change Password
            </button>
            <button 
              onClick={() => handleSecurityAction('Two-Factor Authentication')}
              className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors font-medium text-left"
            >
              Two-Factor Authentication
            </button>
            <button 
              onClick={() => handleSecurityAction('Active Sessions')}
              className="w-full bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors font-medium text-left"
            >
              Active Sessions
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`bg-gradient-to-br ${classes.primary} p-3 rounded-xl`}>
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <p className="text-sm text-gray-600">Accepted payment options</p>
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(paymentMethods).map(([method, enabled]) => (
              <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{method}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={enabled}
                    onChange={() => handlePaymentToggle(method)}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${classes.accent}-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${classes.toggle}`}></div>
                </label>
              </div>
            ))}
            {saveStates.payment && (
              <div className="flex items-center space-x-2 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                <span>Payment methods updated!</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`bg-gradient-to-br ${classes.primary} p-3 rounded-xl`}>
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
              <p className="text-sm text-gray-600">Customize your panel look</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
              <div className="grid grid-cols-4 gap-2">
                <button 
                  onClick={() => handleThemeSelect('emerald')}
                  className={`w-full aspect-square bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg transition-all ${
                    theme === 'emerald' 
                      ? 'ring-2 ring-emerald-600 ring-offset-2' 
                      : 'hover:ring-2 hover:ring-emerald-600 hover:ring-offset-2'
                  }`}
                ></button>
                <button 
                  onClick={() => handleThemeSelect('blue')}
                  className={`w-full aspect-square bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg transition-all ${
                    theme === 'blue' 
                      ? 'ring-2 ring-blue-600 ring-offset-2' 
                      : 'hover:ring-2 hover:ring-blue-600 hover:ring-offset-2'
                  }`}
                ></button>
                <button 
                  onClick={() => handleThemeSelect('purple')}
                  className={`w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg transition-all ${
                    theme === 'purple' 
                      ? 'ring-2 ring-purple-600 ring-offset-2' 
                      : 'hover:ring-2 hover:ring-purple-600 hover:ring-offset-2'
                  }`}
                ></button>
                <button 
                  onClick={() => handleThemeSelect('orange')}
                  className={`w-full aspect-square bg-gradient-to-br from-orange-500 to-red-600 rounded-lg transition-all ${
                    theme === 'orange' 
                      ? 'ring-2 ring-orange-600 ring-offset-2' 
                      : 'hover:ring-2 hover:ring-orange-600 hover:ring-offset-2'
                  }`}
                ></button>
              </div>
              {saveStates.appearance && (
                <div className="flex items-center space-x-2 text-green-600 text-sm mt-2">
                  <Check className="w-4 h-4" />
                  <span>Theme updated!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
