import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import API from '../services/api';

const MainLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      checkAttendanceStatus();
      fetchUnreadCount();
    }
  }, [user]);

  const checkAttendanceStatus = async () => {
    try {
      const res = await API.get('/attendance/my-logs?limit=1');
      const latest = res.data.data[0];
      const today = new Date().toISOString().split('T')[0];
      if (latest && latest.date === today && !latest.checkOutTime) {
        setIsCheckedIn(true);
      } else {
        setIsCheckedIn(false);
      }
    } catch (err) {
      console.error("Error checking attendance status:", err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const annRes = await API.get('/announcements');
      const unreadAnn = annRes.data.data.filter(msg => !msg.isRead).length;
      
      let pendingLeaves = 0;
      if (user?.role === 'Admin') {
        const leaveRes = await API.get('/leaves');
        pendingLeaves = leaveRes.data.data.filter(l => l.status === 'Pending').length;
      }
      
      setUnreadCount(unreadAnn + pendingLeaves);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const handleAttendanceAction = async () => {
    try {
      if (isCheckedIn) {
        await API.post('/attendance/check-out');
        setIsCheckedIn(false);
        alert("Checked out successfully!");
      } else {
        await API.post('/attendance/check-in', { employeeId: user.id });
        setIsCheckedIn(true);
        alert("Checked in successfully!");
      }
      if (location.pathname === '/') {
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Attendance action failed");
    }
  };

  const sidebarItems = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Me', path: '/me', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'My Team', path: '/team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'My Finances', path: '/finances', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Announcements', path: '/announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
    { name: 'Leaves', path: '/leaves', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Project', path: '/project', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Time Attend', path: '/attendance', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Payroll', path: '/payroll', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  const topMenuItems = [
    { name: 'DASHBOARD', path: '/' },
    { name: 'SHIFTS/WEEKLY OFFS & HOLIDAYS', path: '/shifts' },
    { name: 'ATTENDANCE TRACKING', path: '/attendance-tracking' },
    { name: 'OVERTIME', path: '/overtime' },
    { name: 'LEAVE', path: '/leaves' },
    { name: 'REPORTS', path: '/reports' },
    { name: 'SETTINGS', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] dark:bg-slate-950 font-sans overflow-hidden text-slate-700 dark:text-slate-300">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0f172a] flex flex-col z-50 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex items-center h-16 border-b border-slate-800/50">
          <Logo className="w-8 h-8 flex-shrink-0" showText={sidebarOpen} />
        </div>
        
        <nav className="flex-grow py-6 overflow-y-auto overflow-x-hidden">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 transition-all group relative ${
                  isActive
                    ? 'text-white bg-blue-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                </svg>
                
                <span className={`ml-4 text-xs font-bold transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  {item.name}
                </span>

                {!sidebarOpen && (
                  <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.name}
                  </span>
                )}

                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
           <button 
             onClick={handleLogout}
             className="flex items-center w-full px-2 py-2 text-slate-400 hover:text-rose-500 transition-colors group"
           >
             <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
             <span className={`ml-4 text-xs font-bold transition-all ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-grow flex flex-col relative overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 w-full shadow-sm overflow-x-auto">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M4 6h16M4 12h16M4 18h16" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>

            <nav className="flex items-center space-x-8 h-full min-w-max">
              {topMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    className="relative h-full flex items-center group cursor-pointer"
                  >
                    <span className={`text-[10px] font-black tracking-wider transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-6 ml-4">
            {!loadingAttendance && (
              <button
                onClick={handleAttendanceAction}
                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center space-x-2 ${
                  isCheckedIn 
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full animate-pulse ${isCheckedIn ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
              </button>
            )}

            {/* Notification Bell */}
            <Link to="/announcements" className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-3 border-l border-slate-100 dark:border-slate-800 pl-6">
              <div className="flex flex-col items-end">
                <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">{user?.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user?.role || 'Employee'}</p>
              </div>
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 text-blue-600 rounded-full flex items-center justify-center font-black border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto bg-[#f3f4f6] dark:bg-slate-950 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
