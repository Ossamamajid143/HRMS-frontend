import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const result = await register(formData);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dark-900 p-4">
      <div className="w-full max-w-md bg-dark-800 border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 mt-2">Join the HRMS team today</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Full Name</label>
            <input 
              name="name" 
              type="text" 
              placeholder="John Doe" 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-dark-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Email Address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="john@example.com" 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-dark-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-dark-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transform transition-all hover:-translate-y-1 active:scale-95"
          >
            Sign Up
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
