import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({
    selectedSemester,
    selectedSubject,
    selectedClass,
    onSemesterSelect,
    onSubjectSelect,
    onClassSelect,
    onLogout,
    availableSemesters,
    availableSubjects,
    availableClasses
}) => {
    // console.log("Header received options:", {
    //     semesters: availableSemesters,
    //     subjects: availableSubjects,
    //     classes: availableClasses
    // });

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto mb-4 md:mb-0">
                {/* Semester Dropdown */}
                <div className="w-full md:w-auto">
                    <label className="block text-sm font-semibold text-blue-600 mb-2 transition-colors">
                        Semester
                    </label>
                    <div className="relative">
                        <select
                            value={selectedSemester}
                            onChange={(e) => onSemesterSelect(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 hover:border-blue-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Select Semester</option>
                            {availableSemesters.map((semester, index) => (
                                <option key={index} value={semester}>
                                    {semester}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Subject Dropdown */}
                <div className="w-full md:w-auto">
                    <label className="block text-sm font-semibold text-blue-600 mb-2 transition-colors">
                        Subject
                    </label>
                    <div className="relative">
                        <select
                            value={selectedSubject}
                            onChange={(e) => onSubjectSelect(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 hover:border-blue-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Select Subject</option>
                            {availableSubjects.map((subject, index) => (
                                <option key={index} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Class Dropdown */}
                <div className="w-full md:w-auto">
                    <label className="block text-sm font-semibold text-blue-600 mb-2 transition-colors">
                        Class
                    </label>
                    <div className="relative">
                        <select
                            value={selectedClass}
                            onChange={(e) => onClassSelect(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-300 hover:border-blue-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Select Class</option>
                            {availableClasses.map((cls, index) => (
                                <option key={index} value={cls}>
                                    {cls}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full md:w-auto"
            >
                <LogOut size={18} /> Logout
            </button>
        </header>
    );
};

export default Header;