import React, { useState } from 'react';
import Header from './TPHeader';
import AddTaskModal from './AddTaskModal';
import TaskList from './TaskList';
import PdfModal from './PdfModal';
import Sidebar from './TSidebar';
import { FileSpreadsheet } from 'lucide-react';
import { useAddTaskMutation } from '../services/mutations';

const TeacherPanel = () => {
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState(null);

    const mutation = useAddTaskMutation();

    const handleAddTask = (taskType) => {
        mutation.mutateAsync();
        const newTask = {
            id: Date.now(),
            type: taskType,
            name: `${taskType} - ${selectedSubject}`,
            date: new Date().toISOString().split('T')[0],
        };
        setTasks([...tasks, newTask]);
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

                {/* Main Content */}
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

                    <div className="flex justify-between items-center mt-6 pb-4 border-b">
                        <AddTaskModal
                            onAddTask={handleAddTask}
                            selectedSubject={selectedSubject}
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
                    />

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