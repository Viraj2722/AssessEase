"use client";
import React, { useState } from 'react';
import { useGetStudentDashboardQuery, useGetStudentTasksQuery } from '../services/queries';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import StudentInfo from './StudentInfo';
import Sidebar from './Sidebar';

const StudentDashboard = () => {
    const { user, loading } = useAuth("student");
    const [taskStatus, setTaskStatus] = useState("pending");
    
    // Get user ID from authenticated user
    const userId = user?.user?.id;
    const studentId = user?.student?.id;
    
    // Use the user ID for fetching dashboard data
    const dashboardQuery = useGetStudentDashboardQuery(userId);
    
    // Use the student ID for fetching tasks
    const tasksQuery = useGetStudentTasksQuery(taskStatus, studentId);
    
    if (loading || dashboardQuery.isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
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
                            <p>Error loading tasks: {tasksQuery.error.message}</p>
                        ) : tasksQuery.data?.length === 0 ? (
                            <p>No {taskStatus} tasks found.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tasksQuery.data.map(task => (
                                    <div key={task.id} className="border rounded-lg p-4 shadow-sm">
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
