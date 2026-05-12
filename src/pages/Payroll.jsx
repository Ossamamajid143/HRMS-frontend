import React from 'react';

const Payroll = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-emerald-600 pl-3 uppercase tracking-tight leading-tight">Payroll</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 ml-4">Monitor payment cycles and disbursements</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-300 rounded-full flex items-center justify-center text-3xl mb-6">💰</div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Next Payroll Cycle</h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 leading-relaxed">Processing starts on the 25th of this month.</p>
      </div>
    </div>
  );
};

export default Payroll;
