import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Left Panel: Hero & Branding (Hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-16 overflow-hidden bg-slate-950">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-slate-950" />

        {/* Branding */}
        <div className="relative z-10">
          <Logo className="w-12 h-12" textClassName="text-2xl" />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-6xl font-black text-white leading-tight mb-6 animate-in fade-in slide-in-from-left-8 duration-1000">
            Empower your <br />
            <span className="text-blue-500">Team</span>
          </h1>
          <p className="text-xl text-slate-300 font-medium tracking-wide animate-in fade-in slide-in-from-left-4 duration-1000 delay-300">
            Handle HR operations effortlessly. Drive performance, strengthen culture, and support growth—all from a single platform.</p>
        </div>

        {/* Decorative elements */}
        <div className="relative z-10 flex space-x-2">
          <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24 min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo only shows on mobile */}
          <div className="lg:hidden mb-12">
            <Logo className="w-10 h-10" textClassName="text-xl !text-slate-900" />
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back to xNerds!</h2>
            <p className="text-slate-500 font-medium">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-bold flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Your Email</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="info@xnerds.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm px-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 transition-all" />
                <span className="text-slate-500 font-medium group-hover:text-slate-900 transition-colors">Remember Me</span>
              </label>
              <Link to="/forgot-password" className="text-slate-400 font-black hover:text-blue-600 transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-900/10 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-lg"
            >
              Login
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative bg-white px-4 text-xs font-bold text-slate-300 uppercase tracking-widest">Instant Login</span>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                useOneTap
                theme="filled_black"
                shape="pill"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Don't have any account? <Link to="/register" className="text-blue-600 font-black hover:underline decoration-2 underline-offset-4 ml-1">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
