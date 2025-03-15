"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { semesterSubjects, yearClasses, years } from '../data/constants';

const SelectionDropdowns = ({
    selectedSemester,
    selectedSubject,
    selectedClass,
    selectedTask,
    onSemesterSelect,
    onSubjectSelect,
    onClassSelect,
    onTaskSelect
}) => {
    const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
    const [showClassDropdown, setShowClassDropdown] = useState(false);
    const [showTaskDropdown, setShowTaskDropdown] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);

    const semesterRef = useRef(null);
    const subjectRef = useRef(null);
    const classRef = useRef(null);
    const taskRef = useRef(null);

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
            if (taskRef.current && !taskRef.current.contains(event.target)) {
                setShowTaskDropdown(false);
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
            onTaskSelect('');
        }
    }, [selectedSemester]);

    useEffect(() => {
        if (selectedSemester) {
            const year = selectedSemester.split(' ')[0];
            setAvailableClasses(yearClasses[year] || []);
        }
    }, [selectedSemester]);

    const toggleDropdown = (dropdown) => {
        if (dropdown === 'semester') {
            setShowSemesterDropdown(!showSemesterDropdown);
            setShowSubjectDropdown(false);
            setShowClassDropdown(false);
            setShowTaskDropdown(false);
        } else if (dropdown === 'subject') {
            setShowSubjectDropdown(!showSubjectDropdown);
            setShowSemesterDropdown(false);
            setShowClassDropdown(false);
            setShowTaskDropdown(false);
        } else if (dropdown === 'class') {
            setShowClassDropdown(!showClassDropdown);
            setShowSemesterDropdown(false);
            setShowSubjectDropdown(false);
            setShowTaskDropdown(false);
        } else if (dropdown === 'task') {
            setShowTaskDropdown(!showTaskDropdown);
            setShowSemesterDropdown(false);
            setShowSubjectDropdown(false);
            setShowClassDropdown(false);
        }
    };

    const handleSemesterSelect = (year, semesterNumber) => {
        const semesterText = `${year} Semester ${semesterNumber}`;
        onSemesterSelect(semesterText);
        setShowSemesterDropdown(false);
    };

    return (
        <div className="flex flex-wrap gap-3 mb-4">
            {/* Semester Dropdown */}
            <div className="relative" ref={semesterRef}>
                <button
                    className={`flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-[180px] transition-all duration-200 ${showSemesterDropdown ? 'ring-2 ring-blue-300' : ''
                        }`}
                    onClick={() => toggleDropdown('semester')}
                >
                    <span className="truncate">{selectedSemester || 'Semester'}</span>
                    <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${showSemesterDropdown ? 'rotate-180' : ''
                            }`}
                    />
                </button>
                <div className={`absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-[180px] transition-all duration-200 origin-top ${showSemesterDropdown
                        ? 'transform scale-y-100 opacity-100'
                        : 'transform scale-y-0 opacity-0 pointer-events-none'
                    }`}>
                    {years.map((year, yearIndex) => (
                        Array(2).fill(null).map((_, i) => {
                            const semester = yearIndex * 2 + i + 1;
                            return (
                                <button
                                    key={`${year}-${semester}`}
                                    onClick={() => handleSemesterSelect(year, semester)}
                                    className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                                >
                                    {`${year} Semester ${semester}`}
                                </button>
                            );
                        })
                    ))}
                </div>
            </div>

            {/* Subject Dropdown */}
            <div className="relative" ref={subjectRef}>
                <button
                    className={`flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-[180px] transition-all duration-200 ${showSubjectDropdown ? 'ring-2 ring-blue-300' : ''
                        }`}
                    onClick={() => toggleDropdown('subject')}
                    disabled={!selectedSemester}
                >
                    <span className="truncate">{selectedSubject || 'Subject'}</span>
                    <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''
                            }`}
                    />
                </button>
                <div className={`absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-[180px] transition-all duration-200 origin-top ${showSubjectDropdown
                        ? 'transform scale-y-100 opacity-100'
                        : 'transform scale-y-0 opacity-0 pointer-events-none'
                    }`}>
                    {availableSubjects.map((subject, index) => (
                        <button
                            key={`subject-${index}`}
                            onClick={() => {
                                onSubjectSelect(subject);
                                setShowSubjectDropdown(false);
                            }}
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
                    className={`flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-[180px] transition-all duration-200 ${showClassDropdown ? 'ring-2 ring-blue-300' : ''
                        }`}
                    onClick={() => toggleDropdown('class')}
                    disabled={!selectedSemester || !selectedSubject}
                >
                    <span className="truncate">{selectedClass || 'Class'}</span>
                    <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${showClassDropdown ? 'rotate-180' : ''
                            }`}
                    />
                </button>
                <div className={`absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-[180px] transition-all duration-200 origin-top ${showClassDropdown
                        ? 'transform scale-y-100 opacity-100'
                        : 'transform scale-y-0 opacity-0 pointer-events-none'
                    }`}>
                    {availableClasses.map((className, index) => (
                        <button
                            key={`class-${index}`}
                            onClick={() => {
                                onClassSelect(className);
                                setShowClassDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                        >
                            {className}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Dropdown */}
            <div className="relative" ref={taskRef}>
                <button
                    className={`flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-[180px] transition-all duration-200 ${showTaskDropdown ? 'ring-2 ring-blue-300' : ''
                        }`}
                    onClick={() => toggleDropdown('task')}
                    disabled={!selectedSemester || !selectedSubject || !selectedClass}
                >
                    <span className="truncate">{selectedTask || 'Tasks'}</span>
                    <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${showTaskDropdown ? 'rotate-180' : ''
                            }`}
                    />
                </button>
                <div className={`absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-[180px] transition-all duration-200 origin-top ${showTaskDropdown
                        ? 'transform scale-y-100 opacity-100'
                        : 'transform scale-y-0 opacity-0 pointer-events-none'
                    }`}>

                    {/* 'Exp1', 'Exp2','Exp3','Exp4','Exp5','Exp6','Exp7','Exp8','Exp9','Exp10', */}
                    {['ISE 1', 'ISE 2', 'MSE'].map((task, index) => (
                        <button
                            key={task}
                            onClick={() => {
                                onTaskSelect(task);
                                setShowTaskDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150 first:rounded-t-md last:rounded-b-md"
                        >
                            {task}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelectionDropdowns;