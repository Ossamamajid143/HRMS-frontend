import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(formData);
    if (result.success) {
      setIsSuccess(true);
      setSuccessMessage(result.message);
    } else {
      setError(result.message);
    }
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
            Start your <br />
            <span className="text-blue-500">journey</span>
          </h1>
          <p className="text-xl text-slate-200 font-medium tracking-wide animate-fade-in-left animation-delay-200 drop-shadow-lg">
            Join thousands of modern HR teams building the future of work. Simple, transparent, and built for growth.
          </p>
        </div>

        <div className="relative z-10 flex space-x-2">
          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
          <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24 min-h-screen">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12">
            <Logo className="w-10 h-10" textClassName="text-xl !text-slate-900" />
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Create an Account</h2>
            <p className="text-slate-500 font-medium tracking-wide">Join the xNerds enterprise network</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-bold flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Registration Successful!</h3>
              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                {successMessage}
              </p>
              <Link 
                to="/login" 
                className="inline-block w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all text-center"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <input 
                  name="name" 
                  placeholder="John Doe" 
                  onChange={handleChange} 
                  required 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300 font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  onChange={handleChange} 
                  required 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300 font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    onChange={handleChange} 
                    required 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all duration-300 font-medium" 
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

              <button 
                type="submit" 
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-900/10 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 text-lg mt-4"
              >
                Sign Up
              </button>
            </form>
          )}

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative bg-white px-4 text-xs font-bold text-slate-300 uppercase tracking-widest">Or Register With</span>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                theme="filled_black"
                shape="pill"
                text="signup_with"
                useOneTap={false}
                auto_select={false}
              />
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Registered? <Link to="/login" className="text-blue-600 font-black hover:underline decoration-2 underline-offset-4 ml-1">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
