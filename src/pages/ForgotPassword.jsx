import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    
    const result = await forgotPassword(email);
    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Left Panel: Hero & Branding (Hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-16 overflow-hidden bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')` }}
        />
        {/* Stronger text-enhancing gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10" />
        
        <div className="relative z-20">
          <Logo className="w-12 h-12" textClassName="text-2xl" />
        </div>

        <div className="relative z-20 max-w-xl">
          <h1 className="text-6xl font-black text-white leading-tight mb-6 animate-fade-in-left drop-shadow-2xl">
            Recover <br />
            <span className="text-blue-500">access</span>
          </h1>
          <p className="text-xl text-slate-200 font-medium tracking-wide animate-fade-in-left animation-delay-200 drop-shadow-lg">
            Don't worry, even the best teams lose their way sometimes. We'll help you get back to building the future.
          </p>
        </div>

        <div className="relative z-10 flex space-x-2">
          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
          <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
        </div>
      </div>

      {/* Right Panel: Forgot Password Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24 min-h-screen">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12">
            <Logo className="w-10 h-10" textClassName="text-xl !text-slate-900" />
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Forgot Password?</h2>
            <p className="text-slate-500 font-medium tracking-wide">Enter your email for a secure reset link</p>
          </div>

          {message && (
            <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-2xl font-bold">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="info@xnerds.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300 font-medium"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-900/10 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 text-lg"
            >
              {loading ? "Sending..." : "Send Link"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link to="/login" className="text-slate-400 text-sm font-black uppercase tracking-widest hover:text-blue-600 transition-colors">
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
