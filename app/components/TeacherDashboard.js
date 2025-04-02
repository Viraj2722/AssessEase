"use client";
import React, { useState, useEffect } from 'react';
import { useGetTeacherDashboardQuery, useGetTeacherTasksQuery } from '../services/queries';
import { useAuth } from '../hooks/useAuth';
import Header from './TPHeader';
import Sidebar from './TSidebar';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TeacherDashboard = () => {
    const { user, loading, logout } = useAuth("teacher");
    const router = useRouter();

    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedTeacherSubjectId, setSelectedTeacherSubjectId] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTask, setSelectedTask] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [tasks, setTasks] = useState([]);
    const [studentData, setStudentData] = useState([]);

    // Get teacher ID from authenticated user
    const teacherId = user?.teacher?.id;

    // Get available subjects for this teacher
    const teacherSubjects = user?.teacherSubjects || [];

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
    const { data: taskData, isLoading: tasksLoading } = useGetTeacherTasksQuery(
        selectedSemester ? getSemesterNumber(selectedSemester) : null,
        selectedSubjectId,
        selectedClass ? getDivisionLetter(selectedClass) : null
    );


    // Update tasks when task data changes
    useEffect(() => {
        if (taskData?.data) {
            setTasks(taskData.data);
            // Reset selected task when task list changes
            setSelectedTask('');
            setSelectedTaskId('');
        }
    }, [taskData]);

    // Use the teacher ID and filters for fetching dashboard data
    const dashboardQuery = useGetTeacherDashboardQuery(
        selectedSemester ? getSemesterNumber(selectedSemester) : null,
        selectedSubjectId,
        selectedClass ? getDivisionLetter(selectedClass) : null,
        selectedTaskId // Add task ID to the query if needed
    );

    console.log("Dashboard query data is ", dashboardQuery.data);
    console.log("Task data is ", taskData);

    // Update student data when dashboard data changes
    useEffect(() => {
        if (dashboardQuery.data?.data) {
            // The data is directly in the data property, not in data.students
            setStudentData(dashboardQuery.data.data);
        } else {
            setStudentData([]);
        }
    }, [dashboardQuery.data]);

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
            // Reset selected task when subject changes
            setSelectedTask('');
            setSelectedTaskId('');
        }
    };

    // Handle task selection
    const handleTaskSelect = (taskName) => {
        setSelectedTask(taskName);

        // Find the matching task in tasks
        // Update to use taskType instead of type
        const task = tasks.find(t => `${t.taskType} - ${t.title}` === taskName);

        if (task) {
            // Update to use taskId instead of id
            setSelectedTaskId(task.taskId);
        } else {
            setSelectedTaskId('');
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Prepare chart data based on student performance
    const getChartData = () => {

        console.log("Student data is ", studentData);
        if (!studentData || studentData.length === 0) {
            return null;
        }

        // Get the selected task to determine total marks
        const task = tasks.find(t => t.taskId === selectedTaskId);
        const maxMarks = task?.totalMarks || 20;

        // Define performance ranges with enhanced colors
        const ranges = [
            { label: 'Failed (0-35%)', count: 0, color: 'rgba(255, 99, 132, 0.8)', hoverColor: 'rgba(255, 99, 132, 1)' },
            { label: 'Average (36-60%)', count: 0, color: 'rgba(255, 206, 86, 0.8)', hoverColor: 'rgba(255, 206, 86, 1)' },
            { label: 'Good (61-75%)', count: 0, color: 'rgba(54, 162, 235, 0.8)', hoverColor: 'rgba(54, 162, 235, 1)' },
            { label: 'Excellent (76-100%)', count: 0, color: 'rgba(75, 192, 192, 0.8)', hoverColor: 'rgba(75, 192, 192, 1)' }
        ];

        // Count students in each range
        studentData.forEach(student => {
            // Use totalMarks instead of marksObtained
            const marks = student.totalMarks || 0;
            const percentage = (marks / maxMarks) * 100;

            if (percentage <= 35) {
                ranges[0].count++;
            } else if (percentage <= 60) {
                ranges[1].count++;
            } else if (percentage <= 75) {
                ranges[2].count++;
            } else {
                ranges[3].count++;
            }
        });

        // Create chart data with hover effects
        return {
            labels: ranges.map(r => `${r.label} (${r.count} students)`),
            datasets: [
                {
                    data: ranges.map(r => r.count),
                    backgroundColor: ranges.map(r => r.color),
                    hoverBackgroundColor: ranges.map(r => r.hoverColor),
                    borderColor: ranges.map(r => '#ffffff'),
                    borderWidth: 2,
                    hoverBorderWidth: 3,
                }
            ]
        };
    };

    const chartData = getChartData();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Create arrays of unique semesters, subjects, and classes for the dropdowns
    const availableSemesters = [...new Set(teacherSubjects.map(s => `Semester ${s.semester}`))];
    const availableSubjects = teacherSubjects.map(s => s.subjectName);
    const availableClasses = [...new Set(teacherSubjects.map(s => `Division ${s.division}`))];

    // Create array of tasks for the task dropdown
    const availableTasks = tasks.map(task => `${task.taskType} - ${task.title}`);

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

                    <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
                    <p className="mb-4">Welcome, {user?.user?.fullName}</p>

                    {/* Task Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-blue-600 mb-2 transition-colors">
                            Task
                        </label>
                        <div className="relative">
                            <select
                                value={selectedTask}
                                onChange={(e) => handleTaskSelect(e.target.value)}
                                className="w-full md:w-64 appearance-none bg-white border border-gray-300 hover:border-blue-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={tasksLoading || tasks.length === 0}
                            >
                                <option value="">All Tasks</option>
                                {availableTasks.map((task, index) => (
                                    <option key={index} value={task}>
                                        {task}
                                    </option>
                                ))}
                            </select>
                           
                        </div>
                    </div>

                    {/* Dashboard Overview (Pie Chart) */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedTask
                                ? `Performance Distribution for ${selectedTask}`
                                : 'Dashboard Overview'}
                        </h2>

                        {dashboardQuery.isLoading ? (
                            <div>Loading dashboard data...</div>
                        ) : dashboardQuery.error ? (
                            <div>Error loading dashboard: {dashboardQuery.error.message}</div>
                        ) : !selectedTaskId ? (
                            <div className="text-gray-500">Select a task to view performance distribution</div>
                        ) : !chartData ? (
                            <div className="text-gray-500">No student data available for this task</div>
                        ) : (
                            <div className="w-full mx-auto transform transition-all duration-300 hover:scale-102">
                                <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-blue-400 hover:border-blue-500">
                                    <div className="flex flex-col md:flex-row items-center justify-center">
                                        {/* Chart container with fixed width */}
                                        <div className="w-full md:w-1/2 max-w-md">
                                            <Pie
                                                data={chartData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: true,
                                                    plugins: {
                                                        legend: {
                                                            display: false, // Hide legend here, we'll create a custom one
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: 'Student Performance',
                                                            font: {
                                                                size: 16,
                                                                weight: 'bold'
                                                            },
                                                            padding: {
                                                                top: 10,
                                                                bottom: 10
                                                            }
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function(context) {
                                                                    const label = context.label || '';
                                                                    const value = context.raw || 0;
                                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                                    const percentage = Math.round((value / total) * 100);
                                                                    return `${value} students (${percentage}%)`;
                                                                }
                                                            },
                                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                            padding: 12,
                                                            cornerRadius: 8,
                                                            displayColors: true,
                                                            usePointStyle: true,
                                                        }
                                                    },
                                                    elements: {
                                                        arc: {
                                                            borderWidth: 2,
                                                            borderColor: '#fff',
                                                            hoverBorderWidth: 3,
                                                            hoverOffset: 8
                                                        }
                                                    },
                                                    animation: {
                                                        animateScale: true,
                                                        animateRotate: true,
                                                        duration: 800,
                                                    }
                                                }}
                                            />
                                        </div>
                                        
                                        {/* Custom legend on the right side */}
                                        <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-6 flex flex-col justify-center">
                                            <h3 className="text-lg font-semibold mb-3 text-center md:text-left">Performance Breakdown</h3>
                                            <div className="space-y-3">
                                                {chartData.labels.map((label, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <div 
                                                            className="w-4 h-4 rounded-full mr-2" 
                                                            style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                                                        ></div>
                                                        <span className="text-sm">{label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4 text-sm text-gray-500 italic text-center md:text-left">
                                                Hover over segments for detailed information
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
