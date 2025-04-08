"use client";
import React, { useState, useEffect } from 'react';
import { useGetStudentDashboardQuery, useGetStudentTasksQuery } from '../services/queries';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import StudentInfo from './StudentInfo';
import Sidebar from './Sidebar';

const StudentDashboard = () => {
    const { user, loading } = useAuth("student");
    const [taskStatus, setTaskStatus] = useState("pending");


    const userId = user?.user?.id;
    const studentId = user?.student?.id;

    console.log("User ID:", userId);
    console.log("Student ID:", studentId);
    console.log("Full user object:", user);


    const dashboardQuery = useGetStudentDashboardQuery(
        userId ? userId : undefined,
        {

            skip: !userId,

            onError: (error) => {
                console.error("Dashboard query error:", error);
            }
        }
    );

    // Only fetch tasks when we have a valid studentId
    const tasksQuery = useGetStudentTasksQuery(
        taskStatus,
        studentId ? studentId : undefined,
        {
            // Don't run the query if studentId is undefined
            skip: !studentId,
            // Add error handling
            onError: (error) => {
                console.error("Tasks query error:", error);
            }
        }
    );

    // Log query states for debugging
    useEffect(() => {
        if (dashboardQuery.error) {
            console.error("Dashboard query error details:", dashboardQuery.error);
        }
        if (tasksQuery.error) {
            console.error("Tasks query error details:", tasksQuery.error);
        }
    }, [dashboardQuery.error, tasksQuery.error]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading authentication data...</div>;
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Authentication required</div>;
    }

    if (dashboardQuery.isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading dashboard data...</div>;
    }

    if (dashboardQuery.isError) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <h2 className="text-xl text-red-600 mb-4">Error loading dashboard</h2>
                <p className="text-gray-700">{dashboardQuery.error?.message || "Unknown error"}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => dashboardQuery.refetch()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex flex-col lg:flex-row min-h-screen p-2 lg:p-4 gap-4">
                <Sidebar />

                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-3 lg:p-5 shadow-lg">
                    <Header />

                    <h1 className="text-2xl lg:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Student Dashboard
                    </h1>

                    <StudentInfo studentData={dashboardQuery.data} />

                    {/* Display tasks based on status */}
                    <div className="mt-6 lg:mt-8">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-800">Tasks ({taskStatus})</h2>

                        {tasksQuery.isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : tasksQuery.isError ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600">Error loading tasks: {tasksQuery.error.message}</p>
                                <button
                                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                                    onClick={() => tasksQuery.refetch()}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : !tasksQuery.data || tasksQuery.data.length === 0 ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                                <p className="text-blue-600">No {taskStatus} tasks found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tasksQuery.data.map(task => (
                                    <div
                                        key={task.id || task.taskId}
                                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                                    >
                                        <h3 className="font-bold text-lg text-gray-800 mb-2">{task.title}</h3>
                                        <div className="space-y-2">
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                Type: {task.taskType}
                                            </p>
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Marks: {task.totalMarks}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
