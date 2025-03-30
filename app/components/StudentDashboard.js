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
    
    // Extract IDs correctly based on the actual user data structure
    const userId = user?.user?.id; // This is "usr_3" in your example
    const studentId = user?.student?.id; // This is "std_1" in your example
    
    console.log("User ID:", userId);
    console.log("Student ID:", studentId);
    console.log("Full user object:", user);
    
    // Only fetch data when we have a valid userId
    const dashboardQuery = useGetStudentDashboardQuery(
        userId ? userId : undefined, 
        {
            // Don't run the query if userId is undefined
            skip: !userId,
            // Add error handling
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
        <div className="min-h-screen bg-[#caf0f8]">
            <div className="flex min-h-screen p-4 gap-4">
                <Sidebar />
                
                <div className="flex-1 bg-white rounded-lg p-5">
                    <Header />
                    
                    <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
                    
                    <StudentInfo studentData={dashboardQuery.data} />
                    
                    {/* Display tasks based on status */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-3">Tasks ({taskStatus})</h2>
                        
                        {tasksQuery.isLoading ? (
                            <p>Loading tasks...</p>
                        ) : tasksQuery.isError ? (
                            <div>
                                <p className="text-red-600">Error loading tasks: {tasksQuery.error.message}</p>
                                <button 
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                    onClick={() => tasksQuery.refetch()}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : !tasksQuery.data || tasksQuery.data.length === 0 ? (
                            <p>No {taskStatus} tasks found.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tasksQuery.data.map(task => (
                                    <div key={task.id || task.taskId} className="border rounded-lg p-4 shadow-sm">
                                        <h3 className="font-bold">{task.title}</h3>
                                        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                        <p>Type: {task.taskType}</p>
                                        <p>Marks: {task.totalMarks}</p>
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
