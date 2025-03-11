import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StudentList from './StudentList';



const TaskList = ({ tasks, onEditTask, onDeleteTask, onGenerateExcel, onViewPdf, semester, division }) => {
    const [expandedTasks, setExpandedTasks] = useState(new Set());

    const toggleTask = (taskId) => {
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    return (
        <div className="space-y-4 mt-4">
            {tasks && tasks.map((task) => (
                <div key={task.taskId} className="bg-white rounded-lg shadow p-4">
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleTask(task.taskId)}
                    >
                        <div className="flex gap-4 flex-1">
                            <input
                                type="text"
                                value={task.title}
                                readOnly
                                className="flex-1 border rounded px-3 py-2"
                            />
                            <input
                                type="date"
                                value={new Date(task.dueDate).toISOString().split('T')[0]}
                                readOnly
                                className="border rounded px-3 py-2"
                            />
                        </div>
                        {expandedTasks.has(task.taskId) ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {expandedTasks.has(task.taskId) && (
                        <div className="mt-4">
                            <StudentList 
                                taskId={task.taskId}
                                semester={semester}
                                subjectId={task.teacherSubjectId}
                                division={division}
                                onViewPdf={onViewPdf}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};export default TaskList;