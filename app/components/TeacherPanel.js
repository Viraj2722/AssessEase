import React, { useState, useEffect } from 'react';
import Header from './TPHeader';
import AddTaskModal from './AddTaskModal';
import TaskList from './TaskList';
import PdfModal from './PdfModal';
import Sidebar from './TSidebar';
import { FileSpreadsheet } from 'lucide-react';
import { useAddTaskMutation } from '../services/mutations';
import { useGetTeacherTasksQuery } from '../services/queries';

const TeacherPanel = () => {
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState(null);

    const mutation = useAddTaskMutation();

    const getSemesterNumber = (semesterText) => {
        const match = semesterText.match(/\d+$/);
        return match ? parseInt(match[0]) : null;
    };

    const getDivisionLetter = (divisionText) => {
        const match = divisionText.match(/[A-Z]$/);
        return match ? match[0] : null;
    };

   
    const { data: taskData, isLoading } = useGetTeacherTasksQuery(
        selectedSemester ? getSemesterNumber(selectedSemester) : null,
        'sub_1',
        selectedClass ? getDivisionLetter(selectedClass) : null
    );
    useEffect(() => {
        if (taskData?.data) {
            setTasks(taskData.data);
        }
    }, [taskData]);

    const handleAddTask = async (taskType) => {
        const taskData = {
            teacherSubjectId: "ts_1",
            semester: getSemesterNumber(selectedSemester),
            taskType: taskType,
            title: selectedSubject,
            dueDate: new Date().toISOString(),
            totalMarks: 20,
            division: getDivisionLetter(selectedClass)
        };

        try {
            const response = await mutation.mutateAsync(taskData);
            const newTask = {
                id: response.task.id,
                type: taskType,
                name: selectedSubject,
                date: new Date().toISOString().split('T')[0],
                totalMarks: 20,
                division: selectedClass,
                semester: selectedSemester
            };
            setTasks([...tasks, newTask]);
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    const handleEditTask = (taskId, updatedTask) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, ...updatedTask } : task
        ));
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleGenerateExcel = (taskId) => {
        alert('Generating Excel for this task...');
    };

    const handleLogout = () => {
        alert('Logout clicked');
    };

    const handleViewPdf = (taskId, taskType, student) => {
        setCurrentTaskType(taskType);
        setIsPdfModalOpen(true);
    };

    const handlePdfModalSave = (data) => {
        console.log('Saving PDF modal data:', data);
        alert('Marks and comments saved!');
        setIsPdfModalOpen(false);
    };

    const handleIntegrateExcel = () => {
        alert('Excel integration clicked');
    };

    return (
        <div className="min-h-screen bg-[#caf0f8]">
            <div className="flex min-h-screen p-4 gap-4">
                <Sidebar />
                <div className="flex-1 bg-white rounded-lg p-5">
                    <Header
                        selectedSemester={selectedSemester}
                        selectedSubject={selectedSubject}
                        selectedClass={selectedClass}
                        onSemesterSelect={setSelectedSemester}
                        onSubjectSelect={setSelectedSubject}
                        onClassSelect={setSelectedClass}
                        onLogout={handleLogout}
                    />

                    {isLoading ? (
                        <div>Loading tasks...</div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mt-6 pb-4 border-b">
                                <AddTaskModal
                                    onAddTask={handleAddTask}
                                    selectedSubject={selectedSubject}
                                    disabled={!selectedSemester || !selectedClass}
                                />
                                <button
                                    onClick={handleIntegrateExcel}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    <FileSpreadsheet size={16} /> Integrate Excel
                                </button>
                            </div>

                            <TaskList
                                tasks={tasks}
                                onEditTask={handleEditTask}
                                onDeleteTask={handleDeleteTask}
                                onGenerateExcel={handleGenerateExcel}
                                onViewPdf={handleViewPdf}
                                semester={getSemesterNumber(selectedSemester)}
                                division={getDivisionLetter(selectedClass)}
                            />
                        </>
                    )}

                    <PdfModal
                        isOpen={isPdfModalOpen}
                        onClose={() => setIsPdfModalOpen(false)}
                        taskType={currentTaskType}
                        onSave={handlePdfModalSave}
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherPanel;