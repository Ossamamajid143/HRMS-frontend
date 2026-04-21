import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import './App.css'
import API from "./services/api";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Attendance from "./pages/Attendance";

// A component to protect routes from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Header = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-black text-xl text-white">H</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">HRMS <span className="text-indigo-400">Pro</span></h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}>
              Team
            </Link>
            <Link to="/attendance" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/attendance' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}>
              Attendance
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{user?.role || 'Employee'}</p>
          </div>
          <button 
            onClick={logout} 
            className="px-4 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-lg text-sm font-semibold transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/employees")
      .then(res => {
        setEmployees(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching employees:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Team Overview</h2>
            <p className="text-slate-400 mt-2 text-lg">Manage and explore your organization's talent.</p>
          </div>
          <Link to="/attendance" className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            Quick Check In/Out
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse tracking-wide">Fetching team data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {employees.length > 0 ? (
              employees.map(emp => (
                <div key={emp.id} className="group bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-400 border border-slate-700 group-hover:border-indigo-500/30 transition-colors">
                      {emp.name.charAt(0)}
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest font-black rounded-full border border-emerald-500/20">
                      {emp.status || 'Active'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{emp.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 font-medium">{emp.email}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {emp.department && (
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                        {emp.department}
                      </span>
                    )}
                    {emp.role && (
                      <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                        {emp.role}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-800">
                <p className="text-2xl text-slate-400 font-bold tracking-tight">No team members found</p>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="py-10 px-6 border-t border-slate-800 text-center">
        <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">&copy; 2026 HRMS Pro &bull; Advanced Workforce Management</p>
      </footer>
    </div>
  );
}

function AttendancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
      <Header />
      <Attendance />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
