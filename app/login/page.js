"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../services/auth';
import { Eye, EyeOff, BookOpen, User, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Animation on mount
    useEffect(() => {
      setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const userData = await loginUser(email, password, role);
      
        // Redirect based on role
        if (role === 'student') {
          router.push('/studentDashboard');
        } else if (role === 'teacher') {
          router.push('/teacherDashboard');
        }
      } catch (err) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 flex items-center justify-center p-4">
        {/* Decorative elements - made smaller */}
        <div className="absolute top-0 left-0 w-full h-32 bg-blue-600 rounded-b-[30%] opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600 rounded-tl-full opacity-10"></div>
      
        <div className={`w-full max-w-md transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Card with shadow - reduced padding */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header with brand color - reduced padding */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-center relative">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md mb-2">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">AssessEase</h1>
              <p className="text-blue-100 text-xs">Streamlined Assessment Management</p>
            </div>
          
            {/* Login form - reduced spacing */}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Welcome Back</h2>
            
              {error && (
                <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                  <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              )}
            
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Role selection */}
                <div className="p-1 bg-gray-100 rounded-lg">
                  <div className="flex rounded-md overflow-hidden">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-3 text-center font-medium transition-all duration-200 text-sm ${
                        role === 'student' 
                          ? 'bg-white text-blue-600 shadow-sm rounded-md' 
                          : 'bg-transparent text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setRole('student')}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-3 text-center font-medium transition-all duration-200 text-sm ${
                        role === 'teacher' 
                          ? 'bg-white text-blue-600 shadow-sm rounded-md' 
                          : 'bg-transparent text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setRole('teacher')}
                    >
                      Teacher
                    </button>
                  </div>
                </div>
              
                {/* Email field */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              
                {/* Password field with toggle */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              
                {/* Login button with animation */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 text-sm ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </span>
                </button>
              </form>
            
              {/* Footer - simplified */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600">
                  Need help? Contact your administrator
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  © {new Date().getFullYear()} AssessEase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}