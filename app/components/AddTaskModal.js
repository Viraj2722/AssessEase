"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const AddTaskModal = ({ onAddTask, selectedSubject }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const taskTypes = ['ISE1', 'ISE2', 'MSE'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTaskSelect = (type) => {
        if (!selectedSubject) {
            alert('Please select all options');
            return;
        }
        onAddTask(type);
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className={`flex items-center justify-between bg-blue-500 text-white mx-3.5 px-7 py-2 rounded-md hover:bg-blue-600 w-[180px] transition-all duration-200 group ${
                    showDropdown ? 'ring-2 ring-blue-300' : ''
                } hover:scale-105 active:scale-95`}
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <span className="flex items-center gap-2">
                    <Plus 
                        size={16} 
                        className={`transition-transform duration-200 ${
                            showDropdown ? 'rotate-45' : ''
                        } group-hover:rotate-90`}
                    />
                    Add Task
                </span>
                <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-200 ${
                        showDropdown ? 'rotate-180' : ''
                    }`}
                />
            </button>
            <div
                className={`absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg mx-3.5 z-10 w-[180px] transition-all duration-200 origin-top ${
                    showDropdown 
                        ? 'transform scale-y-100 opacity-100' 
                        : 'transform scale-y-0 opacity-0 pointer-events-none'
                }`}
            >
                {taskTypes.map((type, index) => (
                    <button
                        key={type}
                        onClick={() => handleTaskSelect(type)}
                        className={`block w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150
                            ${index === 0 ? 'rounded-t-md' : ''}
                            ${index === taskTypes.length - 1 ? 'rounded-b-md' : ''}
                        `}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AddTaskModal;