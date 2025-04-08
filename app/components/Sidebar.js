"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const StudentSidebar = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const getTitle = () => {
        if (pathname === '/studentPanel') {
            return 'Student Panel';
        }
        return 'Student Dashboard';
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed lg:static
                w-64 bg-gradient-to-b from-white to-blue-50 rounded-xl border border-gray-200 p-5
                h-screen lg:h-auto
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                z-40 shadow-lg lg:shadow-none
            `}>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-8">
                    {getTitle()}
                </h2>
                <nav className="flex flex-col space-y-3">
                    <Link
                        href="/studentDashboard"
                        className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2
                            ${pathname === '/studentDashboard' || pathname === '/'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link
                        href="/studentPanel"
                        className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2
                            ${pathname === '/studentPanel'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Panel
                    </Link>
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default StudentSidebar;