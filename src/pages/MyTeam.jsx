import React, { useState, useEffect } from 'react';
import API from '../services/api';

const MyTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await API.get('/employees?limit=100');
        setTeam(res.data.data || []);
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 uppercase tracking-tight leading-tight">My Team</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 ml-4">Monitor and collaborate with your department members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 uppercase">
              {member.name?.charAt(0) || 'T'}
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 uppercase">{member.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTeam;
