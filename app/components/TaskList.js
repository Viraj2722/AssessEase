import { useState , useCallback} from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2, FileSpreadsheet, AlertCircle } from 'lucide-react';
import StudentList from './StudentList';
import { useGetTeacherStudentsListQuery } from '../services/queries';

const TaskList = ({ tasks, onEditTask, onDeleteTask, onGenerateExcel, onViewPdf, semester, division }) => {
    const [expandedTasks, setExpandedTasks] = useState(new Set());
    const [pendingCounts, setPendingCounts] = useState({});

    const toggleTask = (taskId) => {
        const newExpanded = new Set(expandedTasks);
        if (newExpanded.has(taskId)) {
            newExpanded.delete(taskId);
        } else {
            newExpanded.add(taskId);
        }
        setExpandedTasks(newExpanded);
    };

    // Add a date validation helper
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
    };

    // Function to update pending counts from StudentList
    const updatePendingCount = useCallback((taskId, pendingCount, totalCount) => {
        setPendingCounts(prev => ({
            ...prev,
            [taskId]: { pending: pendingCount, total: totalCount }
        }));
    }, []);
    return (
        <div className="space-y-4 mt-4">
            {tasks && tasks.map((task) => (
                <div key={task.taskId} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div
                            className="flex items-center gap-6 flex-1 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => toggleTask(task.taskId)}
                        >
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                                <span className="text-sm text-gray-500 mt-1 block">Type: {task.taskType}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 mb-1">Due Date</span>
                                    <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md">
                                        {formatDate(task.dueDate)}
                                    </span>
                                </div>

                                {/* Pending submissions indicator */}
                                {pendingCounts[task.taskId] && pendingCounts[task.taskId].pending > 0 && (
                                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-md">
                                        <AlertCircle size={16} />
                                        <span className="text-sm font-medium">
                                            {pendingCounts[task.taskId].pending}/{pendingCounts[task.taskId].total} pending
                                        </span>
                                    </div>
                                )}

                                <div className="text-gray-400">
                                    {expandedTasks.has(task.taskId) ?
                                        <ChevronUp className="text-blue-500" size={20} /> :
                                        <ChevronDown size={20} />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                            <button
                                onClick={() => onEditTask(task)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit Task"
                            >
                                <Edit size={18} />
                            </button>

                            <button
                                onClick={() => onDeleteTask(task.taskId)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete Task"
                            >
                                <Trash2 size={18} />
                            </button>

                            <button
                                onClick={() => onGenerateExcel(task.taskId)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Generate Excel Report"
                            >
                                <FileSpreadsheet size={18} />
                            </button>
                        </div>
                    </div>

                    {expandedTasks.has(task.taskId) && (
                        <div className="mt-4">
                            <StudentList
                                taskId={task.taskId}
                                semester={semester}
                                subjectId={task.teacherSubjectId}
                                division={division}
                                onViewPdf={onViewPdf}
                                onUpdatePendingCount={updatePendingCount}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TaskList;
