import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Shifts = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await API.get('/attendance/holidays');
      setHolidays(res.data.data);
    } catch (err) {
      console.error("Error fetching holidays:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      await API.post('/attendance/holidays', newHoliday);
      setShowModal(false);
      setNewHoliday({ name: '', startDate: '', endDate: '' });
      fetchHolidays();
    } catch (err) {
      console.error("Full error object:", err);
      const msg = err.response?.data?.message || err.message || "Failed to add holiday";
      alert(msg);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!window.confirm("Delete this holiday?")) return;
    try {
      await API.delete(`/attendance/holidays/${id}`);
      fetchHolidays();
    } catch (err) {
      alert("Failed to delete holiday");
    }
  };

  const getMonthlyOffCount = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday = 0, Saturday = 6
        count++;
      }
    }

    // Add holidays in the current month
    const currentMonthHolidays = holidays.filter(h => {
      const hStart = new Date(h.startDate);
      const hEnd = new Date(h.endDate);
      return (hStart.getFullYear() === year && hStart.getMonth() === month) || 
             (hEnd.getFullYear() === year && hEnd.getMonth() === month);
    });

    let holidayDays = 0;
    currentMonthHolidays.forEach(h => {
      const start = new Date(h.startDate);
      const end = new Date(h.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      holidayDays += duration;
    });

    return count + holidayDays;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 uppercase tracking-tight leading-tight">Shifts & Holidays</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">Manage rotation and holiday protocols</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black rounded-md shadow-sm transition-all uppercase tracking-widest"
          >
            Add Holiday
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Shift Rotation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase">Morning Shift (General)</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 text-blue-600">10:00 AM - 07:00 PM</p>
                </div>
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Weekly & Monthly Offs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Off</p>
                <p className="text-xs font-black text-slate-800 uppercase">Saturday, Sunday</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Off</p>
                <p className="text-xs font-black text-slate-800 uppercase">{getMonthlyOffCount()} Days <span className="text-[9px] text-slate-400 ml-1 font-bold">(Weekends + Holidays)</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[300px]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Upcoming Holidays</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">Syncing calendar...</div>
            ) : holidays.length > 0 ? (
              holidays.map(h => (
                <div key={h.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 group transition-all hover:border-emerald-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex flex-col items-center justify-center font-black">
                      <span className="text-[10px] uppercase">{new Date(h.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-xs">{new Date(h.startDate).getDate()}</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{h.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        {h.startDate === h.endDate 
                          ? new Date(h.startDate).toLocaleDateString('en-US', { weekday: 'long' })
                          : `${new Date(h.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(h.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                        }
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDeleteHoliday(h.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">No upcoming holidays</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Holiday Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white border border-slate-200 w-full max-w-sm rounded-xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <h2 className="text-lg font-black text-slate-800 mb-6 tracking-tight uppercase">New Holiday</h2>
              <form onSubmit={handleAddHoliday} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Holiday Name</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                    placeholder="e.g. Independence Day"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
                    <input 
                      required
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                      value={newHoliday.startDate}
                      onChange={(e) => setNewHoliday({...newHoliday, startDate: e.target.value, endDate: newHoliday.endDate || e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
                    <input 
                      required
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                      value={newHoliday.endDate}
                      onChange={(e) => setNewHoliday({...newHoliday, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-4">
                  <button type="submit" className="flex-grow py-3 bg-emerald-600 text-white font-black rounded-lg shadow-sm active:scale-95 transition-all text-[10px] uppercase tracking-widest">
                    Create Event
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 font-black rounded-lg hover:bg-slate-200 transition-all text-[10px] uppercase tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Shifts;
