import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Overtime = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOvertime();
  }, []);

  const fetchOvertime = async () => {
    try {
      const res = await API.get('/overtime');
      setData(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Error fetching overtime:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatOT = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-amber-500 pl-3 uppercase tracking-tight leading-tight">Overtime Management</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">Monitor extra-hour allocations</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Overtime</p>
          <h3 className="text-2xl font-black text-slate-800">{summary?.totalOvertimeHours || 0} <span className="text-xs text-slate-400">HRS</span></h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Employees Contributing</p>
          <h3 className="text-2xl font-black text-slate-800">{summary?.employeesWithOvertime || 0}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg OT / Employee</p>
          <h3 className="text-2xl font-black text-slate-800">{summary?.avgOvertimePerEmployee || 0} <span className="text-xs text-slate-400">HRS</span></h3>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">OT Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Scanning records...</td>
                </tr>
              ) : data.length > 0 ? (
                data.map((record, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-slate-800 uppercase">{record.employeeName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400">
                        <span>{new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>→</span>
                        <span className="text-slate-600">{new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {formatOT(record.overtimeMinutes)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No overtime logged yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overtime;
