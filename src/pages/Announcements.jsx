import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const isHR = user?.role === 'HR' || user?.role === 'Admin';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('/announcements');
      const data = res.data.data;
      setAnnouncements(data);

      // Auto-mark as read
      data.forEach(async (msg) => {
        if (!msg.isRead) {
          try {
            await API.post(`/announcements/${msg.id}/read`);
          } catch (e) {
            console.error("Failed to mark as read:", e);
          }
        }
      });
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await API.post('/announcements', formData);
      setFormData({ title: '', content: '' });
      setShowPostModal(false);
      fetchAnnouncements();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to post announcement";
      alert(`Broadcast Alert: ${errorMsg}`);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3 uppercase tracking-tight leading-tight">Broadcast Feed</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">Organizational updates and protocols</p>
        </div>
        
        {isHR && (
          <button 
            onClick={() => setShowPostModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black rounded-md shadow-sm transition-all uppercase tracking-widest"
          >
            New Broadcast
          </button>
        )}
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest animate-pulse italic">Syncing with broadcast nodes...</p>
        ) : announcements.length > 0 ? (
          announcements.map((msg) => (
            <div key={msg.id} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative group hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{msg.title}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{msg.author}</span>
                    <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">• {new Date(msg.createdAt).toLocaleDateString()}</span>
                    {msg.isRead && (
                      <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Seen</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{msg.content}</p>
            </div>
          ))
        ) : (
          <div className="p-16 text-center bg-white border border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No active broadcasts</p>
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white border border-slate-200 w-full max-w-lg rounded-xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <h2 className="text-xl font-black text-slate-800 mb-6 tracking-tight uppercase">Initiate Broadcast</h2>
              <form onSubmit={handlePost} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payload Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                    placeholder="E.g. System Maintenance Notice"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
                  <textarea 
                    required
                    rows="5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium resize-none"
                    placeholder="Enter message body..."
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-3 pt-2">
                  <button type="submit" className="flex-grow py-3 bg-blue-600 text-white font-black rounded-lg shadow-sm shadow-blue-500/10 active:scale-95 transition-all text-[10px] uppercase tracking-widest">
                    Post Update
                  </button>
                  <button type="button" onClick={() => setShowPostModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 font-black rounded-lg hover:bg-slate-200 transition-all text-[10px] uppercase tracking-widest">
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

export default Announcements;
