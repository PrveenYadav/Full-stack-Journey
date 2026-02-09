import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext.jsx';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const { backendUrl, setIsAuthenticated } = useContext(AdminContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    axios.defaults.withCredentials = true;
    
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/login', {email, password})
      
      if (data.success) {
        toast.success(data.message)
        setIsLoading(false);
        setIsAuthenticated(true)
        navigate('/admin/dashboard')
          
      } else {
        setError('Invalid administrative credentials. Please try again.');
        setIsLoading(false);
        toast.error(data.message)
      }

    } catch (error) {
      setIsLoading(false);
      console.log("Error in Login the Admin", error.message)
      toast.error(error?.response?.data?.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 transition-colors duration-300 p-4">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-zinc-100 dark:text-black text-white shadow-lg shadow-zinc-500/30 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to manage your system resources
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-950 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 dark:focus:ring-zinc-100 focus:ring-zinc-800 focus:border-transparent transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 dark:focus:ring-zinc-100 focus:ring-zinc-800 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                  Remember device
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-zinc-600 hover:text-zinc-500 dark:text-zinc-400">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl bg-zinc-900 text-white dark:text-black dark:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Outfytly Administration. All rights reserved.<br/>
          Protected by enterprise-grade encryption.
        </p>
      </div>
    </div>
  );
}