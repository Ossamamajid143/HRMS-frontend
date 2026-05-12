import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const LeaveList = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    comments: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave'];

  useEffect(() => {
    fetchLeaves();
  }, [isAdmin]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? '/leaves' : '/leaves/my-leaves';
      const res = await API.get(endpoint);
      setLeaves(res.data.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/leaves/apply', formData);
      setShowApplyModal(false);
      setFormData({ leaveType: '', fromDate: '', toDate: '', comments: '' });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    const diff = end - start;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-rose-500 pl-3 uppercase tracking-tight">
            {isAdmin ? 'Team Approvals' : 'My Leave Records'}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">
            {isAdmin ? 'Manage workforce downtime requests' : 'Historical log of all downtime requests'}
          </p>
        </div>
        
        {!isAdmin && (
          <button 
            onClick={() => setShowApplyModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-md shadow-sm transition-all uppercase tracking-widest"
          >
            New Application
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                {isAdmin && <th className="px-6 py-4">Employee</th>}
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                {isAdmin && <th className="px-6 py-4">Actions</th>}
                {!isAdmin && <th className="px-6 py-4">Submitted On</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Fetching records...</td>
                </tr>
              ) : leaves.length > 0 ? (
                leaves.map(leave => (
                   <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors group">
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <p className="text-xs font-black text-slate-800 uppercase">{leave.employeeName}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: {leave.employeeId}</p>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-slate-800 uppercase">{leave.leaveType}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5 line-clamp-1">{leave.comments || 'No comments.'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                        <span>{leave.fromDate}</span>
                        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        <span>{leave.toDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-slate-800">{calculateDays(leave.fromDate, leave.toDate)} Days</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        leave.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        {leave.status === 'Pending' ? (
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black rounded uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                              className="px-3 py-1.5 bg-rose-600 text-white text-[9px] font-black rounded uppercase tracking-widest hover:bg-rose-700 transition-all shadow-sm"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-bold uppercase italic">Processed</span>
                        )}
                      </td>
                    )}
                    {!isAdmin && (
                      <td className="px-6 py-4">
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(leave.createdAt).toLocaleDateString()}</p>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">History empty</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white border border-slate-200 w-full max-w-lg rounded-xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <h2 className="text-xl font-black text-slate-800 mb-6 tracking-tight uppercase">Request Downtime</h2>
              <form onSubmit={handleApply} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Leave Type</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    value={formData.leaveType}
                    onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From</label>
                    <input 
                      required
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      value={formData.fromDate}
                      onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To</label>
                    <input 
                      required
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      value={formData.toDate}
                      onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason</label>
                  <textarea 
                    rows="3"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                    placeholder="Brief explanation..."
                    value={formData.comments}
                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-3 pt-2">
                  <button type="submit" disabled={submitting} className="flex-grow py-3 bg-blue-600 text-white font-black rounded-lg shadow-sm active:scale-95 transition-all text-[10px] uppercase tracking-widest disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Send Request'}
                  </button>
                  <button type="button" onClick={() => setShowApplyModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 font-black rounded-lg hover:bg-slate-200 transition-all text-[10px] uppercase tracking-widest">
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

export default LeaveList;
