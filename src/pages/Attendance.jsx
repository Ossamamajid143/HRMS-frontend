import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Attendance = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "HR" || user?.role === "System Admin";

  const [logs, setLogs] = useState([]);
  const [dailyStatus, setDailyStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const [logsRes, statusRes] = await Promise.all([
          API.get("/attendance"),
          API.get("/attendance/daily-status")
        ]);
        setLogs(logsRes.data.data);
        setDailyStatus(statusRes.data);
      } else {
        const res = await API.get("/attendance/my-logs");
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type) => {
    setChecking(true);
    setMessage("");
    try {
      const res = await API.post(`/attendance/${type}`, {});
      setMessage(res.data.message);
      fetchData(); // Refresh logs
    } catch (err) {
      setMessage(err.response?.data?.message || `Action failed: ${type}`);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3 uppercase tracking-tight">
            Attendance Logs
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">Gateway monitoring for operations</p>
        </div>

        <div className="flex items-center space-x-3">
          {message && (
            <div className={`px-4 py-2 rounded-lg text-[10px] font-bold border ${message.includes('success') ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
              {message}
            </div>
          )}
          <button
            onClick={() => handleAction('check-in')}
            disabled={checking}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[10px] font-black rounded-md shadow-sm transition-all uppercase tracking-widest"
          >
            Check In
          </button>
          <button
            onClick={() => handleAction('check-out')}
            disabled={checking}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 text-[10px] font-black rounded-md shadow-sm transition-all uppercase tracking-widest"
          >
            Check Out
          </button>
        </div>
      </div>

      {/* Admin Stats */}
      {isAdmin && dailyStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Today's Presence</p>
            <h3 className="text-3xl font-black text-slate-800">
              {dailyStatus?.presentCount ?? dailyStatus?.count ?? 0}
              <span className="text-xs font-bold text-slate-400 ml-2">Present</span>
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <h3 className="text-sm font-black text-emerald-600 uppercase">Live Monitoring</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reference Date</p>
            <h3 className="text-sm font-black text-slate-800 uppercase">{dailyStatus.date}</h3>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
            {isAdmin ? "Global Team Logs" : "Personal Session History"}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Date</th>
                {isAdmin && <th className="px-6 py-4">Employee</th>}
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Clock In</th>
                <th className="px-6 py-4">Clock Out</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Logs...</td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">{log.date}</td>
                    {isAdmin && <td className="px-6 py-4 text-xs font-black text-slate-800">{log.employeeName}</td>}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${log.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500 font-bold">
                      {log.checkInTime ? new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "-"}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500 font-bold">
                      {log.checkOutTime ? new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {log.isLate && <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black uppercase rounded border border-rose-100">Late</span>}
                        {log.isEarly && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black uppercase rounded border border-amber-100">Early</span>}
                        {log.overtimeMinutes > 0 && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded border border-blue-100">OT: {log.overtimeMinutes}m</span>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-16 text-center">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No records found</p>
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

export default Attendance;
