import React, { useState, useEffect } from 'react';
import Header from './TPHeader';
import AddTaskModal from './AddTaskModal';
import TaskList from './TaskList';
import PdfModal from './PdfModal';
import Sidebar from './TSidebar';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { useAddTaskMutation } from '../services/mutations';
import { useGetTeacherTasksQuery } from '../services/queries';
import { useGetSubmissionByFilePathQuery } from '../services/queries';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { generateIntegratedExcelReport } from '../utils/excelUtils';
import { API_URL } from '../lib/utils';
import { useGetTasksByFiltersQuery } from '../services/queries';

const TeacherPanel = () => {
    // Use authentication hook to get teacher data
    const { user, loading, logout } = useAuth("teacher");
    const router = useRouter();


    // console.log("User data:", user);

    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedTeacherSubjectId, setSelectedTeacherSubjectId] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [currentTaskType, setCurrentTaskType] = useState(null);
    const [currentSubmission, setCurrentSubmission] = useState(null);
    // New state for add task modal
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    // Get teacher ID from authenticated user
    const teacherId = user?.teacher?.id;

    // Get available subjects for this teacher
    const teacherSubjects = user?.teacherSubjects || [];

    // Log the available subjects for debugging
    // console.log("Available teacher subjects:", teacherSubjects);

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
        console.log("User data:", user);

        if (user && teacherSubjects.length > 0) {
            // Set default values from first subject
            const firstSubject = teacherSubjects[0];
            setSelectedSemester(`Semester ${firstSubject.semester}`);
            setSelectedSubject(firstSubject.subjectName);
            setSelectedSubjectId(firstSubject.subjectId);
            setSelectedTeacherSubjectId(firstSubject.id);
            setSelectedClass(`Division ${firstSubject.division}`);

            // console.log("Initial selection:", {
            //     semester: `Semester ${firstSubject.semester}`,
            //     subject: firstSubject.subjectName,
            //     subjectId: firstSubject.subjectId,
            //     teacherSubjectId: firstSubject.id,
            //     class: `Division ${firstSubject.division}`
            // });
        }
    }, [user, teacherSubjects]);

    // Query tasks based on selected filters
    const { data: taskData, isLoading } = useGetTeacherTasksQuery(
        selectedSemester ? getSemesterNumber(selectedSemester) : null,
        selectedSubjectId,
        selectedClass ? getDivisionLetter(selectedClass) : null
    );
    // console.log("Selected Semester:", teacherSubjects);

    // console.log("task data is ",taskData)

    useEffect(() => {
        if (taskData?.data) {
            setTasks(taskData.data);
        }
    }, [taskData]);

    // Handle subject selection
    const handleSubjectSelect = (subjectName) => {
        // console.log("Selected subject name:", subjectName);
        setSelectedSubject(subjectName);

        // Find the matching subject in teacherSubjects
        const subject = teacherSubjects.find(s => s.subjectName === subjectName);
        console.log("Found subject:", subject);

        if (subject) {
            setSelectedSubjectId(subject.subjectId);
            setSelectedTeacherSubjectId(subject.id);
            setSelectedSemester(`Semester ${subject.semester}`);
            setSelectedClass(`Division ${subject.division}`);

            // console.log("Updated selection:", {
            //     semester: `Semester ${subject.semester}`,
            //     subject: subject.subjectName,
            //     subjectId: subject.subjectId,
            //     teacherSubjectId: subject.id,
            //     class: `Division ${subject.division}`
            // });
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
            console.log("Task creation response:", response);

            // Create a new task object that matches the structure expected by TaskList
            // This should match the structure of tasks returned by the API
            const newTask = {
                id: response.task.id,
                type: taskType,
                name: selectedSubject,
                title: selectedSubject, // Add this if TaskList uses title
                dueDate: new Date().toISOString(), // Use the full ISO string if that's what the API returns
                date: new Date().toISOString().split('T')[0], // Keep this for compatibility
                totalMarks: 20,
                division: selectedClass,
                semester: selectedSemester
            };

            console.log("Adding new task to UI:", newTask);
            setTasks([...tasks, newTask]);

            // Close the modal after successful task addition
            setIsAddTaskModalOpen(false);

            // Optionally, refetch the tasks to ensure UI is in sync with backend
            // This would require modifying your useGetTeacherTasksQuery to expose a refetch function
            // taskRefetch();
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

    // console.log('Tasks response:',selectedSemester,selectedSubjectId,selectedClass);
    const handleIntegrateExcel = async () => {
        // Validate that filters are selected
        if (!selectedSemester || !selectedSubjectId || !selectedClass) {
            alert('Please select Semester, Subject, and Class before generating an integrated report');
            return;
        }

        try {
            // Show loading state
            alert('Generating integrated report...');

            // Get semester number and division letter
            const semesterNumber = getSemesterNumber(selectedSemester);
            const divisionLetter = getDivisionLetter(selectedClass);

            // Fetch tasks for the selected filters - direct fetch instead of using a hook

            console.log('Fetching tasks for filters:', selectedSemester, selectedSubjectId, selectedClass);
            const tasksResponse = await fetch(
                `${API_URL}/tasks/by-filters?semester=${semesterNumber}&subjectId=${selectedSubjectId}&division=${divisionLetter}`
            );

            if (!tasksResponse.ok) {
                throw new Error(`Failed to fetch tasks: ${tasksResponse.status}`);
            }

            const tasksData = await tasksResponse.json();

            if (!tasksData.success || !tasksData.data || tasksData.data.length === 0) {
                alert('No tasks found for the selected filters');
                return;
            }

            // Fetch report data for each task and combine
            const allReportData = [];

            for (const task of tasksData.data) {
                try {

                    const response = await fetch(`${API_URL}/teacher/generate-report/${task.taskId}`);
                    console.log('Response status:', task.taskId);
                    if (response.ok) {
                        const responseData = await response.json();
    
                        // Extract the actual data array from the response
                        const taskReportData = responseData.data || [];

                        // Add task information to each record
                        const enhancedData = taskReportData.map(item => ({
                            ...item,
                            taskId: task.taskId,
                            taskTitle: task.title,
                            taskType: task.taskType,
                            dueDate: task.dueDate,
                            totalMarks: task.totalMarks
                        }));

                        allReportData.push(...enhancedData);
                    }
                } catch (error) {
                    console.error(`Error fetching report for task ${task.taskId}:`, error);
                }
            }

            if (allReportData.length === 0) {
                alert('No report data available for the selected tasks');
                return;
            }

            // Generate integrated Excel report
            const fileName = generateIntegratedExcelReport(
                allReportData,
                `${selectedSubject}_${selectedSemester}_${selectedClass}`
            );

            console.log(`Integrated Excel report generated: ${fileName}`);
            alert(`Report generated successfully: ${fileName}`);

        } catch (error) {
            console.error('Failed to generate integrated Excel report:', error);
            alert('Failed to generate integrated report. Please try again.');
        }
    };

    // Use the submission data if available
    const { data: submissionData = { data: { id: '' } } } = useGetSubmissionByFilePathQuery(currentSubmission?.filePath) || {};

    // Show loading state while authentication is in progress
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Create arrays of unique semesters, subjects, and classes for the dropdowns
    const availableSemesters = [...new Set(teacherSubjects.map(s => `Semester ${s.semester}`))];
    const availableSubjects = teacherSubjects.map(s => s.subjectName);
    const availableClasses = [...new Set(teacherSubjects.map(s => `Division ${s.division}`))];

    // console.log("Dropdown options:", {
    //     semesters: availableSemesters,
    //     subjects: availableSubjects,
    //     classes: availableClasses
    // });

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
                        availableSubjects={availableSubjects}
                        availableSemesters={availableSemesters}
                        availableClasses={availableClasses}
                    />

                    {isLoading ? (
                        <div>Loading tasks...</div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mt-6 pb-4 border-b">
                                {/* Replace dropdown with button */}
                                <button
                                    onClick={() => setIsAddTaskModalOpen(true)}
                                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    disabled={!selectedSemester || !selectedClass}
                                >
                                    <Plus size={16} /> Add New Task
                                </button>
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

                    {/* Modal for adding tasks */}
                    {isAddTaskModalOpen && (
                        <AddTaskModal
                            isOpen={isAddTaskModalOpen}
                            onClose={() => setIsAddTaskModalOpen(false)}
                            onAddTask={handleAddTask}
                            selectedSubject={selectedSubject}
                        />
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
