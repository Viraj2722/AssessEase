import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const AddTaskModal = ({ onAddTask, selectedSubject }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const taskTypes = ['ISE1', 'ISE2', 'MSE'];

    const handleTaskSelect = (type) => {
        if (!selectedSubject) {
            alert('Please select a subject first');
            return;
        }
        onAddTask(type);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <Plus size={16} /> Add Task <ChevronDown size={16} />
            </button>
            {showDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                    {taskTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTaskSelect(type)}
                            className="block w-full text-left px-4 py-2 hover:bg-blue-50"
                        >
                            {type}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddTaskModal;