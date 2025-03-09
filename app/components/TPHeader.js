"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";
import { semesterSubjects, yearClasses, years } from '../data/constants';

const Header = ({
    onSemesterSelect,
    onSubjectSelect,
    onClassSelect,
    selectedSemester,
    selectedSubject,
    selectedClass,
    onLogout
}) => {
    const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
    const [showClassDropdown, setShowClassDropdown] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const router = useRouter();
    
    const semesterRef = useRef(null);
    const subjectRef = useRef(null);
    const classRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (semesterRef.current && !semesterRef.current.contains(event.target)) {
                setShowSemesterDropdown(false);
            }
            if (subjectRef.current && !subjectRef.current.contains(event.target)) {
                setShowSubjectDropdown(false);
            }
            if (classRef.current && !classRef.current.contains(event.target)) {
                setShowClassDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            const semesterNumber = parseInt(selectedSemester.split(' ')[2]);
            setAvailableSubjects(semesterSubjects[semesterNumber] || []);
            onSubjectSelect('');
            onClassSelect('');
        }
    }, [selectedSemester]);

    useEffect(() => {
        if (selectedSemester) {
            const year = selectedSemester.split(' ')[0];
            setAvailableClasses(yearClasses[year] || []);
        }
    }, [selectedSemester]);

    const handleSemesterSelect = (semester) => {
        onSemesterSelect(semester);
        setShowSemesterDropdown(false);
    };

    const handleSubjectSelect = (subject) => {
        onSubjectSelect(subject);
        setShowSubjectDropdown(false);
        onClassSelect('');
    };

    const handleClassSelect = (className) => {
        onClassSelect(className);
        setShowClassDropdown(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    const toggleDropdown = (dropdown) => {
        if (dropdown === 'semester') {
            setShowSemesterDropdown(!showSemesterDropdown);
            setShowSubjectDropdown(false);
            setShowClassDropdown(false);
        } else if (dropdown === 'subject') {
            setShowSubjectDropdown(!showSubjectDropdown);
            setShowSemesterDropdown(false);
            setShowClassDropdown(false);
        } else if (dropdown === 'class') {
            setShowClassDropdown(!showClassDropdown);
            setShowSemesterDropdown(false);
            setShowSubjectDropdown(false);
        }
    };

    const semesterOptions = [
        { id: 'fe-1', label: 'FE Semester 1' },
        { id: 'fe-2', label: 'FE Semester 2' },
        { id: 'se-1', label: 'SE Semester 3' },
        { id: 'se-2', label: 'SE Semester 4' },
        { id: 'te-1', label: 'TE Semester 5' },
        { id: 'te-2', label: 'TE Semester 6' },
        { id: 'be-1', label: 'BE Semester 7' },
        { id: 'be-2', label: 'BE Semester 8' }
    ];

    return (
        <div className="flex justify-between items-center p-4 bg-white shadow-sm">
            <div className="flex gap-3">
                {/* Semester Dropdown */}
                <div className="relative" ref={semesterRef}>
                    <button
                        className={`flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-[180px] transition-all duration-200 ${showSemesterDropdown ? 'ring-2 ring-blue-300' : ''}`}
                        onClick={() => toggleDropdown('semester')}
                    >
                        <span className="truncate">{selectedSemester || 'Semester'}</span>
                        <ChevronDown 
                            size={16} 
                            className={`transform transition-transform duration-200 ${showSemesterDropdown ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    <div className={`absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-[180px] transition-all duration-200 origin-top ${
                        showSemesterDropdown 
                            ? 'transform scale-y-100 opacity-100' 
                            : 'transform scale-y-0 opacity-0 pointer-events-none'
                    }`}>
                        {semesterOptions.map((semester) => (
                            <button
                                key={semester.id}
                                onClick={() => handleSemesterSelect(semester.label)}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                            >
                                {semester.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject Dropdown */}
                <div className="relative" ref={subjectRef}>
                    <button
                        className={`flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-[180px] transition-all duration-200 ${showSubjectDropdown ? 'ring-2 ring-blue-300' : ''}`}
                        onClick={() => toggleDropdown('subject')}
                        disabled={!selectedSemester}
                    >
                        <span className="truncate">{selectedSubject || 'Subject'}</span>
                        <ChevronDown 
                            size={16} 
                            className={`transform transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    <div className={`absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-[180px] transition-all duration-200 origin-top ${
                        showSubjectDropdown 
                            ? 'transform scale-y-100 opacity-100' 
                            : 'transform scale-y-0 opacity-0 pointer-events-none'
                    }`}>
                        {availableSubjects.map((subject, index) => (
                            <button
                                key={`subject-${index}`}
                                onClick={() => handleSubjectSelect(subject)}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Class Dropdown */}
                <div className="relative" ref={classRef}>
                    <button
                        className={`flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-[180px] transition-all duration-200 ${showClassDropdown ? 'ring-2 ring-blue-300' : ''}`}
                        onClick={() => toggleDropdown('class')}
                        disabled={!selectedSemester || !selectedSubject}
                    >
                        <span className="truncate">{selectedClass || 'Class'}</span>
                        <ChevronDown 
                            size={16} 
                            className={`transform transition-transform duration-200 ${showClassDropdown ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    <div className={`absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-[180px] transition-all duration-200 origin-top ${
                        showClassDropdown 
                            ? 'transform scale-y-100 opacity-100' 
                            : 'transform scale-y-0 opacity-0 pointer-events-none'
                    }`}>
                        {availableClasses.map((className, index) => (
                            <button
                                key={`class-${index}`}
                                onClick={() => handleClassSelect(className)}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                            >
                                {className}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
                <LogOut size={16} /> Logout
            </button>
        </div>
    );
};

export default Header;