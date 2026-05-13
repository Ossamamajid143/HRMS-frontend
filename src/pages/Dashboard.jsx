import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    checkedIn: 0,
    notCheckedIn: 0,
    onLeave: 0,
    lateComing: 0,
    earlyGoing: 0,
    checkedOut: 0,
    overtime: 0,
  });
  const [charts, setCharts] = useState(null);

  const [activeTab, setActiveTab] = useState('Attendance Summary');
  const [chartView, setChartView] = useState('count'); // 'count' or 'percentage'

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/attendance/dashboard-stats");
      setStats(res.data.stats || {});
      setCharts(res.data.charts || null);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardTabs = [
    'Attendance Summary',
    'Leave Summary'
  ];

  const chartRef = useRef(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const exportChart = async (format) => {
    setExportMenuOpen(false);
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `attendance_stats_${new Date().toISOString().split('T')[0]}.png`;
        link.href = imgData;
        link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`attendance_stats_${new Date().toISOString().split('T')[0]}.pdf`);
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export chart');
    }
  };

  const TrendIndicator = ({ value }) => {
    if (value === undefined || value === null) return null;
    const isPositive = value >= 0;
    return (
      <div className="flex flex-col items-end">
        <div className={`p-1.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
          </svg>
        </div>
        <span className={`text-[10px] font-bold mt-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Employees,${stats.totalEmployees}\n`
      + `Employees on Leave %,${stats.employeesOnLeavePercentage || 0}%\n`
      + `Avg Leave Taken,${stats.avgLeaveTaken || 0}\n`
      + `Total Leave Balance,${stats.totalLeaveBalance || 0}\n`
      + `Unplanned Leave Taken,${stats.unplannedLeaveTaken || 0}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leave_stats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Sparkline = ({ data, color }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d - min) / (range || 1)) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg className="w-20 h-10 opacity-80" viewBox="0 -10 100 120" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        {dashboardTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-xs font-bold tracking-tight transition-all relative ${
              activeTab === tab ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Conditional Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white border-l-4 border-red-500 pl-3">
          {activeTab === 'Leave Summary' ? "Today's Leave Stats" : "Today's Attendance Stats"}
        </h2>
      </div>

      {/* Primary Stats Grid (8 Cards for Attendance / 4 Cards for Leave) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {activeTab === 'Leave Summary' ? (
          [
            { label: 'Paid Leave', val: stats.paidLeave || 0, color: 'border-blue-500' },
            { label: 'Unpaid Leave', val: stats.unpaidLeave || 0, color: 'border-amber-500' },
            { label: 'Sick Leave', val: stats.sickLeave || 0, color: 'border-blue-400' },
            { label: 'AWOL (Absent Without Leave)', val: stats.awol || 0, color: 'border-red-500', footer: 'View Employees' },
          ].map((card, i) => (
            <div key={i} className={`bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border-l-4 ${card.color} flex flex-col justify-between hover:shadow-md transition-shadow h-32`}>
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-tight uppercase">{card.label}</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white mt-2">{card.val}</p>
              </div>
              {card.footer && (
                <button className="text-[10px] font-bold text-blue-600 hover:underline text-left mt-2">{card.footer}</button>
              )}
            </div>
          ))
        ) : (
          [
            { label: 'Total Employees', val: stats.totalEmployees, color: 'border-purple-600' },
            { label: 'Early/On Time Arrivals', val: stats.onTimeCount, color: 'border-emerald-500' },
            { label: 'Late Arrivals', val: stats.lateComing, color: 'border-blue-500' },
            { label: 'Not In Yet', val: stats.notCheckedIn, color: 'border-red-500' },
            { label: 'Work From Home', val: stats.wfh || 0, color: 'border-amber-500' },
            { label: 'On Duty', val: stats.checkedIn || 0, color: 'border-purple-400' },
            { label: 'Remote Clock-In', val: stats.remote || 0, color: 'border-cyan-500' },
            { label: 'Holiday/Weekly Off', val: stats.monthlyOffCount || 0, color: 'border-blue-300', link: '/shifts' },
          ].map((card, i) => (
            <div 
              key={i} 
              onClick={() => card.link && navigate(card.link)}
              className={`bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border-l-4 ${card.color} flex flex-col justify-between hover:shadow-md transition-shadow h-32 ${card.link ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : ''}`}
            >
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-tight uppercase">{card.label}</p>
                <div className="flex items-baseline space-x-2 mt-2">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{card.val}</p>
                  {card.label === 'Holiday/Weekly Off' && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Days <span className="text-[8px] opacity-70">(Weekends + Holidays)</span></p>
                  )}
                </div>
              </div>
              {card.footer && (
                <button className="text-[10px] font-bold text-blue-600 hover:underline text-left mt-2">{card.footer}</button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Section: Past Dates Stats */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {activeTab === 'Leave Summary' ? 'Leave for Past Dates' : 'Attendance for Past Dates'}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-md shadow-sm flex items-center space-x-4">
              <span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400">
                {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {activeTab === 'Leave Summary' && (
              <button 
                onClick={handleExport}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md shadow-sm flex items-center space-x-2 text-[10px] font-bold transition-colors uppercase tracking-widest"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export Stats</span>
              </button>
            )}
          </div>
        </div>

        {/* Past Dates Grid (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTab === 'Leave Summary' ? (
            <>
              {/* Card: Employees on Leave % */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-40 group hover:border-blue-500/50 transition-all overflow-hidden relative">
                <div className="absolute right-[-10px] top-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <Sparkline data={charts?.leaves} color="#3b82f6" />
                </div>
                <div className="flex justify-between items-start z-10">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.employeesOnLeavePercentage || 0}%</p>
                  <div className="bg-blue-50 text-blue-600 p-1.5 rounded-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px]">👤</div>
                    <p className="text-[11px] font-black text-slate-800">Employees on Leave</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">A percentage and graphs tell you how many employees were on leave during your selected duration.</p>
                </div>
              </div>

              {/* Card: Avg. Leave Taken */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col justify-between h-40 group hover:border-purple-500/50 transition-all overflow-hidden relative">
                <div className="absolute right-[-10px] top-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <Sparkline data={charts?.leaves} color="#a855f7" />
                </div>
                <div className="flex justify-between items-start z-10">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.avgLeaveTaken || 0} days</p>
                  <div className="bg-purple-50 text-purple-600 p-1.5 rounded-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-[10px]">⏱️</div>
                    <p className="text-[11px] font-black text-slate-800">Avg. Leave Taken</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">This tells you the average number of leaves taken by an employee during the selected time range, supported by a graph.</p>
                </div>
              </div>

              {/* Card: Total Leave Balance */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-40 group hover:border-slate-500/50 transition-all overflow-hidden relative">
                <div className="flex justify-between items-start z-10">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalLeaveBalance || 0}</p>
                  <div className="bg-slate-50 text-slate-400 p-1.5 rounded-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-[10px]">⌛</div>
                    <p className="text-[11px] font-black text-slate-800">Total Leave Balance</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">Check the overall leave balance across your workforce.</p>
                </div>
              </div>

              {/* Card: Unplanned Leave Taken */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col justify-between h-40 group hover:border-rose-500/50 transition-all overflow-hidden relative">
                <div className="absolute right-[-10px] top-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <Sparkline data={charts?.unplannedLeaves} color="#f43f5e" />
                </div>
                <div className="flex justify-between items-start z-10">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.unplannedLeaveTaken || 0}</p>
                  <div className="bg-rose-50 text-rose-600 p-1.5 rounded-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-[10px]">👤</div>
                    <p className="text-[11px] font-black text-slate-800">Unplanned Leave Taken</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">This part reveals the total number of unplanned leaves taken during this period.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Card: Employees Present % */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-40 group hover:border-blue-500/50 transition-all bg-blue-50/30 dark:bg-blue-900/10">
                <div className="flex justify-between items-start">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.presentPercentage || 0}%</p>
                  <TrendIndicator value={stats.trends?.presentPercentage} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px]">👥</div>
                    <p className="text-[11px] font-black text-slate-800">Employees Present</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">%age of employees that were present during the selected duration.</p>
                </div>
              </div>

              {/* Card: Avg. Work Hours */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-40 group hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.avgWorkHours || 0}h/day</p>
                  <TrendIndicator value={stats.trends?.avgWorkHours} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-[10px]">⏱️</div>
                    <p className="text-[11px] font-black text-slate-800">Avg. Work Hours Spent</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">Avg. effective hours spent by employees during the selected duration.</p>
                </div>
              </div>

              {/* Card: Avg. Overtime Hours */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-40 group hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.avgOvertimeHours || 0}h/day</p>
                  <TrendIndicator value={stats.trends?.avgOvertimeHours} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-[10px]">⌛</div>
                    <p className="text-[11px] font-black text-slate-800">Avg. Overtime Hours</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">Avg. OT hours worked by employees during the selected duration.</p>
                </div>
              </div>

              {/* Card: Total Attendance Discrepancies */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-40 group hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalDiscrepancies || 0}</p>
                  <TrendIndicator value={stats.trends?.totalDiscrepancies} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-[10px]">👤</div>
                    <p className="text-[11px] font-black text-slate-800">Total Attendance Discrepancies</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">Total penalizations due to attendance discrepancies during selected period.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section: Bottom Analytical Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
           <h2 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
             {activeTab === 'Leave Summary' ? "Employees' Leave Stats" : "Employees' Arrival Stats"}
           </h2>
            <div className="flex items-center space-x-4 text-[10px] font-bold">
              <button 
                onClick={() => setChartView('count')}
                className={`transition-colors ${chartView === 'count' ? 'text-blue-600 border-b border-blue-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                Employee Count
              </button>
              <button 
                onClick={() => setChartView('percentage')}
                className={`transition-colors ${chartView === 'percentage' ? 'text-blue-600 border-b border-blue-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                Employee Percentage
              </button>
             {activeTab === 'Attendance Summary' && (
               <div className="relative">
                 <button 
                   onClick={() => setExportMenuOpen(!exportMenuOpen)}
                   className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
                 >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                   </svg>
                 </button>
                 {exportMenuOpen && (
                   <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                     <button onClick={() => exportChart('png')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">Export as PNG</button>
                     <button onClick={() => exportChart('pdf')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">Export as PDF</button>
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>
         
         {activeTab === 'Leave Summary' ? (
           <div className="h-56 flex items-end justify-between space-x-4 px-4 relative pt-10 border-b border-slate-100">
             {charts?.labels?.map((label, i) => {
               const val = charts?.leaves?.[i] || 0;
               const maxVal = Math.max(...(charts?.leaves || [0]), 1);
               const height = `${(val / maxVal) * 100}%`;
               const barColor = 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20';
               
               return (
                 <div key={i} className="flex flex-col items-center justify-end w-full h-full group relative">
                   <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg pointer-events-none z-10 whitespace-nowrap">
                      {val} Leaves
                   </div>
                   <div className={`w-full max-w-[60px] ${barColor} rounded-t-sm transition-all duration-700 ease-out shadow-lg`} style={{ height: val === 0 ? '4px' : height }}></div>
                   <p className="text-[10px] font-black text-slate-400 mt-4 truncate w-full text-center uppercase tracking-widest">{label}</p>
                 </div>
               );
             })}
           </div>
         ) : (
           <div className="h-80 w-full" ref={chartRef}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart
                 data={chartView === 'count' ? (charts?.attendanceStacked || []) : (charts?.attendanceStackedPercentage || [])}
                 margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                 barSize={30}
               >
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                   dataKey="date" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                   dy={10}
                 />
                 <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                   dx={-10}
                 />
                 <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                 />
                 <Legend 
                   iconType="square" 
                   wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px' }}
                 />
                 <Bar dataKey="earlyOnTime" name="Early/On Time Arrival" stackId="a" fill="#84cc16" />
                 <Bar dataKey="lateArrival" name="Late Arrival" stackId="a" fill="#f97316" />
                 <Bar dataKey="noLogs" name="No Logs / On Leave" stackId="a" fill="#c084fc" />
                 <Bar dataKey="holidayWeeklyOff" name="Holiday / Weekly-Off" stackId="a" fill="#38bdf8" radius={[2, 2, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         )}
      </div>

    </div>
  );
};

export default Dashboard;


