import React from 'react';

const MyFinances = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-amber-500 pl-3 uppercase tracking-tight leading-tight">My Finances</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 ml-4">Manage your salary, claims, and tax documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Salary Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-xs font-bold text-slate-600">Net Salary (Last Month)</span>
              <span className="text-sm font-black text-slate-800">$0.00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs font-bold text-slate-600">Tax Deductions</span>
              <span className="text-sm font-black text-rose-500">$0.00</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center py-12">
          <div className="text-3xl mb-2">📑</div>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Payslips</h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">No payslips available yet.</p>
        </div>
      </div>
    </div>
  );
};

export default MyFinances;
