"use client"

import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onAddTask, selectedSubject }) => {
    const [taskType, setTaskType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskType) {
            onAddTask(taskType);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Subject</label>
                        <input
                            type="text"
                            value={selectedSubject}
                            disabled
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Task Type</label>
                        <select
                            value={taskType}
                            onChange={(e) => setTaskType(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Task Type</option>
                            <option value="ISE1">ISE1</option>
                            <option value="ISE2">ISE2</option>
                            <option value="MSC">MSC</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!taskType}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;