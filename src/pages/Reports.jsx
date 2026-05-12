import React from 'react';

const Reports = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-600 pl-3 uppercase tracking-tight leading-tight">System Reports</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">Analyze organizational data nodes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Attendance Report', desc: 'Monthly summary of employee presence.' },
          { title: 'Leave Summary', desc: 'Aggregate data on leaves taken.' },
          { title: 'Performance Report', desc: 'KPI and goal tracking metrics.' },
        ].map((report, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-blue-500/50 transition-all cursor-pointer group">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{report.title}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">{report.desc}</p>
            <button className="mt-6 text-[9px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-600/30 pb-0.5 hover:border-blue-600 transition-all">GENERATE PDF →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
