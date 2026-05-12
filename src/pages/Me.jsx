import React from 'react';
import { useAuth } from '../context/AuthContext';

const Me = () => {
  const { user } = useAuth();

  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const employeeId = `EMP-${user.id.toString().padStart(3, '0')}`;
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3 uppercase tracking-tight leading-tight">My Profile</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">Manage your personal information and settings</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 flex flex-col items-center border-b border-slate-50 bg-slate-50/30">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black mb-4 border-4 border-white shadow-sm">
            {user.name?.charAt(0) || 'U'}
          </div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{user.name || 'User Name'}</h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
            <p className="text-sm font-bold text-slate-700">{user.email || 'user@example.com'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Employee ID</p>
            <p className="text-sm font-bold text-slate-700">{employeeId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Join Date</p>
            <p className="text-sm font-bold text-slate-700">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Me;
