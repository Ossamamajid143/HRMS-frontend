import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('emailNotifications') !== 'false';
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('emailNotifications', emailNotifications);
  }, [emailNotifications]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white border-l-4 border-slate-400 pl-3 uppercase tracking-tight leading-tight">System Settings</h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1 ml-4">Configure operational parameters</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">General Configuration</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">Email Notifications</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Receive alerts for new leave requests</p>
            </div>
            <div 
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 ${emailNotifications ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${emailNotifications ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">Dark Mode (Experimental)</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Toggle high-contrast theme</p>
            </div>
            <div 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 border ${darkMode ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${darkMode ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
