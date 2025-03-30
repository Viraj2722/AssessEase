"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, isAuthenticated, getUserRole } from '../services/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check if user is already logged in
        if (isAuthenticated()) {
            const userRole = getUserRole();
            if (userRole === 'teacher') {
                router.push('/teacherPanel');
            } else if (userRole === 'student') {
                router.push('/studentPanel');
            }
        }
    }, [router]);

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setErrors({});
        setLoginError('');
        setIsLoading(true);
        
        try {
            // The loginUser function already returns the user data on success
            // or throws an error on failure
            const userData = await loginUser(email, password, role);

            // console.log('User data:', userData);
            
            // If we get here, login was successful
            if (role === 'teacher') {
                router.push('/teacherPanel');
            } else {
                router.push('/studentPanel');
            }
        } catch (error) {
            setLoginError(error.message || 'Login failed. Please check your credentials.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
                
                {loginError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {loginError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
                        <select
                            id="role"
                            className="mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;