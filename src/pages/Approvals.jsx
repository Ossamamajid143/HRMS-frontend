import React from 'react';

const Approvals = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3 uppercase tracking-tight leading-tight">Approvals</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">Manage pending workforce requests</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-6">📝</div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">No Pending Approvals</h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 max-w-xs leading-relaxed">Everything is up to date! All requests have been processed successfully.</p>
      </div>
    </div>
  );
};

export default Approvals;
