import React, { useState } from 'react';
import TaskTable from './TaskTable';
import { ChevronDown, ChevronUp, FileEdit, Trash2, FileSpreadsheet } from 'lucide-react';

const TaskList = ({ tasks, onEditTask, onDeleteTask, onGenerateExcel, onViewPdf }) => {
    const [expandedTasks, setExpandedTasks] = useState(new Set());
    const [editingTask, setEditingTask] = useState(null);

    const toggleTask = (taskId) => {
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    const handleEdit = (taskId) => {
        if (editingTask === taskId) {
            onEditTask(taskId);
            setEditingTask(null);
        } else {
            setEditingTask(taskId);
        }
    };

    const handleDelete = (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDeleteTask(taskId);
        }
    };

    return (
        <div className="space-y-4 mt-4">
            {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg shadow p-4">
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleTask(task.id)}
                    >
                        <div className="flex gap-4 flex-1">
                            <input
                                type="text"
                                value={task.name}
                                readOnly={editingTask !== task.id}
                                onChange={(e) => onEditTask(task.id, { ...task, name: e.target.value })}
                                className="flex-1 border rounded px-3 py-2"
                            />
                            <input
                                type="date"
                                value={task.date}
                                readOnly={editingTask !== task.id}
                                onChange={(e) => onEditTask(task.id, { ...task, date: e.target.value })}
                                className="border rounded px-3 py-2"
                            />
                        </div>
                        {expandedTasks.has(task.id) ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(task.id);
                            }}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            <FileEdit size={16} /> {editingTask === task.id ? 'Save' : 'Edit'}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(task.id);
                            }}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onGenerateExcel(task.id);
                            }}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            <FileSpreadsheet size={16} /> Generate Excel
                        </button>
                    </div>

                    {expandedTasks.has(task.id) && (
                        <div className="mt-4">
                            <TaskTable
                                taskId={task.id}
                                taskType={task.type}
                                onViewPdf={onViewPdf}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TaskList;