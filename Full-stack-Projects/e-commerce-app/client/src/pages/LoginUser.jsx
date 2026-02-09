import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import axios from 'axios';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound,
  Loader2,
  Moon,
  Sun,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

axios.defaults.withCredentials = true;

// sub-components
const InputField = ({ 
  icon: Icon, 
  type, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = true,
  togglePassword,
  showPasswordState
}) => {
  const isPasswordField = name === 'password' || name === 'newPassword';
  
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type={isPasswordField ? (showPasswordState ? 'text' : 'password') : type}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-900 focus:border-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-100 dark:focus:border-gray-100 transition-all outline-none"
        placeholder={placeholder}
        required={required}
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          {showPasswordState ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

const AuthCard = ({ title, subtitle, children }) => (
  <div className="w-full sm:ml-35 md:ml-[25%] lg:ml-[35%] sm:max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all p-8">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
    {children}
  </div>
);


export const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const { backendUrl, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);
      await axios.post(`${backendUrl}/api/user/send-verify-otp`);
      toast.success("OTP sent to your email");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-account`,
        { otp }
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Email verified!");

      await getUserData(); // refresh user data
      navigate("/my-account");

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-auto w-full bg-white dark:bg-zinc-950 pt-30 lg:pt-40'>
      <AuthCard
        className="min-h-screen"
        title="Verify Email"
        subtitle="Click below to receive a verification code"
      >
        <button
          onClick={handleSendOtp}
          disabled={sendingOtp}
          className="mb-4 w-full py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 cursor-pointer"
        >
          {sendingOtp ? "Sending..." : "Send / Resend OTP"}
        </button>

        <form onSubmit={handleVerifyEmail}>
          <InputField
            icon={ShieldCheck}
            type="text"
            name="otp"
            placeholder="6-Digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
};

export const UserLogin = () => {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint =
        view === "login"
          ? "/api/user/login"
          : view === "register"
          ? "/api/user/register"
          : view === "forgot-otp"
          ? "/api/user/send-reset-otp"
          : "/api/user/reset-password";

      const { data } = await axios.post(
        `${backendUrl}${endpoint}`,
        formData
      );

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      if (view === "login" || view === "register") {
        setIsLoggedIn(true);
        await getUserData();
        toast.success(data.message);
      } else if (view === "forgot-otp") {
        toast.success("Reset OTP sent to your email");
        setView("reset-password");
      } else if (view === "reset-password") {
        toast.success("Password updated. Please login.");
        setView("login");
      }
    } catch (error) {
      if (!error.response) {
        toast.error("Network error. Check your connection.");
        return;
      }

      const { status, data } = error.response;
      if ([400, 401, 404].includes(status)) {
        toast.error(data?.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: "Welcome Back",
    register: "Create Account",
    "forgot-otp": "Forgot Password",
    "reset-password": "Reset Password",
  };

  const subtitles = {
    login: "Sign in to your Outfytly account",
    register: "Join Outfytly today",
    "forgot-otp": "Enter your email to receive a reset code",
    "reset-password": "Enter OTP and your new password",
  };

  return (
    <div className='min-h-screen w-full bg-white dark:bg-zinc-950 pt-30 lg:pt-40'>
      <AuthCard title={titles[view]} subtitle={subtitles[view]}>
        <form onSubmit={handleAuth}>
          
          <div className='mb-4'>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const { data } = await axios.post(
                    `${backendUrl}/api/user/google-auth`,
                    { token: credentialResponse.credential }
                  );

                  if (data.success) {
                    setIsLoggedIn(true);
                    await getUserData();
                    toast.success("Logged in with Google");
                  }
                } catch (err) {
                  toast.error("Google login failed");
                }
              }}
              onError={() => toast.error("Google Sign-in failed")}
            />
          </div>

          {view === "register" && (
            <InputField
              icon={User}
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          {(view === "login" ||
            view === "register" ||
            view === "forgot-otp") && (
            <InputField
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          )}

          {(view === "login" || view === "register") && (
            <>
              <InputField
                icon={Lock}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                showPasswordState={showPassword}
                togglePassword={() =>
                  setShowPassword(!showPassword)
                }
              />

              {view === "login" && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setView("forgot-otp")}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          )}

          {view === "reset-password" && (
            <>
              <InputField
                icon={ShieldCheck}
                type="text"
                name="otp"
                placeholder="Reset OTP"
                value={formData.otp}
                onChange={handleChange}
              />
              <InputField
                icon={KeyRound}
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </>
          )}

          <button
            disabled={loading}
            type="submit"
            className="group w-full flex items-center justify-center py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-950 dark:hover:bg-zinc-100 dark:bg-zinc-50 text-white dark:text-black font-semibold transition-all disabled:opacity-70 mt-4 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {view === "login"
                  ? "Sign In"
                  : view === "register"
                  ? "Create Account"
                  : view === "forgot-otp"
                  ? "Send OTP"
                  : "Reset Password"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          {view === "login" ? (
            <p className='dark:text-gray-100'>
              Don't have an account?{" "}
              <button
                onClick={() => setView("register")}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              <button
                onClick={() => setView("login")}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Back to Login
              </button>
            </p>
          )}
        </div>
      </AuthCard>
    </div>
  );
};
