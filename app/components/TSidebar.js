'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === '/teacherPanel') {
            return 'Teacher Panel';
        }
        return 'Teacher Dashboard';
    };

    return React.createElement('aside', {
        className: 'w-64 bg-white rounded-xl border border-gray-200 p-5 h-screen sticky top-4'
    }, [
        React.createElement('h2', {
            className: 'text-xl font-semibold text-blue-500 mb-6',
            key: 'title'
        }, getTitle()),
        React.createElement('nav', {
            className: 'flex flex-col space-y-2',
            key: 'nav'
        }, [
            React.createElement(Link, {
                href: '/teacherDashboard',
                className: `px-4 py-2 rounded transition-colors ${pathname === '/teacherDashboard' || pathname === '/'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`,
                key: 'dashboard-link'
            }, 'Dashboard'),
            React.createElement(Link, {
                href: '/teacherPanel', // Next.js uses 'href' instead of 'to'
                className: `px-4 py-2 rounded transition-colors ${pathname === '/teacherPanel'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`,
                key: 'panel-link'
            }, 'Panel')
        ])
    ]);
};

export default Sidebar;