import React, { useState, useEffect } from 'react';
import Header from './TPHeader';
import AddTaskModal from './AddTaskModal';
import TaskList from './TaskList';
import PdfModal from './PdfModal';
import Sidebar from './TSidebar';
import { FileSpreadsheet } from 'lucide-react';
import { useAddTaskMutation } from '../services/mutations';
import { useGetTeacherTasksQuery } from '../services/queries';
import { useGetSubmissionByFilePathQuery } from '../services/queries';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

const TeacherPanel = () => {
    // Use authentication hook to get teacher data
    const { user, loading, logout } = useAuth("teacher");
    const router = useRouter();


    console.log("User data:", user);

    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedTeacherSubjectId, setSelectedTeacherSubjectId] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState(null);
    const [currentSubmission, setCurrentSubmission] = useState(null);

    // Get teacher ID from authenticated user
    const teacherId = user?.teacher?.id;

  
    // Get available subjects for this teacher
    const teacherSubjects = user?.teacherSubjects || [];

    const mutation = useAddTaskMutation();

    const getSemesterNumber = (semesterText) => {
        const match = semesterText.match(/\d+$/);
        return match ? parseInt(match[0]) : null;
    };

    const getDivisionLetter = (divisionText) => {
        const match = divisionText.match(/[A-Z]$/);
        return match ? match[0] : null;
    };

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && teacherSubjects.length > 0) {
            // Set default values from first subject
            const firstSubject = teacherSubjects[0];
            setSelectedSemester(`Semester ${firstSubject.semester}`);
            setSelectedSubject(firstSubject.subjectName);
            setSelectedSubjectId(firstSubject.subjectId);
            setSelectedTeacherSubjectId(firstSubject.id);
            setSelectedClass(`Division ${firstSubject.division}`);
        }
    }, [user, teacherSubjects]);

    // Query tasks based on selected filters
    const { data: taskData, isLoading } = useGetTeacherTasksQuery(
        selectedSemester ? getSemesterNumber(selectedSemester) : null,
        selectedSubjectId || (teacherSubjects[0]?.subjectId),
        selectedClass ? getDivisionLetter(selectedClass) : null
    );
    console.log("Selected Semester:", selectedSubjectId);

    console.log("Task Data:", taskData);
    useEffect(() => {
        if (taskData?.data) {
            setTasks(taskData.data);
        }
    }, [taskData]);

    // Handle subject selection
    const handleSubjectSelect = (subjectName) => {
        setSelectedSubject(subjectName);

        // Find the matching subject in teacherSubjects
        const subject = teacherSubjects.find(s => s.subjectName === subjectName);
        if (subject) {
            setSelectedSubjectId(subject.subjectId);
            setSelectedTeacherSubjectId(subject.id);
            setSelectedSemester(`Semester ${subject.semester}`);
            setSelectedClass(`Division ${subject.division}`);
        }
    };

    const handleAddTask = async (taskType) => {
        const taskData = {
            teacherSubjectId: selectedTeacherSubjectId,
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
        logout();
        router.push('/login');
    };

    const handleViewPdf = (taskId, taskType, student) => {
        setCurrentTaskType(taskType);
        setCurrentSubmission({
            id: student?.submission?.id || `${taskId}`,
            filePath: taskType?.submission?.filePath
        });
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

    // Use the submission data if available
    const { data: submissionData = { data: { id: '' } } } = useGetSubmissionByFilePathQuery(currentSubmission?.filePath) || {};

    // Show loading state while authentication is in progress
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

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
                        onSubjectSelect={handleSubjectSelect}
                        onClassSelect={setSelectedClass}
                        onLogout={handleLogout}
                        availableSubjects={teacherSubjects.map(s => s.subjectName)}
                        availableSemesters={[...new Set(teacherSubjects.map(s => `Semester ${s.semester}`))]}
                        availableClasses={[...new Set(teacherSubjects.map(s => `Division ${s.division}`))]}
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
                        fileKey={currentSubmission?.filePath}
                        submissionId={submissionData?.data?.id}
                        teacherId={teacherId}
                        onSave={handlePdfModalSave}
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherPanel;
