import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Attendance = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "HR";
  
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Attendance</h1>
            <p className="text-slate-400 mt-2">Track time and team presence in real-time.</p>
          </div>
          
          <div className="flex bg-slate-900 p-2 rounded-2xl border border-slate-800 space-x-2">
            <button 
              onClick={() => handleAction('check-in')}
              disabled={checking}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              Check In
            </button>
            <button 
              onClick={() => handleAction('check-out')}
              disabled={checking}
              className="px-6 py-3 bg-slate-700 hover:bg-red-500/10 hover:text-red-400 border border-slate-600 hover:border-red-500/50 disabled:opacity-50 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Check Out
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border ${message.includes('success') ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
            {message}
          </div>
        )}

        {/* Admin Dashboard Stats */}
        {isAdmin && dailyStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Today's Pulse</p>
              <h3 className="text-3xl font-black text-white">{dailyStatus.count} <span className="text-sm font-medium text-slate-500">Active Members</span></h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
              <h3 className="text-3xl font-black text-emerald-400">Live <span className="text-xs text-slate-500 ml-2 font-mono">● Recording</span></h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Date</p>
              <h3 className="text-xl font-bold text-white">{dailyStatus.date}</h3>
            </div>
          </div>
        )}

        {/* Logs Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{isAdmin ? "All Team Logs" : "Your Attendance History"}</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950/50 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Date</th>
                  {isAdmin && <th className="px-8 py-5">Employee Name</th>}
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Check In</th>
                  <th className="px-8 py-5">Check Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {logs.length > 0 ? (
                  logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-300">{log.date}</td>
                      {isAdmin && <td className="px-8 py-6 text-slate-300 font-bold">{log.employeeName}</td>}
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-300 font-medium">
                        {log.checkInTime ? new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-300 font-medium">
                        {log.checkOutTime ? new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="px-8 py-20 text-center text-slate-500 font-medium">
                      No attendance records found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Attendance;
