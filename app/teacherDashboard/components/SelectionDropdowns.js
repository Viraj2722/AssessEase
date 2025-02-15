import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { semesterSubjects, yearClasses, years } from '../../teacherPanel/data/constants';

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

    useEffect(() => {
        if (selectedSemester) {
            const semesterNumber = parseInt(selectedSemester.split(' ')[2]);
            setAvailableSubjects(semesterSubjects[semesterNumber] || []);
        }
    }, [selectedSemester]);

    useEffect(() => {
        if (selectedSemester) {
            const year = selectedSemester.split(' ')[0];
            setAvailableClasses(yearClasses[year] || []);
        }
    }, [selectedSemester]);

    const handleSemesterSelect = (year, semesterNumber) => {
        const semesterText = `${year} Semester ${semesterNumber}`;
        onSemesterSelect(semesterText);
        setShowSemesterDropdown(false);
    };

    return (
        <div className="flex flex-wrap gap-3 mb-4">
            {/* Semester Dropdown */}
            <div className="relative">
                <button
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setShowSemesterDropdown(!showSemesterDropdown)}
                >
                    {selectedSemester || 'Semester'} <ChevronDown size={16} />
                </button>
                {showSemesterDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                        {years.map((year, yearIndex) => (
                            Array(2).fill(null).map((_, i) => {
                                const semester = yearIndex * 2 + i + 1;
                                return (
                                    <button
                                        key={`${year}-${semester}`}
                                        onClick={() => handleSemesterSelect(year, semester)}
                                        className="block w-full text-left px-4 py-2 hover:bg-blue-50"
                                    >
                                        {`${year} Semester ${semester}`}
                                    </button>
                                );
                            })
                        ))}
                    </div>
                )}
            </div>

            {/* Subject Dropdown */}
            <div className="relative">
                <button
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                >
                    {selectedSubject || 'Subject'} <ChevronDown size={16} />
                </button>
                {showSubjectDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                        {availableSubjects.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => {
                                    onSubjectSelect(subject);
                                    setShowSubjectDropdown(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50"
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Class Dropdown */}
            <div className="relative">
                <button
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setShowClassDropdown(!showClassDropdown)}
                >
                    {selectedClass || 'Class'} <ChevronDown size={16} />
                </button>
                {showClassDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                        {availableClasses.map((className) => (
                            <button
                                key={className}
                                onClick={() => {
                                    onClassSelect(className);
                                    setShowClassDropdown(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50"
                            >
                                {className}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Task Dropdown */}
            <div className="relative">
                <button
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setShowTaskDropdown(!showTaskDropdown)}
                >
                    {selectedTask || 'Tasks'} <ChevronDown size={16} />
                </button>
                {showTaskDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                        {['ISE 1', 'ISE 2', 'MSE'].map((task) => (
                            <button
                                key={task}
                                onClick={() => {
                                    onTaskSelect(task);
                                    setShowTaskDropdown(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50"
                            >
                                {task}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectionDropdowns;