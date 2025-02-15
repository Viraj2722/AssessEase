import React from 'react';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white rounded-xl border border-gray-200 p-5 h-screen sticky top-4">
            <h2 className="text-xl font-semibold text-blue-500 mb-6">Teacher Dashboard</h2>
            <nav className="flex flex-col space-y-2">
                <a href="/teacherDashboard" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Dashboard
                </a>
                <a href="/teacherPanel" className="px-4 py-2 text-gray-500 rounded hover:bg-gray-100">
                    Panel
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;