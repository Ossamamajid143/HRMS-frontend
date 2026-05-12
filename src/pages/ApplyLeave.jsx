import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const ApplyLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    comments: ''
  });

  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await API.post('/leaves/apply', formData);
      setMessage('Leave application submitted successfully!');
      setTimeout(() => navigate('/leave/list'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            Apply Leave
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Request downtime for your workforce node</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden relative">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Leave Type */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Leave Type *</label>
              <select 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer outline-none"
                value={formData.leaveType}
                onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
              >
                <option value="">-- Select --</option>
                {leaveTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* Leave Balance Placeholder */}
            <div className="flex flex-col justify-center px-6 py-4 bg-blue-50/50 border border-blue-100 border-dashed rounded-lg">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">Available Balance</p>
              <h3 className="text-xl font-black text-slate-800">12.00 <span className="text-[10px] text-slate-400 ml-1 uppercase font-bold">Days</span></h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* From Date */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">From Date *</label>
              <input 
                type="date" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={formData.fromDate}
                onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
              />
            </div>

            {/* To Date */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">To Date *</label>
              <input 
                type="date" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={formData.toDate}
                onChange={(e) => setFormData({...formData, toDate: e.target.value})}
              />
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Comments</label>
            <textarea 
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none outline-none placeholder:text-slate-400"
              placeholder="Provide a brief explanation for your absence..."
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
            ></textarea>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-[10px] font-bold flex items-center space-x-3 border ${message.includes('successfully') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${message.includes('successfully') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>{message}</span>
            </div>
          )}

          <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-bold text-slate-400 italic">* All fields are essential for operational approval.</p>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-lg shadow-sm shadow-blue-500/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
            >
              {loading ? 'Processing...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
