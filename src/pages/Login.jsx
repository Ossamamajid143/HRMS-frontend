import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark-900 p-4">
      <div className="w-full max-w-md bg-dark-800 border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Login to your HRMS account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@hrms.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 bg-dark-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-dark-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transform transition-all hover:-translate-y-1 active:scale-95"
          >
            Login
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:text-primary-light font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
