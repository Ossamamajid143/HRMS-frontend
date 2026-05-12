import React from 'react';

const Project = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 uppercase tracking-tight leading-tight">Projects</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 ml-4">Manage project timelines and task allocations</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center text-3xl mb-6">📁</div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">No Projects Found</h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 max-w-xs leading-relaxed">You are not currently assigned to any active projects.</p>
      </div>
    </div>
  );
};

export default Project;
